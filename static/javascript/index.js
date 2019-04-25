window.onload = function() {
    $('#loading-mask').fadeOut();
};

/* ================ 深拷贝 ================ */
function deepClone(initalObj) {
    var obj = {};
    obj = JSON.parse(JSON.stringify(initalObj));

    return obj;
}

function index_callback(ip) {
    var root = $('#download_gw_tree').tree('getRoot');
    $('#download_gw_tree').tree('append', {
        parent: root.target,
        data: [{
            iconCls: 'icon-device',
            text: ip
        }]
    });
}

// 在下载工程窗口动态添加搜索到的ip
function add_gw() {
    foo(index_callback);
    // var root = $('#download_gw_tree').tree('getRoot');
    // cfxApi.startSearch(function(ip) {
    //     $('#download_gw_tree').tree('append', {
    //         parent: root.target,
    //         data: [{
    //             iconCls: 'icon-device',
    //             text: ip
    //         }]
    //     });
    // });
    window.setTimeout('search_stop()', 10000)
}

function search_stop() {
    stop_search();
    document.getElementById("download_search_label").style.display = 'none';
}

function gw_ntp() {
    value = get_baseurl();
    $.messager.confirm(messages[initial]['common']['system_hint'], messages[initial]['index']['ntp'].format(value), function(r) {
        if (r) {
            var now = new Date()
            $.ajax({
                type: 'post',
                url: 'http://' + value + '/gw_ntp',
                data: {
                    "time": now.getTime()
                },
                timeout: 5000,
                success: function(data) {
                    if (data.status = true) {
                        insert_info(messages[initial]['index']['ntp_success'])
                    };
                },
                error: function() {
                    $.messager.alert(messages[initial]['common']['system_hint'], messages[initial]['index']['connectip_fail'].format(value), "info");
                }
            });
        }
    });
}

// 打开putty.exe
function open_putty() {
    openurl(cfxApi.getCurrentDirectory() + '/putty/putty.exe')
}

function IniEvent() {
    var tbl = document.getElementById("project_name");
    var trs = tbl.getElementsByTagName("tr");
    for (var i = 0; i < trs.length; i++) {
        trs[i].onclick = TrOnClick;
    }
}

var ip_value = '';
var checked = true; // 系统日志是否滚动的标识

function TrOnClick() {
    var tbl = document.getElementById("project_name");
    var trs = tbl.getElementsByTagName("tr");
    for (var i = 0; i < trs.length; i++) {
        if (trs[i] == this) { //判断是不是当前选择的行
            trs[i].style.background = "gray";
            $('#text').textbox('setText', trs[i].innerText); // 文本框中设置值为选中的文件夹的名称
        } else {
            trs[i].style.background = "white";
        }
    }
}

// 新建工程
function create_new() {
    display_dialog('project_new', messages[initial]['index']['New_project']);
}

// 删除工程
function delete_pro() {
    var dir = $('#text').textbox('getText'); // 选中的文件夹名称
    if (dir) {
        $.messager.confirm(messages[initial]['common']['system_hint'], messages[initial]['index']['if_delete_pro'].format(dir), function(r) {
            if (r) {
                deletedir(project_path + dir);
                $('#text').textbox('setText', ''); // 清空选中的文件夹
                insert_info(messages[initial]['index']['delete_pro_success'].format(dir))
                load_proname();
                $("#tt").tree({
                    data: []
                });
                document.getElementById('mainPanle').innerHTML = '';
            }
        });
    } else {
        $.messager.alert(messages[initial]['common']['system_hint'], messages[initial]['index']['noselect_pro']);
    }
}

