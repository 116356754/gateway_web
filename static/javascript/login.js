window.onload = function() {
    $('#loading-mask').fadeOut();
};

function Event() {
    var tbl = document.getElementById("gw_addr");
    var trs = tbl.getElementsByTagName("tr");
    for (var i = 0; i < trs.length; i++) {
        trs[i].onclick = OnClick;
    }
}

var ip_value = '';

function OnClick() {
    var tbl = document.getElementById("gw_addr");
    var trs = tbl.getElementsByTagName("tr");
    for (var i = 0; i < trs.length; i++) {
        if (trs[i] == this) { //判断是不是当前选择的行
            trs[i].style.background = "gray";
            console.log(trs[i].innerText)
            ip_value = trs[i].innerText
        } else {
            trs[i].style.background = "white";
        }
    }
}

function login_callback(ip) {
    var table = document.getElementById("gw_addr");
    var x = document.getElementById('gw_addr').insertRow(table.rows.length)
    var y = x.insertCell(0)
    y.innerHTML = ip
    Event() //可以选择新插入的IP
}

// 通过UDP搜索网关IP
function search_gw() {
    $("#gw_addr").html("") // 清空table
    dialog_status = $("#dlg-url-set").parent().is(":hidden")
    if (dialog_status) {} else {
        $("#dlg-url-set").dialog('close');
        $('#gw_serach').dialog({
            title: '设备列表',
            closable: false,
            draggable: false,
            modal: true,
        });
        $("#gw_serach").dialog('open'); //必须先显示，再弹出
    }
    foo(login_callback);
    // cfxApi.startSearch(function(ip) { // 通过UDP搜索网关IP
    //     console.log(ip)
    //     var table = document.getElementById("gw_addr");
    //     var x = document.getElementById('gw_addr').insertRow(table.rows.length)
    //     var y = x.insertCell(0)
    //     y.innerHTML = ip
    //     Event() //可以选择新插入的IP
    // });
}

// 关闭自动搜索打开手动搜索窗口
function close_searchdialog() {
    $('#gw_serach').dialog('close');
    ip_value = ''
    stop_search(); //停止搜索
    $("#dlg-url-set").dialog('open');
}

function gw_connect() {
    $('#dlg-url-set').dialog({
        title: '网关连接',
        closable: true,
        draggable: false,
        modal: true,
    });
    $("#dlg-url-set").dialog('open'); //必须先显示，再弹出
    bURL = get_baseurl(); // 网关地址
    $('#gw_ip').textbox({
        value: bURL
    });
}