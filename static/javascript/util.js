function convert(rows) {
    function exists(rows, pId) {
        for (var i = 0; i < rows.length; i++) {
            if (rows[i].id == pId) return true;
        }
        return false;
    }

    var nodes = [];
    // get the top level nodes
    for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        if (!exists(rows, row.pId)) {
            nodes.push({
                id: row.id,
                text: row.name
            });
        }
    }

    var toDo = [];
    for (var i = 0; i < nodes.length; i++) {
        toDo.push(nodes[i]);
    }
    while (toDo.length) {
        var node = toDo.shift(); // the parent node
        // get the children nodes
        for (var i = 0; i < rows.length; i++) {
            var row = rows[i];
            if (row.pId == node.id) {
                var child = {
                    id: row.id,
                    text: row.name
                };
                if (node.children) {
                    node.children.push(child);
                } else {
                    node.children = [child];
                }
                toDo.push(child);
            }
        }
    }
    return nodes;
}

function showConnectErrTip() {
    var title = '服务器连接失败';
    var content = "请确认服务器配置正确，并检查网络是否通常。";
    var width = content.length + 250;
    $.messager.show({
        title: title,
        msg: content,
        timeout: 5000,
        width: width + 'px',
        showType: 'slide'
    });
}

$.extend($.fn.validatebox.defaults.rules, {
    CHS: {
        validator: function(value, param) {
            return /^[\u0391-\uFFE5]+$/.test(value);
        },
        message: '请输入汉字'
    },
    english: { // 验证英语
        validator: function(value) {
            return /^[A-Za-z]+$/i.test(value);
        },
        message: '请输入英文'
    },
    ip: { // 验证IP地址
        validator: function(value) {
            var reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
            return reg.test(value);
        },
        message: 'IP地址格式不正确'
    },
    ZIP: {
        validator: function(value, param) {
            return /^[0-9]\d{5}$/.test(value);
        },
        message: '邮政编码不存在'
    },
    QQ: {
        validator: function(value, param) {
            return /^[1-9]\d{4,10}$/.test(value);
        },
        message: 'QQ号码不正确'
    },
    mobile: {
        validator: function(value, param) {
            return /^(?:13\d|15\d|18\d)-?\d{5}(\d{3}|\*{3})$/.test(value);
        },
        message: '手机号码不正确'
    },
    tel: {
        validator: function(value, param) {
            return /^(\d{3}-|\d{4}-)?(\d{8}|\d{7})?(-\d{1,6})?$/.test(value);
        },
        message: '电话号码不正确'
    },
    mobileAndTel: {
        validator: function(value, param) {
            return /(^([0\+]\d{2,3})\d{3,4}\-\d{3,8}$)|(^([0\+]\d{2,3})\d{3,4}\d{3,8}$)|(^([0\+]\d{2,3}){0,1}13\d{9}$)|(^\d{3,4}\d{3,8}$)|(^\d{3,4}\-\d{3,8}$)/.test(value);
        },
        message: '请正确输入电话号码'
    },
    number: {
        validator: function(value, param) {
            return /^[0-9]+.?[0-9]*$/.test(value);
        },
        message: '请输入数字'
    },
    money: {
        validator: function(value, param) {
            return (/^(([1-9]\d*)|\d)(\.\d{1,2})?$/).test(value);
        },
        message: '请输入正确的金额'

    },
    mone: {
        validator: function(value, param) {
            return (/^(([1-9]\d*)|\d)(\.\d{1,2})?$/).test(value);
        },
        message: '请输入整数或小数'

    },
    integer: {
        validator: function(value, param) {
            return /^[+]?[1-9]\d*$/.test(value);
        },
        message: '请输入最小为1的整数'
    },
    integ: {
        validator: function(value, param) {
            return /^[+]?[0-9]\d*$/.test(value);
        },
        message: '请输入整数'
    },
    range: {
        validator: function(value, param) {
            if (/^[0-9]\d*$/.test(value)) {
                return value >= param[0] && value <= param[1]
            } else {
                return false;
            }
        },
        message: '输入的数字在{0}到{1}之间'
    },
    greatThan: {
        validator: function(value, param) {
            if (/^[1-9]\d*$/.test(value)) {
                return value >= param[0]
            } else {
                return false;
            }
        },
        message: '输入的数字至少大于{0}'
    },
    minLength: {
        validator: function(value, param) {
            return value.length >= param[0]
        },
        message: '至少输入{0}个字'
    },
    maxLength: {
        validator: function(value, param) {
            return value.length <= param[0]
        },
        message: '最多{0}个字'
    },
    //select即选择框的验证
    selectValid: {
        validator: function(value, param) {
            if (value == param[0]) {
                return false;
            } else {
                return true;
            }
        },
        message: '请选择'
    },
    idCode: {
        validator: function(value, param) {
            return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value);
        },
        message: '请输入正确的身份证号'
    },
    loginName: {
        validator: function(value, param) {
            return /^[\u0391-\uFFE5\w]+$/.test(value);
        },
        message: '登录名称只允许汉字、英文字母、数字及下划线。'
    },
    equalTo: {
        validator: function(value, param) {
            return value == $(param[0]).val();
        },
        message: '两次输入的字符不一至'
    },
    englishOrNum: { // 只能输入英文和数字
        validator: function(value) {
            return /^[a-zA-Z0-9_ ]{1,}$/.test(value);
        },
        message: '请输入英文、数字、下划线或者空格'
    },
    xiaoshu: {
        validator: function(value) {
            return /^(([1-9]+)|([0-9]+\.[0-9]{1,2}))$/.test(value);
        },
        message: '最多保留两位小数！'
    },
    ddPrice: {
        validator: function(value, param) {
            if (/^[1-9]\d*$/.test(value)) {
                return value >= param[0] && value <= param[1];
            } else {
                return false;
            }
        },
        message: '请输入1到100之间正整数'
    },
    jretailUpperLimit: {
        validator: function(value, param) {
            if (/^[0-9]+([.]{1}[0-9]{1,2})?$/.test(value)) {
                return parseFloat(value) > parseFloat(param[0]) && parseFloat(value) <= parseFloat(param[1]);
            } else {
                return false;
            }
        },
        message: '请输入0到100之间的最多俩位小数的数字'
    },
    rateCheck: {
        validator: function(value, param) {
            if (/^[0-9]+([.]{1}[0-9]{1,2})?$/.test(value)) {
                return parseFloat(value) > parseFloat(param[0]) && parseFloat(value) <= parseFloat(param[1]);
            } else {
                return false;
            }
        },
        message: '请输入0到1000之间的最多俩位小数的数字'
    }
});