function new_treejson(gw_type, gw_version, gw_remark) {
    RTUmainsite = [{ "text": "ModbusRTUClient", "id": "ModbusRTUClient" }, { "text": "DL/T 645", "id": "DLT645" }, { "text": "CJ188", "id": "CJ188" }, { "text": "BACnetMSTP", "id": "BACnetMSTP" }, { "text": "Siemens S7-200 PPI", "id": "S7_200_PPI" }, { "text": "MBus_EnergyMeter", "id": "MBus_EnergyMeter" }];
    TCPmainsite = [{ "text": "ModbusTCPClient", "id": "ModbusTCPClient" }, { "text": "ModbusRTU_over_TCP", "id": "ModbusRTU_over_TCP" }, { "text": "BACnetIP", "id": "BACnetIP" }, { "text": "Siemens S7-200 Network", "id": "S7_200_Network" }, { "text": "Siemens S7-1200 Network", "id": "S7_1200_Network" }, { "text": "Danfoss", "id": "Danfoss" }];
    RTUmainsite_noMSTP = [{ "text": "ModbusRTUClient", "id": "ModbusRTUClient" }, { "text": "DL/T 645", "id": "DLT645" }, { "text": "CJ188", "id": "CJ188" }, { "text": "Siemens S7-200 PPI", "id": "S7_200_PPI" }, { "text": "MBus_EnergyMeter", "id": "MBus_EnergyMeter" }];
    comport = [{ "text": "com1", "selected": true }];
    for (i = 2; i < 21; i++) {
        comtext = {};
        comtext['text'] = "com" + String(i);
        comport.push(comtext);
    }
    oneth_feature = [
        [{ "text": "ETH0", "selected": true }], comport
    ];
    twoth_feature = [
        [{ "text": "ETH0", "selected": true }, { "text": "ETH1" }], comport
    ];
    if (gw_version.indexOf(oemData["201"]) != -1 || gw_version.indexOf(oemData["203"]) != -1) {
        RTUmainsite = RTUmainsite_noMSTP
        feature = oneth_feature;
    } else if (gw_version.indexOf(oemData["401"]) != -1) {
        RTUmainsite = RTUmainsite_noMSTP
        feature = twoth_feature;
    } else if (gw_version.indexOf(oemData["202"]) != -1) {
        RTUmainsite = RTUmainsite_noMSTP
        feature = oneth_feature;
    } else if (gw_version.indexOf(oemData["402"]) != -1) {
        feature = twoth_feature;
    } else if (gw_version.indexOf(oemData["412"]) != -1) {
        feature = twoth_feature;
    } else if (gw_version.indexOf(oemData["414"]) != -1) {
        feature = twoth_feature;
    }
    slave = oemData[initial]["slave"][gw_type];
    return { 'feature': feature, "RTUmainsite": RTUmainsite, "TCPmainsite": TCPmainsite, "slave": slave, 'gw_type': gw_type, 'version': gw_version, 'remark': gw_remark, "language": initial };
}

// 打开工程，设置tree和主页面edatagrid的url
function project_open(type) {
    var dir = $('#text').textbox('getText'); // 选中的文件夹名称
    if (dir) {
        var content = scanDir('Project/' + dir);
        var obj = JSON.parse(content);
        var proExist = false;
        obj.forEach(function(db) {
            if (db["Name"] == "Gateway.db") {
                proExist = true;
            }
        })
        if (!proExist) {
            $('#tt').tree({
                data: [{
                    text: dir,
                    iconCls: "icon-device1"
                }]
            });
        } else {
            sql = "select * from gw";
            result = selectsql('Project/' + dir + '/Gateway', sql);
            gw_conf1 = JSON.parse(result);
            gw_conf2 = new_treejson(gw_conf1[0]["gwType"], gw_conf1[0]["version"], gw_conf1[0]["remark"]);
            $('#tt').tree({
                data: [{
                    text: dir,
                    iconCls: "icon-device1"
                }]
            });
            var root = $('#tt').tree('getRoot');
            server_array = server_display(gw_conf2);
            sql = "select * from Channel,protocol WHERE Channel.protocol = protocol.name";
            channel_result = selectsql('Project/' + dir + '/Gateway', sql);
            channel_result_object = JSON.parse(channel_result);
            channel_result_object.forEach(function(channel) {
                sql = "select * from '{0}' where channelName = '{1}'".format(channel['type'], channel['text']);
                channel_extra_result = selectsql('Project/' + dir + '/Gateway', sql);
                channel_extra_result_object = JSON.parse(channel_extra_result);
                channel_extra_result_object.forEach(function(channel_extra) {
                    channel = $.extend(channel, channel_extra);
                });

                sql = "select * from device where channelName='{0}'".format(channel['text']);
                device_result = selectsql('Project/' + dir + '/Gateway', sql);
                device_result_object = JSON.parse(device_result);
                device_result_object.forEach(function(device) {
                    device['iconCls'] = 'icon-meter';
                    device['protocol'] = channel['protocol'];
                    device['category'] = channel['category'];
                })
                channel['children'] = device_result_object;
                channel['iconCls'] = 'icon-channel';
            });
            child1 = [{
                    'text': messages[initial]['index']['collect_server'],
                    iconCls: 'icon-data-center',
                    children: [
                        { 'text': messages[initial]['index']['io'], iconCls: 'icon-io-point', children: channel_result_object },
                        { 'text': messages[initial]['index']['user'], 'pointName': "user", iconCls: 'icon-user-point' },
                        { 'text': messages[initial]['index']['calculate'], 'pointName': "calculate", iconCls: 'icon-calculation-point' },
                        { 'text': messages[initial]['index']['system'], 'pointName': "system", iconCls: 'icon-system-point' }
                    ]
                },
                { 'text': messages[initial]['index']['cycle_storage'], iconCls: 'icon-data-storage' }
            ]
            server_array.forEach(function(oneserver) {
                child1.push(oneserver)
            })
            child1.push({ 'text': messages[initial]['index']['scheduler'], iconCls: 'icon-scheduler' });
            child1.push({ 'text': messages[initial]['index']['alarm_event'], iconCls: 'icon-alarm_event' });
            child1.push({ 'text': messages[initial]['index']['js_script'], iconCls: 'icon-js_script' });

            $('#tt').tree('append', {
                parent: root.target,
                data: [{
                    text: gw_conf1[0]["gwName"],
                    iconCls: 'icon-new-device',
                    children: child1,
                    feature: gw_conf2['feature'], // 串口和网口的信息
                    version: gw_conf1[0]['version'],
                    remark: gw_conf1[0]['remark'],
                    RTUmainsite: gw_conf2['RTUmainsite'],
                    TCPmainsite: gw_conf2['TCPmainsite'],
                    slave: gw_conf2['slave'],
                    gw_type: gw_conf1[0]['gwType']
                }]
            });
        }
        if (type == 'dialog') {
            $("#project_open").dialog('close');
        }
        insert_info(messages[initial]['index']['openpro_success'].format(dir));
        if (type != 'Backup') {
            document.getElementById('mainPanle').innerHTML = ""; // 关闭打开的iframe
        }
    } else {
        $.messager.alert(messages[initial]['common']['system_hint'], messages[initial]['index']['noselect_pro']);
    }
}

