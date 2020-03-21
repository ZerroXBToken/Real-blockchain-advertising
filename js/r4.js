    function ethcall2(strMethodName, strInputElementName, strOutputElementName, strOutputtype, strOutputFieldNames, strBtnName) {        
   
        var functionNametoCall = "myContractInstance." + strMethodName;
        var result;
        try {
            var strparas;
            var elms = document.querySelectorAll("[id=" + strInputElementName + "]");
            //console.log("elms.length = " + elms.length);            
            for (var i = 0; i < elms.length; i++) {
                if (i == 0) {
                    strparas = "'" + add0xforAddress(Escape(elms[i].value)) + "'"
                } else {
                    strparas = strparas + ",'" + Escape(elms[i].value) + "'"
                }
                if (elms[i].value == '') {
                    document.getElementById(strInputElementName).focus();                   
                    alert('Input value cannot be empty');
                    return false;
                }
            }
            showLoading(true, strBtnName);

            new Function(functionNametoCall + "(" + strparas + ", function(err, res){ if (err) {result = err;} else { result = res; } showMessage('" + strMethodName +"',result,'" + strOutputElementName+"','" + strOutputFieldNames +"','"+ strBtnName +"');   });")();

            
           // result = eval(functionNametoCall + "(" + strparas + ");");
           
           // $('#overlay').show();
        }
        catch (err) {
            //$('#overlay').show();
            result = "" + err + "";
            showLoading(false, strBtnName);
        }
        //setTimeout(function () {
        //    $('#overlay').show();
        //}, 2500);
       
        //document.getElementById(strOutputElementName).innerHTML = "<br><br> [&nbsp;<b>" + strMethodName + "</b> method Response ]<br>" + formatmultipleoutputs(result, strOutputFieldNames) + "<br>";
             
    }

    function showMessage(strMethodName, result, strOutputElementName, strOutputFieldNames, strBtnName) {
        
        document.getElementById(strOutputElementName).innerHTML = "<br><br> [&nbsp;<b>" + strMethodName + "</b> Blockchain ]<br>" + formatmultipleoutputs(result, strOutputFieldNames) + "<br>";
        showLoading(false, strBtnName);  

         //var obj = window.parent.document.getElementById('readcontractiframe');
         //   parent.resizeIframe(obj, 0);
    }

    function showLoading(isShow, strBtnName) {
        
        if (isShow) {
            $(" <img id='waiting_" + strBtnName + "' class='waitingImg' src='https://rinkeby.etherscan.io/images/ajax-loader2.gif' style='margin-left:5px;' alt='Loading' />").insertAfter($('#' + strBtnName));
            $('#' + strBtnName).prop('disabled', true);
        } else {
            $('#' + strBtnName).prop('disabled', false);
            $('#waiting_' + strBtnName).remove(); 
        }
    }

    function Escape(val) {
        return val.replace(/'/g, "\\u0027");
    }

    function formatmultipleoutputs(strVal, strOutputFieldNames) {
        var strAnswer = '';
        //console.log("strVal = " + strVal);
        //console.log("strOutputFieldNames = " + strOutputFieldNames);
        //console.log("strVal.length = " + strVal.length);
        if (strOutputFieldNames.includes(';') == true) {
            var res_2 = strOutputFieldNames.split(';');
            for (i = 0; i < strVal.length; i++) {
                var tmparray = res_2[i].toString().split('|');
                strAnswer = strAnswer + "&nbsp;<span class='text-success'><i class='fa  fa-angle-double-right'></i></span> ";
                if (res_2[i] != null && res_2[i].toString() != '') {
                    strAnswer = strAnswer + " <strong>" + tmparray[0] + "</strong> &nbsp; <span class='text-secondary'><i>" + tmparray[1] + "</i></span> <b>:</b> &nbsp;"
                }
                strAnswer = strAnswer + formatresult(strVal[i].toString(), tmparray[1]) + "<br>";
            }
        } else {
            strAnswer = strAnswer + "&nbsp;<span class='text-success'><i class='fa  fa-angle-double-right'></i></span> ";
            if (strOutputFieldNames != '') {
                var tmparray = strOutputFieldNames.toString().split('|');
                strAnswer = strAnswer + " <strong>" + tmparray[0] + "</strong> &nbsp; <span class='text-secondary'><i>" + tmparray[1] + "</i></span> <b>:</b> &nbsp;";
                strVal = formatresult(strVal.toString(), tmparray[1])
            }
            strAnswer = strAnswer + replaceAll(strVal, ",", "<br>&nbsp;<span class='text-success'><i class='fa  fa-angle-double-right'></i></span> ") + "<br>";
        }
        return strAnswer;
    }

    function htmlEncode(value) {
        return $('<div/>').text(value).html();
    }
    function replaceAll(str, find, replace) {
        return str.replace(new RegExp(find, 'g'), replace);
    }
    function formatresult(strResult, resulttype) {
        if (resulttype.startsWith('uint')) {
            return toFixed(strResult);
        } else if (resulttype == 'string') {
            return htmlEncode(strResult);
            //return hex_to_ascii(strResult);
        } else if (resulttype == 'address') {
            if (strResult != '0x0000000000000000000000000000000000000000') {
                return "<a href='/address/" + strResult + "' target='_blank'>" + strResult + "</a>";
            } else {
                return htmlEncode(strResult);
            }
            //} else if (resulttype == 'bool') {
            //    return Boolean(remove0x(strResult));
        } else {
            return htmlEncode(strResult);
        }
    }
    function hex_to_ascii(str1) {
        var hex = str1.toString();
        var str = '';
        for (var n = 0; n < hex.length; n += 2) {
            str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
        }
        return str;
    }
    function extractaddress(str1) {
        if (str1.length > 40) {
            str1.substr(str1.length - 40)
        }
        return str1;
    }
    function remove0x(str1) {
        if (str1.startsWith("0x") == true) {
            str1 = str1.substr(str1.length - str1.length + 2);
        }
        return str1;
    }
    function add0xforAddress(straddress) {
        straddress = straddress.trim();
        if (straddress.startsWith("0x") == false && straddress.length == 40) {
            straddress = "0x" + straddress;
        }
        return straddress;
    }
    function toFixed(x) {
        if (x.indexOf("e+") !== -1) {
            var value = web3.toBigNumber(x);
            x = value.toString(10);
        }
        return x;
    }     
    setTimeout(function () {
       
    }, 0);

    function getParameterByName(name) {
            var url = window.location.href;
            name = name.replace(/[\[\]]/g, "\\$&");
            var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
                results = regex.exec(url);
            if (!results) return null;
            if (!results[2]) return '';
            return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

     $(document).ready(function () {
        $(window).keydown(function (event) {
            if (event.keyCode == 13) {
                event.preventDefault();
                return false;
            }
        });
    });