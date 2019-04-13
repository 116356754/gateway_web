$(function() {
    $("#watchTime_check").change(function() {
        if ($("#watchTime_check").is(":checked")) {
            $("#watchTime").numberbox('setText', '10');
            $("#watchTime").numberbox('enable');
        } else {
            $("#watchTime").numberbox('setText', '');
            $("#watchTime").numberbox('disable');
        }
    });


    var channel_data = [{ "text": messages[initial]['index_tree']['serialport'], "id": "serialport" }, { "text": messages[initial]['index_tree']['Network_port'], "id": "network" }];
    $("#channel").combobox({
        valueField: 'id',
        textField: 'text',
        data: channel_data,
        panelHeight: 'auto',
        onChange: function(newValue, oldValue) {
            channel_onchange(newValue);
        }
    });

    $("#protocol_name").combobox({
        onChange: function(newValue, oldValue) {
            $('#modbus_button').linkbutton({ text: '+' });
            document.getElementById('modbus_parameters').style.display = 'none';
            $('#channel_dialog').dialog({
                width: '530px',
                height: '360px'
            });
            protocol_name_onchange(newValue);
        }
    });
});

function channel_onchange(newValue) {
    var select = $('#tt').tree('getSelected');
    var level = easyui_tree_options.getLevel('#tt', select);
    parent = get_tt_parents(level - 2);
    if (newValue == 'serialport') {
        $("#protocol_name").combobox({
            valueField: 'id',
            textField: 'text',
            data: parent.RTUmainsite
        });
        $('#protocol_name').combobox('setValues', parent.RTUmainsite[0]['text']);
        document.getElementById("serial").style['display'] = '';
        document.getElementById("tcp").style['display'] = 'none';
        document.getElementById("bacnetipdiv").style['display'] = 'none';
        document.getElementById("port").style['display'] = 'none';
    } else if (newValue == 'network') {
        $("#protocol_name").combobox({
            valueField: 'id',
            textField: 'text',
            data: parent.TCPmainsite,
            panelHeight: 'auto'
        });
        $('#protocol_name').combobox('setValues', parent.TCPmainsite[0]['text']);
        document.getElementById("serial").style['display'] = 'none';
        protocol = $("#protocol_name").combobox('getValue');
        if (protocol != 'BACnetIP') {
            document.getElementById("tcp").style['display'] = '';
            document.getElementById("bacnetipdiv").style['display'] = 'none';
        } else {
            document.getElementById("bacnetipdiv").style['display'] = '';
            document.getElementById("tcp").style['display'] = 'none';
        }
        document.getElementById("port").style['display'] = '';
    }
}

function protocol_name_onchange(newValue) {
    var channel_type = $('#channel').combobox('getValue');
    if (newValue == 'BACnetMSTP') {
        $("#timeout").numberbox({
            value: '60000'
        })
        document.getElementById("mstpmac_parameters").style['display'] = '';
    } else if (newValue == 'DLT645') {
        $("#timeout").numberbox({
            value: '1000'
        })
        $("#serial_baud").combobox({
            value: '2400'
        })
        document.getElementById("mstpmac_parameters").style['display'] = 'none';
    } else {
        $("#timeout").numberbox({
            value: '1000'
        });
        $("#serial_baud").combobox({
            value: '9600'
        })
        document.getElementById("mstpmac_parameters").style['display'] = 'none';
    };
    if (['ModbusTCPClient', 'ModbusRTUClient', 'ModbusRTU_over_TCP'].indexOf(newValue) != -1) {
        document.getElementById("continuousAddress_div").style.display = '';
    } else if (newValue == 'BACnetMSTP') {
        document.getElementById("continuousAddress_div").style.display = 'none';
    } else {
        document.getElementById("continuousAddress_div").style.display = 'none';
    };
    if (newValue == 'BACnetIP') {
        var select = $('#tt').tree('getSelected');
        var level = easyui_tree_options.getLevel('#tt', select);
        parent = get_tt_parents(level - 2);
        if (parent['feature'][0].length == 1) {
            net_data = [{ "text": "eth0" }]
        } else {
            net_data = [{ "text": "eth0" }, { "text": "eth1" }]
        }
        document.getElementById("bacnetipdiv").style['display'] = '';
        document.getElementById("tcp").style['display'] = 'none';
        $("#bacnet_tcp").combobox({
            valueField: 'text',
            textField: 'text',
            data: net_data,
            panelHeight: 'auto',
            value: 'eth0',
            editable: false
        });
        $("#net_port").numberbox({
            value: '47808'
        })
    } else if (channel_type == 'network') {
        document.getElementById("bacnetipdiv").style['display'] = 'none';
        document.getElementById("tcp").style['display'] = '';
        $("#net_ip").textbox({
            value: '192.168.1.101'
        });
        $("#net_port").numberbox({
            value: '502'
        })
    }
}