function ExportToXls(gridName, csvName) {
    var data = JSON.stringify($("#" + gridName).datagrid('getData').rows);
    if (data == '')
        return;
    data = data.replace(/:null/g, ':""');
    JSONToCSVConvertor(gridName, data, csvName, true);
}

function JSONToCSVConvertor(gridName, JSONData, ReportTitle, ShowLabel) {
    //如果JSONData 不是json对象，就把JSONData 转换为json对象
    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;

    var CSV = '';
    if (ShowLabel) {
        var row = "";
        for (var index in arrData[0]) {
            row += index + ',';
        }
        row = row.slice(0, -1);

        var cfs = $("#" + gridName).datagrid('getColumnFields'); //这是获取到所有的Fields
        //得到title名
        var colName = [];
        for (i = 0; i < cfs.length; i++) {
            var col = $("#" + gridName).datagrid("getColumnOption", cfs[i]);
            colName.push(col.title); //把TITLEPUSH到数组里去
        }
        // console.log(colName);
        CSV += colName.join(',') + '\r\n';
        // CSV += row + '\r\n';
    }
    for (var i = 0; i < arrData.length; i++) {
        var row = "";
        cfs.forEach(function(element) {
            row += '"' + arrData[i][element] + '",';
        });
        row.slice(0, row.length - 1);
        CSV += row + '\r\n';
    }

    if (CSV == '') {
        alert("Invalid data");
        return;
    }

    //文件名
    var fileName = "MyReport_";
    fileName += ReportTitle.replace(/ /g, "_");
    downloadFile(fileName + '.csv', CSV);
}