function server_display(gw_conf2) { // 根据选择的网关型号显示服务类型
    var server_array = new Array();
    var child2 = new Array();
    if (gw_conf2['slave'].indexOf('modbus_slave') != -1) {
        child2.push({ 'text': 'Modbus Service', iconCls: 'icon-Modbus' });
    }
    if (gw_conf2['slave'].indexOf('BACnet_Service') != -1) {
        child2.push({ 'text': 'BACnet Service', iconCls: 'icon-upload-BaCnet' });
    }
    if (gw_conf2['slave'].indexOf('DLT645') != -1) {
        child2.push({ 'text': 'DLT645', iconCls: 'icon-upload-dlt645' });
    }
    if (gw_conf2['slave'].indexOf('OPC_UA') != -1) {
        child2.push({ 'text': 'OPC UA', iconCls: 'icon-upload-OPC' });
    }
    if (JSON.stringify(child2) != '[]') {
        server_array.push({
            'text': messages[initial]['index']['data_server'],
            iconCls: 'icon-agreement-service',
            children: child2
        })
    };

    var child3 = new Array();
    if (gw_conf2['slave'].indexOf('mqtt') != -1) {
        child3.push({ 'text': 'Mqtt Client', iconCls: 'icon-upload-mqtt' });
    }
    if (gw_conf2['slave'].indexOf('luomiyun') != -1) {
        child3.push({ 'text': luomiyun_name, iconCls: 'icon-upload-luomiyun' });
    }
    if (JSON.stringify(child3) != '[]') {
        server_array.push({
            'text': 'IOT',
            iconCls: 'icon-upload-mqtt',
            children: child3
        })
    };
    return server_array;
}

function project_open_dialog() {
    $("#text").next().hide(); // 隐藏textbox
    display_dialog('project_open', messages[initial]['index']['projectManagement']);
    $('#project_open').dialog({
        buttons: [{
                text: messages[initial]['index']['New_project'],
                iconCls: 'icon-new-project',
                handler: function() { // 新建工程
                    create_new();
                }
            },
            {
                text: messages[initial]['index']['delete_pro'],
                iconCls: 'icon-cancel',
                handler: function() {
                    delete_pro();
                }
            },
            {
                text: messages[initial]['index']['Open_project'],
                iconCls: 'icon-ok',
                handler: function() {
                    project_open('dialog')
                }
            }
        ]
    });
    load_proname();
}