// 显示通道窗口
function channel_content(parent, type, old_text) {
    document.getElementById("serial").style['display'] = '';
    document.getElementById("tcp").style['display'] = 'none';
    document.getElementById("bacnetipdiv").style['display'] = 'none';
    document.getElementById("port").style['display'] = 'none';

    $('#modbus_button').linkbutton({ text: '+' });
    document.getElementById('modbus_parameters').style.display = 'none';
    $('#channel_dialog').dialog({
        width: '530px',
        height: '360px'
    });
    $('#channel').combobox('setValues', 'serialport');

    com_data = parent.feature[1];
    $("#serialport").combobox({
        valueField: 'text',
        textField: 'text',
        data: com_data
    });
    $("#serial_baud").combobox({
        url: "../static/json/baudrate.json",
        valueField: 'text',
        textField: 'text',
        method: "GET",
        panelHeight: 'auto'
    });
    $("#serial_data").combobox({
        url: "../static/json/databit.json",
        valueField: 'text',
        textField: 'text',
        method: "GET",
        panelHeight: 'auto'
    });
    $("#serial_stop").combobox({
        url: "../static/json/stopbit.json",
        valueField: 'text',
        textField: 'text',
        method: "GET",
        panelHeight: 'auto'
    });
    $("#serial_parity").combobox({
        url: "../static/json/parity.json",
        valueField: 'id',
        textField: 'text',
        method: "GET",
        panelHeight: 'auto'
    });
    $("#serial_flow").combobox({
        url: "../static/json/flow.json",
        valueField: 'text',
        textField: 'text',
        method: "GET",
        panelHeight: 'auto'
    });

    display_dialog('channel_dialog', messages[initial]['index_tree']['channel_config']);
    $('#channel_dialog').dialog({
        buttons: [{
                text: messages[initial]['common']['ok'],
                iconCls: 'icon-ok',
                handler: function() {
                    if ($('#channel_dialog_form').form('validate')) {
                        channel_add(old_text);
                    }
                }
            },
            {
                text: messages[initial]['common']['cancel'],
                iconCls: 'icon-cancel',
                handler: function() {
                    // document.getElementById("serial").style['display'] = ''; // 防止双击网口的窗口之后双击串口的窗口显示网口的配置
                    // document.getElementById("continuousAddress_div").style['display'] = '';
                    // document.getElementById("tcp").style['display'] = 'none';
                    // document.getElementById("bacnetipdiv").style['display'] = 'none';
                    // document.getElementById("port").style['display'] = 'none';
                    $('#channel_dialog').dialog('close')
                }
            }
        ]
    });
    $("#channel_dialog").dialog('open'); //必须先显示，再弹出
}