function isIE() {
    var myNav = navigator.userAgent.toLowerCase();
    return myNav.indexOf('msie') != -1;
}


/**
 * @ngdoc function
 * @name isIEBelow10
 * @methodOf  ui.grid.exporter.service:uiGridExporterService
 * @description Checks whether current browser is IE and of version below 10
 */
function isIEBelow10() {
    var myNav = navigator.userAgent.toLowerCase();
    return (myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1]) < 10 : false;
}

/**
 * @ngdoc function
 * @name downloadFile
 * @methodOf  ui.grid.exporter.service:uiGridExporterService
 * @description Triggers download of a csv file.  Logic provided
 * by @cssensei (from his colleagues at https://github.com/ifeelgoods) in issue #2391
 * @param {string} fileName the filename we'd like our file to be
 * given
 * @param {string} csvContent the csv content that we'd like to 
 * download as a file
 */
function downloadFile(fileName, csvContent) {
    var D = document;
    var a = D.createElement('a');
    var strMimeType = 'application/octet-stream;charset=utf-8';
    var rawFile;

    if (!fileName) {
        var currentDate = new Date();
        fileName = "CSV Export - " + currentDate.getFullYear() + (currentDate.getMonth() + 1) +
            currentDate.getDate() + currentDate.getHours() +
            currentDate.getMinutes() + currentDate.getSeconds() + ".csv";
    }

    if (this.isIEBelow10()) {
        var frame = D.createElement('iframe');
        document.body.appendChild(frame);
        frame.contentWindow.document.charset = "utf-8";
        frame.contentWindow.document.open("text/html", "replace");
        // frame.contentWindow.document.write('sep=,\r\n' + csvContent);
        frame.contentWindow.document.write(csvContent);
        frame.contentWindow.document.close();
        frame.contentWindow.focus();
        frame.contentWindow.document.execCommand('SaveAs', true, fileName);

        document.body.removeChild(frame);
        return true;
    }

    // IE10+
    if (navigator.msSaveBlob) {
        return navigator.msSaveBlob(new Blob(["\ufeff", csvContent], {
            type: strMimeType
        }), fileName);
    }

    //html5 A[download]
    if ('download' in a) {
        var blob = new Blob([csvContent], {
            type: strMimeType
        });
        rawFile = URL.createObjectURL(blob);
        a.setAttribute('download', fileName);
    } else {
        rawFile = 'data:' + strMimeType + ',' + encodeURIComponent(csvContent);
        a.setAttribute('target', '_blank');
        a.setAttribute('download', fileName);
    }


    a.href = rawFile;
    a.setAttribute('style', 'display:none;');
    D.body.appendChild(a);
    setTimeout(function() {
        if (a.click) {
            a.click();
            // Workaround for Safari 5
        } else if (document.createEvent) {
            var eventObj = document.createEvent('MouseEvents');
            eventObj.initEvent('click', true, true);
            a.dispatchEvent(eventObj);
        }
        D.body.removeChild(a);

    }, 100);
}

//让ie8支持foreach
if (!Array.prototype.forEach) {

    Array.prototype.forEach = function forEach(callback, thisArg) {

        var T, k;

        if (this == null) {
            throw new TypeError("this is null or not defined");
        }
        var O = Object(this);
        var len = O.length >>> 0;
        if (typeof callback !== "function") {
            throw new TypeError(callback + " is not a function");
        }
        if (arguments.length > 1) {
            T = thisArg;
        }
        k = 0;

        while (k < len) {

            var kValue;
            if (k in O) {

                kValue = O[k];
                callback.call(T, kValue, k, O);
            }
            k++;
        }
    };
}