// 关闭打开工程窗口
function project_open_close() {
    $('#text').textbox('setText', ''); // 没有选中的文件夹即没有打开工程
    $("#project_open").dialog('close');
}

function addElementLi(obj, name) { // 往ul标签中添加'a'标签
    var ul = document.getElementById(obj);
    var li = document.createElement("a");
    li.innerHTML = "<span class='icon-device1'></span>" + name;
    ul.appendChild(li);
}

function a_style() { // 判断选中
    var container = document.getElementById('container')
    a = container.getElementsByTagName('a')
    aa = container.getElementsByTagName('a')[0]
    for (var i = 0; i < a.length; i++) {
        var aa = a[i]
        aa.onclick = check;
    }
}

function check() { // 设置选中文件夹
    for (var k = 0; k < a.length; k++) {
        if (a[k] == this) { //判断是不是当前选择的行
            a[k].className = 'active'
            console.log(a[k].innerHTML.split("</span>")[1])
            $('#text').textbox('setText', a[k].innerHTML.split("</span>")[1]); // 文本框中设置值为选中的文件夹的名称
            $('#pro_path').html('&#12288;&#12288;&#12288;' + messages[initial]['index']['project_path'] + getCurrentDirectory() + '\\Project\\' + a[k].innerHTML.split("</span>")[1])
        } else {
            a[k].className = ''
        }
    }
}

// 在table中加载所有工程名称
function load_proname() {
    $('#ull a').each(function() { // 移除ul下所有a标签
        $(this).remove();
    });
    var content = scanPro(project_path);
    var a = JSON.parse(content);
    for (var s = 0; s < a.length; s++) {
        addElementLi('ull', a[s]);
        a_style();
    }
}

// 在Project文件夹中新建文件夹并创建初始lm.db
function project_new() {
    var dialog_title = $('#project_new').dialog('options').title;
    var dir = $('#pro_new').textbox('getText'); // 新建的文件夹名称
    var data = [{ "text": dir, 'iconCls': 'icon-device1', "children": [] }];
    if (dir) {
        var content = scanPro(project_path);
        if (content.indexOf(dir) == '-1') { // 不存在重名工程
            createdir(project_path + dir);
            $('#project_new').dialog('close');
            insert_info(messages[initial]['index']['create_success'].format(dir))
            load_proname();
            $('#text').textbox('setText', dir);
            project_open('hidden');
        } else {
            $.messager.alert(messages[initial]['common']['system_hint'], messages[initial]['index']['pro_already'].format(dir));
        }
    } else {
        $.messager.alert(messages[initial]['common']['system_hint'], messages[initial]['index']['no_proname']);
    }
}

function insert_info(data) {
    $("#real_log").append(data + '\n<br>').css("color", "#000000");
    if (checked) {
        $("#real_log").scrollTop($('#real_log').get(0).scrollHeight - $("#real_log").height());
    }
}

function log_save() { // 系统日志保存
    text = $("#real_log").text();
    var blob = new Blob([text], { type: "" });
    saveAs(blob, "log.txt");
}

function log_delete() { // 系统日志清空
    $("#real_log").empty();
}