// 通道的默认属性
function channel_default() {
    channel_onchange("serialport");
    protocol_name_onchange('ModbusRTUClient');

    var dir = $('#text').textbox('getText'); // 选中的文件夹名称
    var select = $('#tt').tree('getSelected');
    var level = easyui_tree_options.getLevel('#tt', select);
    parent = get_tt_parents(level - 2);
    var select = $('#tt').tree('getSelected');
    var sql = "select text from channel where text LIKE'Channel_%'";
    value = selectsql('Project/' + dir + '/Gateway', sql);
    channel_newname = add_channel_name(value);
    $("#channelName").textbox({ value: channel_newname }); // 新建通道时新增不重复的channel名称
    $("#continuousAddress").prop("checked", true);
    $("#timeout").numberbox({ value: '500' });
    $("#between").numberbox({ value: '500' });
    $("#serial_time").numberbox({ value: '100' });
    $("#watchTime_check").prop("checked", false); // 默认不选中watchTime
    $('#watchTime').numberbox({ disabled: true });
    $('#watchTime').numberbox({ value: '' });
    $('#retryCount').numberbox({ value: '3' });
    $('#readCount').numberbox({ value: '1' });
    $('#writeCount').numberbox({ value: '1' });

    $('#channel').combobox({ disabled: false });
    $('#protocol_name').combobox({ disabled: false });
}

// 新建通道或通道修改
function aisle(type, old_text) {
    var select = $('#tt').tree('getSelected');
    var level = easyui_tree_options.getLevel('#tt', select);
    parent = get_tt_parents(level - 2);

    if (type == 'new') {
        channel_default();
        channel_content(parent, type, old_text);
    } else if (type == 'serial') {
        $('#channel').combobox({ disabled: true });
        $('#protocol_name').combobox({ disabled: true });
        channel_content(parent, type, old_text);
    } else if (type == 'tcp') {
        $('#channel').combobox({ disabled: true });
        $('#protocol_name').combobox({ disabled: true });
        if (select['protocol'] == 'BacnetIP') {
            if (parent['feature'][0].length == 1) {
                net_data = [{ "text": "eth0" }]
            } else {
                net_data = [{ "text": "eth0" }, { "text": "eth1" }]
            }
            $("#bacnet_tcp").combobox({
                valueField: 'text',
                textField: 'text',
                data: net_data,
                panelHeight: 'auto',
                editable: false
            });
        }
        channel_content(parent, type, old_text);
    }
}

function channel_add(old_text) {
    usual_object = {};
    usual_object['add_name'] = $('#channelName').textbox('getText');
    usual_object['protocol_name'] = $('#protocol_name').combobox('getValue');
    usual_object['channel'] = $('#channel').textbox('getValue');
    usual_object['timeout'] = $('#timeout').numberbox('getText');
    usual_object['comInterval'] = $('#between').numberbox('getText');
    usual_object['pollInterval'] = $('#serial_time').numberbox('getText');
    usual_object['retryCount'] = $('#retryCount').numberbox('getText');
    advance = {};
    if (usual_object['channel'] == 'serialport') {
        serial_object = {};
        serial_object['serialport'] = $('#serialport').combobox('getValue');
        serial_object['baudRate'] = $('#serial_baud').combobox('getValue');
        serial_object['dataBit'] = $('#serial_data').combobox('getValue');
        serial_object['parity'] = $('#serial_parity').combobox('getValue');
        serial_object['stopBit'] = $('#serial_stop').combobox('getValue');
        if (['ModbusTCPClient', 'ModbusRTUClient', 'ModbusRTU_over_TCP'].indexOf(usual_object['protocol_name']) != -1) {
            advance['continuousAddress'] = $("#continuousAddress").is(":checked");
            if ($("#watchTime_check").is(":checked")) {
                advance['watchTime'] = $('#watchTime').numberbox('getText');
            }
            advance['readCount'] = $('#readCount').numberbox('getText');
            advance['writeCount'] = $('#writeCount').numberbox('getText');
        } else if (usual_object['protocol_name'] == 'BACnetMSTP') {
            advance['mac'] = $('#mac').numberbox('getText');
        }
        serial_modify(old_text, usual_object, advance, serial_object);
    } else if (usual_object['channel'] == 'network') {
        network_object = {};
        if (usual_object['protocol_name'] != 'BACnetIP') {
            network_object['ip'] = $('#net_ip').textbox('getText');
        } else {
            network_object['ip'] = $('#bacnet_tcp').combobox('getValue');
        }
        network_object['port'] = $('#net_port').numberbox('getText');
        if (['ModbusTCPClient', 'ModbusRTUClient', 'ModbusRTU_over_TCP'].indexOf(usual_object['protocol_name']) != -1) {
            advance['continuousAddress'] = $("#continuousAddress").is(":checked");
            if ($("#watchTime_check").is(":checked")) {
                advance['watchTime'] = $('#watchTime').numberbox('getText');
            }
            advance['readCount'] = $('#readCount').numberbox('getText');
            advance['writeCount'] = $('#writeCount').numberbox('getText');
        }
        net_modify(old_text, usual_object, advance, network_object);
    }
}

