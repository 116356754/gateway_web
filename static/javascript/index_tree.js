var TimeFn = null;

// 配置模式下单击的事件
function treeConfigMode() {
    $('#tt').tree({
        onClick: function(row) {
            var level = easyui_tree_options.getLevel(this, row);
            // clearTimeout(TimeFn);
            // //执行延时
            // TimeFn = setTimeout(function() {
            document.getElementById('mainPanle').innerHTML = '';
            if (level == 4 && row.iconCls == 'icon-calculation-point') { // 显示计算点配置窗口
                document.getElementById('mainPanle').innerHTML = '<iframe id=calculate src="../templates/calculate.html" style="width:100%;height:100%;background:#fafafa;"></iframe>';
            } else if (level == 4 && row.iconCls == 'icon-user-point') { // 显示用户点配置窗口
                document.getElementById('mainPanle').innerHTML = '<iframe id=user src="../templates/user_point.html" style="width:100%;height:100%;background:#fafafa;"></iframe>';
            } else if (level == 4 && row.iconCls == 'icon-system-point') { // 显示系统点配置窗口
                document.getElementById('mainPanle').innerHTML = '<iframe id=system src="../templates/system_point.html" style="width:100%;height:100%;background:#fafafa;"></iframe>';
            } else if (level == 3 && row.iconCls == 'icon-data-storage') {
                document.getElementById('mainPanle').innerHTML = '<iframe id=data_storage src="../templates/data_storage.html" style="width:100%;height:100%;background:#fafafa;"></iframe>';
            } else if (level == 3 && row.iconCls == 'icon-scheduler') {
                document.getElementById('mainPanle').innerHTML = '<iframe id=scheduler src="../templates/scheduler.html" style="width:100%;height:100%;background:#fafafa;"></iframe>';
            } else if (level == 3 && row.iconCls == 'icon-alarm_event') {
                document.getElementById('mainPanle').innerHTML = '<iframe id=alarm_event src="../templates/event.html" style="width:100%;height:100%;background:#fafafa;"></iframe>';
            } else if (level == 3 && row.iconCls == 'icon-js_script') {
                document.getElementById('mainPanle').innerHTML = '<iframe id=js_script src="../templates/js_script.html" style="width:100%;height:100%;background:#fafafa;"></iframe>';
            } else if (level == 4 && row.iconCls == 'icon-Modbus') {
                document.getElementById('mainPanle').innerHTML = '<iframe id=modbus_slave src="../templates/modbus_slave.html" frameborder="0" framespacing="0" style="width:100%;height:100%;background:#fafafa;"></iframe>';
            } else if (level == 4 && row.iconCls == 'icon-upload-mqtt') {
                document.getElementById('mainPanle').innerHTML = '<iframe id=mqtt src="../templates/mqtt.html" style="width:100%;height:100%;background:#fafafa;"></iframe>';
            } else if (level == 4 && row.iconCls == 'icon-upload-luomiyun') {
                document.getElementById('mainPanle').innerHTML = '<iframe id=luomiyun src="../templates/luomiyun.html" style="width:100%;height:100%;background:#fafafa;"></iframe>';
            } else if (level == 4 && row.iconCls == 'icon-upload-BaCnet') {
                document.getElementById('mainPanle').innerHTML = '<iframe id=BaCnet_Service src="../templates/BaCnet Service.html" style="width:100%;height:100%;background:#fafafa;"></iframe>';
            } else if (level == 4 && row.iconCls == 'icon-upload-dlt645') {
                document.getElementById('mainPanle').innerHTML = '<iframe id=dlt645_reverse src="../templates/dlt645_reverse.html" style="width:100%;height:100%;background:#fafafa;"></iframe>';
            } else if (level == 4 && row.iconCls == 'icon-upload-OPC') {
                document.getElementById('mainPanle').innerHTML = '<iframe id=OPC_UA src="../templates/OPC UA.html" style="width:100%;height:100%;background:#fafafa;"></iframe>';
            } else if (level == 6) { // 单击设备弹出配置界面
                var select = $("#tt").tree('getSelected');
                var select_1 = $("#tt").tree('getParent', select.target);
                src = "../templates/" + select_1.protocol + ".html";
                document.getElementById('mainPanle').innerHTML = '<iframe src="' + src + '" style="width:100%;height:100%;background:#fafafa;"></iframe>';
            }
        }
    })
}