$(function() {
    load_template(); // 打开软件时显示所有模板

    $("#real_event").datagrid({
        striped: true,
        rownumbers: false, // 行号
        idField: messages[initial]['index']['time'],
        onRowContextMenu: function(e, index, row) {
            $('#log_row').menu('show', {
                left: e.pageX,
                top: e.pageY
            });
        },
        columns: [
            [{
                    field: "时间",
                    title: messages[initial]['index']['time'],
                    width: 120,
                    editor: {
                        type: 'textbox',
                        options: {
                            validType: "maxLength[15]"
                        }
                    }
                },
                {
                    field: "信息",
                    title: messages[initial]['index']['information'],
                    width: 600,
                    editor: {
                        type: 'textbox'
                    }
                }
            ]
        ]
    });
    insert_info(messages[initial]['index']['running']);


    $('#download_gw_tree').tree({
        url: '../static/json/gw_tree.json',
        onClick: function(node) {
            var node = $('#download_gw_tree').tree('getSelected');
            if (node.text != messages[initial]['index']['gw_online']) {
                setBaseUrl(node.text);
            }
        }
    });

    $('#file_gw_tree').tree({
        url: '../static/json/file_tree.json'
    });


    value = get_baseurl();

    //帮助文档
    $('#btn-help').bind('click', function() {
        openchm();
    });

    // 检测版本更新
    // document.getElementById('btn-update').onclick = function() {
    //     cfxApi.checkUpdate("http://17589g5l74.51mypc.cn:8081/AutoUpdater.xml");
    // };

    //关于
    $('#btn-about').bind('click', function() {
        // $("#dlg-about").show();
        $('#dlg-about').dialog({
            title: '关于',
            closed: true,
            modal: true,
            href: './about.html'
        });
        $("#dlg-about").dialog('open'); //必须先显示，再弹出
    });

    //版本发布说明
    $('#btn-version').bind('click', function() {
        window.open('version_log.html')
    });

    //电脑注册
    $('#btn-registered').bind('click', function() {
        status = cfxApi.isExistUkey()
        if (status == "true") {
            $.messager.alert(messages[initial]['common']['system_hint'], messages[initial]['index']['registration_code_correct'], "info")
        } else {
            $.messager.alert(messages[initial]['common']['system_hint'], messages[initial]['index']['registration_code_incorrect'], "info")
        }
    });

    setInterval(function() //开启循环：每10分钟检测一次系统日志是否达到1000条
        {
            log_height = $('#real_log').get(0).scrollHeight;
            if (log_height > 100000) {
                $("#real_log").empty();
            }
        }, 600000);

    $("#log_scroll_btn").change(function() {
        if ($("#log_scroll_btn").is(":checked")) {
            checked = true
        } else {
            checked = false
        }
    });
});
//查询报警记录
function alarm_inquire() {
    document.getElementById('mainPanle').innerHTML = '<iframe id=select_alarm src="../templates/select_alarm.html" style="width:100%;height:100%;background:#fafafa;"></iframe>';
}

function addTab(subtitle, url, icon) {
    document.getElementById('mainPanle').innerHTML = '<iframe src=../templates/modbus_master.html style="width:100%;height:100%;background:#fafafa;"></iframe>';
}

// windows运行工程时禁用按钮和选项卡
function disableBtnTabs() {
    $('#new_pro_btn').linkbutton('disable');
    $('#open_pro_btn').linkbutton('disable');
    $('#download_pro_btn').linkbutton('disable');
    $('#language').linkbutton('disable');
    $('#pro_device').tabs('disableTab', 1);
    $('#pro_device').tabs('disableTab', 2);
}

// windows结束运行工程时启用按钮和选项卡
function enableBtnTabs() {
    $('#new_pro_btn').linkbutton('enable');
    $('#open_pro_btn').linkbutton('enable');
    $('#download_pro_btn').linkbutton('enable');
    $('#language').linkbutton('enable');
    $('#pro_device').tabs('enableTab', 1);
    $('#pro_device').tabs('enableTab', 2);
}

// 启动监控按钮
function start_pro() {
    status = cfxApi.isExistUkey();
    if (status == "false") {
        $.messager.show({
            title: 'Message',
            msg: messages[initial]['index']['not_authorized'],
            timeout: 5000,
            showType: 'slide'
        });
    }

    dir = $('#text').textbox('getText'); // 选中的文件夹名称
    if (dir != "") {
        root = $("#tt").tree('getRoot');
        db_name = "Gateway.db";
        if (db_name != "") {
            document.getElementById('mainPanle').innerHTML = '';
            document.getElementById("btn-project-start").style.display = 'none';
            document.getElementById("btn-project-stop").style.display = '';
            insert_info(messages[initial]['index']['starting_pro']);
            treeDebugMode();
            cfxApi.startProcess('gw.exe', '"' + cfxApi.getCurrentDirectory() + '\\Project\\' + dir + "\\" + db_name + '"', function(log) {
                display_gwlog(log);
            });
            disableBtnTabs();
        } else {
            $.messager.alert(messages[initial]['common']['system_hint'], "请先在工程中建立网关设备");
        }
    } else {
        $.messager.alert(messages[initial]['common']['system_hint'], messages[initial]['index']['please_openpro']);
    }
}

// 显示gw.exe的输出日志
function display_gwlog(log_string) {
    // console.log(log_string);
    insert_info(log_string);
}

// 结束监控按钮
function stop_pro() {
    document.getElementById('mainPanle').innerHTML = '';
    insert_info(messages[initial]['index']['stoping_pro']);
    treeConfigMode();
    cfxApi.killGwExists();
    enableBtnTabs();
}