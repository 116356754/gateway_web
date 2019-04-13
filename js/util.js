//从C#的app.config得到远程接口的URL
function getConfig() {
    //从C#获取远程业务服务器的URL地址
    config = cfxApi.getBaseUrl();

    config = JSON.parse(config);
    // console.log(config);
    if (!config.baseUrl.endsWith("/"))
        config.baseUrl = config.baseUrl + '/'

    // console.log(config);
    return config;
}

/*
   "current_min": "1.00",
  "current_max": "2.00",
  "voltage_min": "220",
  "voltage_max": "230",
  "pf_min": "0.50",
  "pf_max": "1.00"
  */
//根据这个URL请求远程的折线图阈值参数
function getDoorConfig() {
    var doorConfig;
    if (!sessionStorage.getItem('ecconf')) {
        $.ajaxSettings.async = false;
        $.getJSON(config.baseUrl + 'config/ecconf.json', function(data) {
            console.log('发送echarts配置文件请求');
            doorConfig = data;
            sessionStorage.setItem('ecconf', JSON.stringify(doorConfig));
        });

        $.ajaxSettings.async = true;
    } else {
        doorConfig = JSON.parse(sessionStorage.getItem('ecconf'));
    }
    return doorConfig;
}


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

//计算日期天数差
function DateDiff(sDate1, sDate2) { //sDate1和sDate2是2006-12-18格式   
    var aDate, oDate1, oDate2, iDays
    aDate = sDate1.split("-")

    oDate1 = new Date(aDate[0] + '-' + aDate[1] + '-' + aDate[2]) //转换为12/18/2006格式  

    aDate = sDate2.split("-");
    oDate2 = new Date(aDate[0] + '-' + aDate[1] + '-' + aDate[2]);

    iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24) //把相差的毫秒数转换为天数 
        // console.log(oDate1, oDate2);
    return iDays
}

//验证第二个日期框的时间不能比第一个日期框的天数超过一周
$.extend($.fn.validatebox.defaults.rules, {
    /* 两个日期进行比较 */
    afterWeekDate: {
        validator: function(value, param) {
            //这里获取日期的方式不一样
            var date = $(param[0]).datebox('getValue');
            console.log(date, value);
            return (value >= date) && (DateDiff(date, value) < 7);
        },
        message: '结束时间必须比不得超过开始时间一周'
    }
})

//验证第二个日期框的时间不能比第一个日期框的迟
$.extend($.fn.validatebox.defaults.rules, {
    /* 两个日期进行比较 */
    afterDate: {
        validator: function(value, param) {
            //这里获取日期的方式不一样
            var date = $(param[0]).datebox('getValue');
            return value >= date;
        },
        message: '结束时间必须比开始时间迟'
    }
})

//得到查询参数
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = location.search.substr(1).match(reg);
    if (r != null) return unescape(decodeURI(r[2]));
    return null;
}

//下载csv文件
function downloadFile(url) {
    try {
        var elemIF = document.createElement("iframe");
        elemIF.src = url;
        elemIF.style.display = "none";
        document.body.appendChild(elemIF);
    } catch (e) {}
}

function getECRange() {
    var rangeData = {};
    if (localStorage.getItem('ecrange') == undefined) {
        rangeData.ecDefaultRange = true;
        localStorage.setItem('ecrange', JSON.stringify(rangeData));
    } else {
        rangeData = JSON.parse(localStorage.getItem('ecrange'));
    }
    return rangeData;
}

function setEcRange(rangeData) {
    if (typeof rangeData != "object")
        return;
    localStorage.setItem('ecrange', JSON.stringify(rangeData));
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

//加载该节点下的子树，用于减法计算
function loadMinusSubNode(node) {
    $('#e_num_minus').combotree({
        //加载一个combotree,并展开所有节点，因为展开后才能显示选中的值                 
        url: config.baseUrl + "queryArea/queryDepartSubGW",
        method: 'POST',
        editable: false,
        checkbox: true,
        multiple: true,
        onlyLeafCheck: true,
        queryParams: {
            departId: node.id
        },
        onBeforeLoad: function() {
            $.messager.progress({
                msg: '正在加载中。。。',
                interval: 500
            });
        },
        loadFilter: function(rows) {
            return convert(rows);
        },
        onLoadError: function() {
            showConnectErrTip();
            $.messager.progress('close');
        },
        onLoadSuccess: function(node, data) {
            var t = $("#e_num_minus").combotree('tree');
            //获取tree 		 
            for (var i = 0; i < data.length; i++) {
                node = t.tree("find", data[i].id);
                t.tree('expandAll', node.target);
                //展开所有节点                        
            }
            $.messager.progress('close');
        }
    });
}