// 监控模式下单击的事件
function treeDebugMode() {
    root = $('#tt').tree("getRoot");
    $('#tt').tree({
        data: [root],
        onClick: function(row) {
            var level = easyui_tree_options.getLevel(this, row);
            if (level == 6) {
                document.getElementById('mainPanle').innerHTML = '<iframe id=debug_real src="../templates/debug_real.html" style="width:100%;height:100%;background:#fafafa;"></iframe>';
                cfxApi.sendCodetoNamepipe(row.text);
            } else {
                if (['icon-calculation-point', 'icon-user-point', 'icon-system-point'].indexOf(row.iconCls) != -1) {
                    document.getElementById('mainPanle').innerHTML = '<iframe id=debug_real src="../templates/debug_real.html" style="width:100%;height:100%;background:#fafafa;"></iframe>';
                    cfxApi.sendCodetoNamepipe(row.pointName);
                } else {
                    // $(this).addClass('tree-disable');
                    document.getElementById('mainPanle').innerHTML = '';
                }
            }
        }
    });
}


$(function() {
    $('#gw_type').combobox({
        onChange: function(newValue, oldValue) {
            $("#gw_version").combobox({
                valueField: 'text',
                textField: 'text',
                data: oemData[initial]["gw_version"][newValue]
            });
        }
    });

    $('#tt').tree({
        data: [],
        lines: true,
        onDblClick: function(node) {
            console.log(node)
                // clearTimeout(TimeFn);
            document.getElementById('mainPanle').innerHTML = '';
            var level = easyui_tree_options.getLevel(this, node);
            var parent = $('#tt').tree('getParent', node.target);
            if (level == 1) {} else if (level == 2) { // 显示新建网关设备窗口
                $('#gw_version').combobox({ disabled: true });
                $('#gw_type').combobox({ disabled: true });
                $('#gw_type').combobox('setValues', node.gw_type);
                $('#gw_version').combobox('setValues', node.version);
                $('#gw_new').textbox({ disabled: true });
                $('#gw_new').textbox('setText', node.text);
                $('#gw_remark').textbox({ disabled: true });
                $('#gw_remark').textbox('setText', node.remark);
                display_dialog('gw_add', messages[initial]['index_tree']['newdevice_modify']);
            } else if (level == 5) { // 显示通道配置窗口
                if (node['type'] == 'serialport') {
                    aisle('serial', node.text);
                    $('#channelName').textbox('setText', node.text);
                    $('#channel').combobox('setValues', node['type']);
                    $('#protocol_name').combobox('setValues', node['protocol']);
                    $('#channel').combobox('setValues', node['type']);
                    $('#serialport').combobox('setValues', node['com']);
                    $('#serial_baud').combobox('setValues', node['baudRate'].toString());
                    $('#serial_data').combobox('setValues', node['dataBit'].toString());
                    $('#serial_stop').combobox('setValues', node['stopBit'].toString());
                    $('#serial_parity').combobox('setValue', node['parity']);
                    $('#timeout').numberbox('setText', node['timeout']);
                    $('#between').numberbox('setText', node['comInterval']);
                    $('#serial_time').numberbox('setText', node['pollInterval']);
                    advance_object = JSON.parse(node['advance']);
                    var addressdiv = document.getElementById("continuousAddress_div");
                    if (node['category'] == 'Modbus') {
                        addressdiv.style.display = '';
                        $("#continuousAddress").prop("checked", advance_object['continuousAddress']);
                        if (advance_object['watchTime'] == 'null') {
                            node['watchTime'] = null
                        }
                        $('#watchTime').numberbox('setText', advance_object['watchTime']);
                        $('#readCount').numberbox('setText', advance_object['readCount']);
                        $('#writeCount').numberbox('setText', advance_object['writeCount']);
                    } else if (node['protocol'] == 'BACnetMSTP') {
                        $('#mac').numberbox('setText', advance_object['mac']);
                    }
                    $('#channel_dialog').dialog({ title: messages[initial]['index_tree']['channel_config_modify'] });
                } else if (node['type'] == 'network') {
                    aisle('tcp', node.text);
                    $('#channelName').textbox('setText', node.text);
                    $('#channel').combobox('setValues', node['type']);
                    $('#protocol_name').combobox('setValues', node['protocol']);
                    $('#net_port').numberbox('setText', node['port']);
                    $('#serial_time').numberbox('setText', node['pollInterval']);
                    $('#retryCount').numberbox('setText', node['retryCount']);
                    $('#between').numberbox('setText', node['comInterval']);
                    if (node['protocol'] != 'BACnetIP') {
                        $('#net_ip').textbox('setText', node['ip']);
                    } else {
                        $('#bacnet_tcp').combobox('setValues', node['ip']);
                    }
                    advance_object = JSON.parse(node['advance']);
                    var addressdiv = document.getElementById("continuousAddress_div");
                    if (node['category'] == 'Modbus') {
                        addressdiv.style.display = '';
                        $("#continuousAddress").prop("checked", advance_object['continuousAddress']);
                        if (advance_object['watchTime'] == 'null') {
                            node['watchTime'] = null
                        }
                        $('#watchTime').numberbox('setText', advance_object['watchTime']);
                        $('#readCount').numberbox('setText', advance_object['readCount']);
                        $('#writeCount').numberbox('setText', advance_object['writeCount']);
                    }
                    $('#channel_dialog').dialog({ title: messages[initial]['index_tree']['channel_config_modify'] });
                }
            } else if (level == 6) { // 显示设备属性窗口
                equip(node.text);
                if (node['protocol'] == 'BACnetMSTP') {
                    if (node.advance != null) { // 如果protocolConf不为空，默认选中slave
                        $("#mstp_type").prop("checked", true);
                        advance_object = JSON.parse(node.advance);
                        $('#mstp_mac').textbox('setText', advance_object['mac']);
                        $('#mstp_mac').textbox({
                            disabled: false
                        });
                    }
                }
                $('#equipment_name').textbox('setText', node.text);
                $('#equipment_addr').numberbox('setText', node.slaveID);
                $('#equipment_add').dialog({ title: messages[initial]['index_tree']['device_config_modify'] });
            }
        },
        onContextMenu: function(e, row) {
            var node = $('#tt').tree('getSelected');
            var level = easyui_tree_options.getLevel(this, node);
            var parent = $('#tt').tree('getParent', node.target);
            if (level == 1) {
                $('#root_row').menu('show', {
                    left: e.pageX,
                    top: e.pageY
                });
            } else if (level == 2) {
                $('#gw_delete').menu('show', {
                    left: e.pageX,
                    top: e.pageY
                });
            } else if (level == 4 && row.iconCls == 'icon-io-point') {
                $('#data_row').menu('show', {
                    left: e.pageX,
                    top: e.pageY
                });
            } else if (level == 5 && parent.text == messages[initial]['index']['io']) {
                $('#aisle_row').menu('show', {
                    left: e.pageX,
                    top: e.pageY
                });
            } else if (level == 6) {
                $('#device_row').menu('show', {
                    left: e.pageX,
                    top: e.pageY
                });
            }
        }
    });

    treeConfigMode();

    // a_list = document.getElementsByTagName('a');
    // for (i = 0; i < a_list.length; i++) {
    //     a_list[i].addEventListener('onclick', function(event) {
    //         console.log("aaaa")
    //         event.stopPropagation();
    //     })
    // }

    // for (i = 0; i < a_list.length; i++) {
    //     a_list[i].click(function(e) {
    //         e.stopPropatation = true
    //     });
    // }

});