// 新建节点成功时在页面中显示新建的节点和在数据库中添加相应的点
function channel_new(channel_type, select, usual_object, advance, old_text, channel_object, category) { // 新建节点
    if (channel_type == 'network') {
        $('#tt').tree('append', {
            parent: select.target,
            data: [{
                advance: JSON.stringify(advance),
                text: usual_object['add_name'],
                channelName: usual_object['add_name'],
                category: category,
                name: usual_object['protocol_name'],
                protocol: usual_object['protocol_name'],
                comInterval: usual_object['comInterval'],
                ip: channel_object['ip'],
                port: channel_object['port'],
                pollInterval: usual_object['pollInterval'],
                retryCount: usual_object['retryCount'],
                timeout: usual_object['timeout'],
                iconCls: 'icon-channel',
                type: 'network'
            }]
        });
    } else {
        $('#tt').tree('append', {
            parent: select.target,
            data: [{
                advance: JSON.stringify(advance),
                text: usual_object['add_name'],
                channelName: usual_object['add_name'],
                category: category,
                name: usual_object['protocol_name'],
                protocol: usual_object['protocol_name'],
                comInterval: usual_object['comInterval'],
                baudRate: channel_object['baudRate'],
                dataBit: channel_object['dataBit'],
                parity: channel_object['parity'],
                stopBit: channel_object['stopBit'],
                com: channel_object['serialport'],
                pollInterval: usual_object['pollInterval'],
                retryCount: usual_object['retryCount'],
                timeout: usual_object['timeout'],
                iconCls: 'icon-channel',
                type: 'serialport'
            }]
        });
    }
    insert_info(usual_object['add_name'] + messages[initial]['index_tree']['add_node_success']);
    $("#channel_dialog").dialog('close');
}


// tree中update通道
function channeltree_update(channel_type, select, usual_object, advance, old_text, channel_object) {
    insert_info(usual_object['add_name'] + messages[initial]['index_tree']['node_modify_success'])
    $("#channel_dialog").dialog('close');
    if (channel_type == 'network') {
        $('#tt').tree('update', {
            target: select.target,
            advance: JSON.stringify(advance),
            text: usual_object['add_name'],
            channelName: usual_object['add_name'],
            comInterval: usual_object['comInterval'],
            ip: channel_object['ip'],
            port: channel_object['port'],
            pollInterval: usual_object['pollInterval'],
            retryCount: usual_object['retryCount'],
            timeout: usual_object['timeout']
        });
    } else if (channel_type == 'serialport') {
        $('#tt').tree('update', {
            target: select.target,
            advance: JSON.stringify(advance),
            text: usual_object['add_name'],
            channelName: usual_object['add_name'],
            comInterval: usual_object['comInterval'],
            baudRate: channel_object['baudRate'],
            dataBit: channel_object['dataBit'],
            parity: channel_object['parity'],
            stopBit: channel_object['stopBit'],
            com: channel_object['serialport'],
            pollInterval: usual_object['pollInterval'],
            retryCount: usual_object['retryCount'],
            timeout: usual_object['timeout']
        });
    }
}

