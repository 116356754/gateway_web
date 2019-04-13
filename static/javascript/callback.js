function showDownloadTip(title, content) {
    console.log(content)
    content = '<a href="javascript:void(0)" onclick="openurl(\'' + content + '\')">' + content + '</a>';
    console.log(content.length);
    var width = content.length + 180;
    //$.messager.show({
    //    title: title,
    //    msg: content,
    //    width: width + 'px',
    //    timeout: 5000,
    //    showType: 'slide'
    //});
}

function showTip(title, content) {
    var width = content.length + 250;
    $.messager.show({
        title: title,
        msg: content,
        timeout: 5000,
        width: width + 'px',
        showType: 'slide'
    });
}

function showUpdateConfirm(title, msg) {
    $.messager.confirm(title, msg, function(r) {
        if (r) {
            cfxApi.updateNow();
        }
    });
}

function udpLoging(msg) {
    //var win = document.getElementById("real_data").contentWindow;
    //win.postMessage(msg, "*"); // postMessage,将实时报文传送到id为real的iframe中

    var select = $('#list').tree('getSelected');
    var strs = new Array(); //定义一数组
    strs = msg.split("---:"); //字符分割
    a = strs[3].indexOf('send');
    if (a == -1) {
        a = strs[3].indexOf('recv');
    }
    com = strs[3].substring(0, a - 1);
    com_name = {
        'com1': ['/dev/ttyAMA0', '/dev/ttyS1', '/dev/ttySP1', '/dev/ttyO2', '/dev/ttySAC0'],
        'com2': ['/dev/ttyAMA1', '/dev/ttyS2', '/dev/ttySP2', '/dev/ttySAC1'],
        'com3': ['/dev/ttyAMA2', '/dev/ttySAC2'],
        'com4': ['/dev/ttyAMA3', '/dev/ttySAC3']
    };
    if (com == select.text) {
        var ele = document.getElementById("monitor_message");
        ele.value = ele.value + '\n' + strs[3];
        ele.scrollTop = ele.scrollHeight; // 自动滚动到最后一行
    } else if (['com1', 'com2', 'com3', 'com4'].indexOf(select.text) != -1) {
        if (com_name[select.text].indexOf(com) != -1) {
            var ele = document.getElementById("monitor_message");
            ele.value = ele.value + '\n' + strs[3];
            ele.scrollTop = ele.scrollHeight; // 自动滚动到最后一行
        }
    }
}
// $.getJSON('../js/config.json').done(function(config) {});

// 显示单个设备的实时数据
function display_gwdata(data) {
    debug_real_data = data;
}

// gw.exe的状态
function gwStatus(data) {
    $.messager.show({
        title: 'Message',
        msg: "工程已停止运行",
        timeout: 5000,
        showType: 'slide'
    });
    document.getElementById("btn-project-start").style.display = '';
    document.getElementById("btn-project-stop").style.display = 'none';
    document.getElementById('mainPanle').innerHTML = ''; // 防止此时还在实时监控的页面每隔10S请求一次数据
    treeConfigMode();
    enableBtnTabs();
}