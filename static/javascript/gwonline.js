var ws = null;

$(function() {
    $("#Serial_test_baud").combobox({
        url: "../static/json/baudrate.json",
        valueField: 'text',
        textField: 'text',
        method: "GET",
        panelHeight: 'auto'
    });
    $("#Serial_test_data").combobox({
        url: "../static/json/databit.json",
        valueField: 'text',
        textField: 'text',
        method: "GET",
        panelHeight: 'auto'
    });
    $("#Serial_test_stop").combobox({
        url: "../static/json/stopbit.json",
        valueField: 'text',
        textField: 'text',
        method: "GET",
        panelHeight: 'auto'
    });
    $("#Serial_test_parity").combobox({
        url: "../static/json/parity.json",
        valueField: 'id',
        textField: 'text',
        method: "GET",
        panelHeight: 'auto'
    });


    $('#gw_tree').tree({
        url: '../static/json/gw_tree.json',
        onDblClick: function(node) { // 双击显示网关版本信息
            if (node.text != messages[initial]['index']['gw_online']) {
                setBaseUrl(node.text);
                value = get_baseurl();
                $.ajax({
                    type: 'get',
                    url: 'http://' + value + '/get_version',
                    timeout: 2000,
                    success: function(data) {
                        console.log(data)
                        document.getElementById("hardware").innerText = messages[initial]['index']['hardware_version'] + data.Model;
                        document.getElementById("software").innerText = messages[initial]['index']['software_version'] + data.Version;
                        document.getElementById("sn").innerText = "SN:" + data.SN;
                        if (data['Model'].indexOf('201') != -1) {
                            equipment_points = 512
                        } else if (data['Model'].indexOf('202') != -1) {
                            equipment_points = 512
                        } else if (data['Model'].indexOf('203') != -1) {
                            equipment_points = 512
                        } else if (data['Model'].indexOf('401') != -1) {
                            equipment_points = 512
                        } else if (data['Model'].indexOf('402') != -1) {
                            equipment_points = 1024
                        } else if (data['Model'].indexOf('412') != -1) {
                            equipment_points = 1024
                        } else if (data['Model'].indexOf('414') != -1) {
                            equipment_points = 2048
                        }
                        document.getElementById("equipment_points").innerText = messages[initial]['index']['device_point'] + equipment_points;
                        $('#gw_info').dialog({
                            title: messages[initial]['gwonline']['gw_information'],
                            closable: true,
                            draggable: false,
                            modal: true
                        });
                        $("#gw_info").dialog('open'); //必须先显示，再弹出


                    },
                    error: function(data) {
                        $.messager.alert(messages[initial]['common']['system_hint'], messages[initial]['index']['connectip_fail'].format(value), "info");
                    }
                });
            }
        },
        onClick: function(node) {
            if (node.text != messages[initial]['index']['gw_online']) {
                setBaseUrl(node.text);
                document.getElementById('mainPanle').innerHTML = '<iframe id=real_data src="../templates/real_data.html" style="width:99%;height:100%;background:#fafafa;"></iframe>'
                value = get_baseurl();
            }
        }
    });

    // 菜单栏按钮的显示
    $('#pro_device').tabs({
        onSelect: function(title, index) {
            document.getElementById('mainPanle').innerHTML = '';
            var div0 = document.getElementById("template");
            var div1 = document.getElementById("project");
            var div2 = document.getElementById("device");
            if (title == messages[initial]['index']['template']) {
                div0.style['display'] = '';
                div1.style['display'] = 'none';
                div2.style['display'] = 'none';
            } else if (title == messages[initial]['index']['project']) {
                div0.style['display'] = 'none';
                div1.style['display'] = '';
                div2.style['display'] = 'none';
            } else if (title == messages[initial]['index']['device']) {
                div0.style['display'] = 'none';
                div1.style['display'] = 'none';
                div2.style['display'] = '';
            }
        }
    });


    // 添加设备窗口
    $('#btn-add-device').bind('click', function() {
        $('#dlg-url-set').dialog({
            title: messages[initial]['index']['add_device'],
            closable: true,
            draggable: false,
            modal: true,
        });
        $("#dlg-url-set").dialog('open'); //必须先显示，再弹出
        bURL = get_baseurl(); // 网关地址
        $('#gw_ip').textbox({
            value: bURL
        });
    });

    // 搜索设备
    $('#btn-search-device').bind('click', function() {
        document.getElementById("btn-search-device").style.display = 'none';
        document.getElementById("btn-stop-device").style.display = '';
        document.getElementById('mainPanle').innerHTML = '';
        $('#gw_tree').tree('reload');
        setTimeout('search()', 500); //延时一秒搜索网关，防止ip和'在线设备在同一级'
        document.getElementById("search_label").style.display = ''; // 显示正在搜索网关标签
    });

    // 停止搜索
    $('#btn-stop-device').bind('click', function() {
        window.clearInterval(a);
        stopsearch()
    });

    // 停止搜索
    $('#btn-debug-mode').bind('click', function() {
        document.getElementById('mainPanle').innerHTML = '<iframe id=calculate src="../templates/debug.html" style="width:99%;height:100%;background:#fafafa;"></iframe>';
    });

    // 历史数据库文件夹上传
    $('#btn-history-upload').bind('click', function() {
        value = get_baseurl()
        $.messager.confirm(messages[initial]['common']['system_hint'], messages[initial]['index']['if_upload_history'].format(value), function(r) {
            if (r) {
                filefolder = cfxApi.download_cycledata('storage');
                console.log(filefolder)
                if (filefolder != '') {
                    cfxApi.downloadFolderFtp('/mnt/sd/history/', filefolder, function(status) {
                        if (status) {
                            $.messager.alert(messages[initial]['common']['system_hint'], messages[initial]['gwonline']['history_upload_success'], "info")
                        } else {
                            $.messager.alert(messages[initial]['common']['system_hint'], messages[initial]['gwonline']['history_upload_fail'], "info")
                        }
                    })
                }
            }
        });
    });
});