// 网口通信参数设置修改
function net_modify(old_text, usual_object, advance, channel_object) {
    var dir = $('#text').textbox('getText'); // 选中的文件夹名称
    if (['calculate', 'system'].indexOf(usual_object['add_name']) != -1) {
        $.messager.alert(messages[initial]['common']['system_hint'], messages[initial]['index_tree']['catnot_is'] + usual_object['add_name'], "info")
        $("#channel_dialog").dialog('close');
        return true;
    }
    var dialog_title = $('#channel_dialog').dialog('options').title;
    var select = $('#tt').tree('getSelected');
    if (dialog_title == messages[initial]['index_tree']['channel_config_modify']) {
        var level = easyui_tree_options.getLevel('#tt', select);
        parent = get_tt_parents(level - 2);
        sql = "update channel set text='{0}', advance=nullif('{1}','{}'), retryCount='{2}',pollInterval='{3}',comInterval={4} where text='{5}'".format(usual_object['add_name'], JSON.stringify(advance), usual_object['retryCount'], usual_object['pollInterval'], usual_object['comInterval'], old_text);
        result = updatesql('Project/' + dir + '/Gateway', sql);
        if (result == 'true') {
            sql = "update network set ip='{0}', port='{1}', timeout={2} where channelName='{3}'".format(channel_object['ip'], channel_object['port'], usual_object['timeout'], usual_object['add_name']);
            result = updatesql('Project/' + dir + '/Gateway', sql);
            if (result == 'true') {
                channeltree_update('network', select, usual_object, advance, old_text, channel_object);
            } else {
                sqlite_message(result, messages[initial]['common']['system_hint']);
            }
        } else {
            sqlite_message(result, messages[initial]['common']['system_hint']);
        }
    } else {
        sql = "select category from protocol where name='{0}'".format(usual_object['protocol_name']);
        result_object = JSON.parse(selectsql('Project/' + dir + '/Gateway', sql));
        sql = "insert into channel values ('{0}','{1}',nullif('{2}','{}'),'{3}',{4},'{5}')".format(usual_object['add_name'], usual_object['protocol_name'], JSON.stringify(advance), usual_object['retryCount'], usual_object['pollInterval'], usual_object['comInterval']);
        result = insertsql('Project/' + dir + '/Gateway', sql);
        if (result == 'true') {
            sql = "insert into network values ('{0}','{1}','{2}','{3}')".format(usual_object['add_name'], channel_object['ip'], channel_object['port'], usual_object['timeout']);
            result = insertsql('Project/' + dir + '/Gateway', sql);
            if (result == 'true') {
                channel_new('network', select, usual_object, advance, old_text, channel_object, result_object[0]['category']);
            } else {
                sqlite_message(result, messages[initial]['common']['system_hint']);
            }
        } else {
            sqlite_message(result, messages[initial]['common']['system_hint']);
        }
    }
}

// 串口号重名校验
function com_check(path, com, type) { // 检测com口是否被占用
    if (type == 'add') {
        result = selectsql(path, "select * from serialport where com='{0}'".format(com));
    } else {
        result = selectsql(path, "select * from serialport where com='{0}' and channelName!='{1}'".format(com, type));
    }
    if (result != '[]') {
        return false;
    } else {
        server_com = selectsql(path, "select * from feature where com='{0}'".format(com));
        if (server_com != '[]') {
            return false;
        } else {
            modbus_slave_com = selectsql(path, "select com from feature where protocol='Modbus_RTU'");
            com_object = JSON.parse(modbus_slave_com);
            used_com = JSON.parse(com_object[0]['com']);
            if (used_com.indexOf(com) != -1) {
                return false;
            } else {
                return true;
            }
        }
    }
}