// 删除tree节点
function remove() {
    $.messager.confirm(messages[initial]['common']['system_hint'], messages[initial]['index_tree']['if_delete_node'], function(r) {
        if (r) {
            var select = $('#tt').tree('getSelected');
            var dir = $('#text').textbox('getText'); // 选中的文件夹名称
            var level = easyui_tree_options.getLevel('#tt', select);
            if (level == 2) {
                status = deletefile('Project/' + dir + '/Gateway.db')
                console.log(status)
            } else if (level == 5) {
                sql = "delete from channel where text='{0}'".format(select.text);
                status = deletesql('Project/' + dir + '/Gateway', sql)
                console.log(status)
            } else if (level == 6) {
                sql = "delete from device where text='{0}'".format(select.text);
                status = deletesql('Project/' + dir + '/Gateway', sql)
                console.log(status)
            }
            $('#tt').tree('remove', select.target);
            document.getElementById('mainPanle').innerHTML = '';

            insert_info(select.text + messages[initial]['index_tree']['delete_node_success']);
        }
    });
}

function gw() {
    var select = $('#tt').tree('getSelected');
    var status = true;
    if (select['children']) {
        if (select['children'].length == 1) {
            status = false;
        }
    }
    if (status) {
        display_dialog('gw_add', messages[initial]['index_tree']['newgw']);
        $('#gw_type').combobox({ disabled: false });
        $('#gw_version').combobox({ disabled: false });
        $('#gw_new').textbox({ disabled: false });
        $('#gw_remark').textbox({ disabled: false });
        $("#gw_version").combobox({
            valueField: 'text',
            textField: 'text',
            data: oemData[initial]["gw_version"][messages[initial]['index']['MODBUS']],
            panelHeight: 'auto'
        });
    } else {
        $.messager.alert(messages[initial]['common']['system_hint'], messages[initial]['index_tree']['one_gwdevice'], "info")
    }
}