function gwonline_callback(ip) {
    console.log(ip)
    var root = $('#gw_tree').tree('getRoot');
    $('#gw_tree').tree('append', {
        parent: root.target,
        data: [{
            iconCls: 'icon-device',
            text: ip
        }]
    });
}

function search() {
    foo(gwonline_callback);
    a = window.setTimeout('stopsearch()', 12000)
}

function stopsearch() {
    stop_search()
    insert_info(messages[initial]['gwonline']['search_finish'])
    document.getElementById("btn-search-device").style.display = '';
    document.getElementById("btn-stop-device").style.display = 'none';
    // document.getElementById('mainPanle').innerHTML = '';
    document.getElementById("search_label").style.display = 'none';
}

function check(children) {
    var Rename = new Array();
    for (var i = 0; i < children.length; i++) {
        Rename.push(children[i].text)
    }
    return Rename;
}

// 设置网关ip
function set_ip() {
    document.getElementById('mainPanle').innerHTML = '<iframe src="../templates/ip.html" style="width:99%;height:100%;background:#fafafa;"></iframe>';
}

// 上传工程
function upload_project() {
    document.getElementById('mainPanle').innerHTML = '<iframe src="../templates/upload_project.html" style="width:99%;height:100%;background:#fafafa;"></iframe>';
}

// 设置密码
function set_passwd() {
    document.getElementById('mainPanle').innerHTML = '<iframe src="../templates/passwd_set.html" style="width:99%;height:100%;background:#fafafa;"></iframe>';
}

// 网关校时
function set_ntp() {
    document.getElementById('mainPanle').innerHTML = '<iframe src="../templates/ntp.html" style="width:99%;height:100%;background:#fafafa;"></iframe>';
}

// 重启网关
function reboot_gw() {
    document.getElementById('mainPanle').innerHTML = '<iframe src="../templates/gw_reboot.html" style="width:99%;height:100%;background:#fafafa;"></iframe>';
}

// 网关升级
function gw_update() {
    document.getElementById('mainPanle').innerHTML = '<iframe src="../templates/gw_update.html" style="width:99%;height:100%;background:#fafafa;"></iframe>';
}