// 串口通信参数设置新增或修改
function serial_modify(old_text, usual_object, advance, channel_object) {
    var dir = $('#text').textbox('getText'); // 选中的文件夹名称
    if (['calculate', 'system'].indexOf(usual_object['add_name']) != -1) {
        $.messager.alert(messages[initial]['common']['system_hint'], messages[initial]['index_tree']['catnot_is'] + usual_object['add_name'], "info")
        $("#channel_dialog").dialog('close');
        return true;
    }
    var dialog_title = $('#channel_dialog').dialog('options').title;
    var select = $('#tt').tree('getSelected');
    if (dialog_title == messages[initial]['index_tree']['channel_config_modify']) {
        var level = easyui_tree_options.getLevel('#tt', select);
        parent = get_tt_parents(level - 2);
        used = com_check('Project/' + dir + '/Gateway', channel_object['serialport'], old_text);
        if (used) { // 串口没有被占用
            sql = "update channel set text='{0}', advance=nullif('{1}','{}'), retryCount='{2}',pollInterval='{3}',comInterval={4} where text='{5}'".format(usual_object['add_name'], JSON.stringify(advance), usual_object['retryCount'], usual_object['pollInterval'], usual_object['comInterval'], old_text);
            result = updatesql('Project/' + dir + '/Gateway', sql);
            if (result == 'true') {
                sql = "update serialport set com='{0}', baudRate='{1}', dataBit='{2}',parity='{3}',stopBit={4},timeout={5} where channelName='{6}'".format(channel_object['serialport'], channel_object['baudRate'], channel_object['dataBit'], channel_object['parity'], channel_object['stopBit'], usual_object['timeout'], usual_object['add_name']);
                result = updatesql('Project/' + dir + '/Gateway', sql);
                if (result == 'true') {
                    channeltree_update('serialport', select, usual_object, advance, old_text, channel_object);
                } else {
                    sqlite_message(result, messages[initial]['common']['system_hint']);
                }
            } else {
                sqlite_message(result, messages[initial]['common']['system_hint']);
            }
        } else {
            $.messager.alert(messages[initial]['common']['system_hint'], messages[initial]['index_tree']['serialport_already'].format(channel_object['serialport']), "info")
        }
    } else {
        used = com_check('Project/' + dir + '/Gateway', channel_object['serialport'], old_text);
        if (used) { // 串口没有被占用
            sql = "select category from protocol where name='{0}'".format(usual_object['protocol_name']);
            result_object = JSON.parse(selectsql('Project/' + dir + '/Gateway', sql));
            sql = "insert into channel values ('{0}','{1}',nullif('{2}','{}'),'{3}',{4},'{5}')".format(usual_object['add_name'], usual_object['protocol_name'], JSON.stringify(advance), usual_object['retryCount'], usual_object['pollInterval'], usual_object['comInterval']);
            result = insertsql('Project/' + dir + '/Gateway', sql);
            if (result == 'true') {
                sql = "insert into serialport values ('{0}','{1}','{2}','{3}','{4}','{5}','{6}')".format(usual_object['add_name'], channel_object['serialport'], channel_object['baudRate'], channel_object['dataBit'], channel_object['parity'], channel_object['stopBit'], usual_object['timeout']);
                result = insertsql('Project/' + dir + '/Gateway', sql);
                if (result == 'true') {
                    channel_new('serialport', select, usual_object, advance, old_text, channel_object, result_object[0]['category']);
                } else {
                    sqlite_message(result, messages[initial]['common']['system_hint']);
                }
            } else {
                sqlite_message(result, messages[initial]['common']['system_hint']);
            }
        } else {
            $.messager.alert(messages[initial]['common']['system_hint'], messages[initial]['index_tree']['serialport_already'].format(channel_object['serialport']), "info")
        }
    }
}