// 添加网关设备到tree中
function gw_add_tree(node, name, new_data) {
    var root = $('#tt').tree('getRoot');
    server_array = server_display(new_data); // 根据选择的网关型号显示服务类型
    child1 = [{
            'text': messages[initial]['index']['collect_server'],
            iconCls: 'icon-data-center',
            children: [
                { 'text': messages[initial]['index']['io'], iconCls: 'icon-io-point' },
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
            text: name,
            iconCls: 'icon-new-device',
            children: child1,
            feature: new_data['feature'],
            version: new_data['version'],
            remark: new_data['remark'],
            RTUmainsite: new_data['RTUmainsite'],
            TCPmainsite: new_data['TCPmainsite'],
            slave: new_data['slave'],
            gw_type: new_data['gw_type']
        }]
    });
}

function add_init_file(name, dir, new_data, gw_type, gw_version, gw_remark) {
    tool_version = document.getElementById("version").innerHTML;
    sql = "update gw set gwName='{0}',gwType='{1}',version='{2}',remark='{3}',databaseVersion='{4}' where gwName='Gateway_1'".format(name, gw_type, gw_version, gw_remark, tool_version);
    writeresult = updatesql('Project/' + dir + '/Gateway', sql);
}

// 添加网关设备
function gw_add() {
    if ($('#gw_add_form').form('validate')) {
        var node = $('#tt').tree('getSelected');
        var dialog_title = $('#gw_add').dialog('options').title;
        var name = $('#gw_new').textbox('getText'); // 新建的网关的名称
        if (dialog_title == messages[initial]['index_tree']['newdevice_modify']) {
            $("#gw_add").dialog('close');
        } else {
            var dir = $('#text').textbox('getText'); // 选中的文件夹名称
            var gw_type = $('#gw_type').combobox('getValue');
            var gw_version = $('#gw_version').combobox('getValue');
            var gw_remark = $('#gw_remark').textbox('getText');

            var new_data = new_treejson(gw_type, gw_version, gw_remark);
            result = copyfile('Template/initial.db', 'Project/' + dir + '/Gateway.db');
            if (result) {
                add_init_file(name, dir, new_data, gw_type, gw_version, gw_remark); // 在数据库的feature表中添加初始配置
                insert_info(name + messages[initial]['index_tree']['add_node_success']);
                $('#gw_add').dialog('close');

                gw_add_tree(node, name, new_data); // 添加新建的网关到tree中显示
            }
        }
    }
}

function parameters_dialog() {
    mstp_button_text = document.getElementById('modbus_button').innerText;
    if (mstp_button_text == '+') {
        $('#modbus_button').linkbutton({ text: '-' });
        document.getElementById('modbus_parameters').style.display = '';
        $('#channel_dialog').dialog({
            width: '530px',
            height: '450px'
        });
    } else {
        $('#modbus_button').linkbutton({ text: '+' });
        document.getElementById('modbus_parameters').style.display = 'none';
        $('#channel_dialog').dialog({
            width: '530px',
            height: '360px'
        });
    }
}

function device_parameters_dialog() {
    mstp_button_text = document.getElementById('mstp_button').innerText;
    if (mstp_button_text == '+') {
        $('#mstp_button').linkbutton({ text: '-' });
        document.getElementById('device_parameters').style.display = '';
        $('#equipment_add').dialog({
            width: '350px',
            height: '280px'
        });
    } else {
        $('#mstp_button').linkbutton({ text: '+' });
        document.getElementById('device_parameters').style.display = 'none';
        $('#equipment_add').dialog({
            width: '350px',
            height: '210px'
        });
    }
}

// 新建节点成功时在页面中显示新建的节点和在数据库中添加相应的点
function node_new(type, select, path, sql, add_name, feature, continuousAddress, watchTime, retryCount, readCount, writeCount) { // 新建节点
    result = insertsql(path, sql);
    if (result == 'true') {
        if (type == 'equipment') {
            $('#tt').tree('append', {
                parent: select.target,
                data: [{
                    text: add_name,
                    slaveID: feature[0],
                    protocolConf: feature[1],
                    iconCls: 'icon-meter'
                }]
            });
        } else {
            $('#tt').tree('append', {
                parent: select.target,
                data: [{
                    text: add_name,
                    feature: feature,
                    continuousAddress: continuousAddress,
                    watchTime: watchTime,
                    retryCount: retryCount,
                    readCount: readCount,
                    writeCount: writeCount,
                    iconCls: 'icon-channel'
                }]
            });
        }
        insert_info(add_name + messages[initial]['index_tree']['add_node_success']);
        return true;
    } else {
        sqlite_message(result, messages[initial]['common']['system_hint']);
        insert_info(add_name + messages[initial]['index_tree']['add_node_fail']);
        return false;
    }
}