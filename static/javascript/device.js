// // 显示设备窗口
function equip(old_text) {
    display_dialog('equipment_add', messages[initial]['index_tree']['device_config']);

    var dir = $('#text').textbox('getText'); // 选中的文件夹名称
    var select = $('#tt').tree('getSelected');
    var select_channel = $('#tt').tree('getParent', select.target);
    var level = easyui_tree_options.getLevel('#tt', select);
    parent = get_tt_parents(level - 2);
    var select = $('#tt').tree('getSelected');
    var sql = "select text from device where text LIKE'Device_%'";
    value = selectsql('Project/' + dir + '/Gateway', sql);
    device_newname = add_device_name(value);
    $("#equipment_name").textbox({ value: device_newname }); // 新建设备时新增不重复的device名称
    if (old_text == 'null') { // 新建设备
        if (select['protocol'] == 'BACnetMSTP') {
            document.getElementById('device_addr_div').style.display = '';
            $("#mstp_type").prop("checked", false);
            $('#mstp_mac').textbox({
                disabled: true
            });
            document.getElementById('mstp_parameters').style.display = '';
            $('#mstp_button').linkbutton({ text: '+' });
            document.getElementById('device_parameters').style.display = 'none';
            $('#equipment_add').dialog({
                width: '350px',
                height: '210px'
            });

        } else {
            if (select['protocol'] == 'S7_200_Network' || select['protocol'] == 'S7_1200_Network') {
                document.getElementById('device_addr_div').style.display = 'none';
            } else {
                document.getElementById('device_addr_div').style.display = '';
            }
            document.getElementById('mstp_parameters').style.display = 'none';
            document.getElementById('device_parameters').style.display = 'none';
            $('#equipment_add').dialog({
                width: '350px',
                height: '210px'
            });
        }
    } else {
        if (select_channel['protocol'] == 'BACnetMSTP') {
            document.getElementById('device_addr_div').style.display = '';
            document.getElementById('mstp_parameters').style.display = '';
            $('#mstp_button').linkbutton({ text: '+' });
            $('#mstp_mac').textbox({
                disabled: true
            });
            document.getElementById('device_parameters').style.display = 'none';
            $('#equipment_add').dialog({
                width: '350px',
                height: '210px'
            });
        } else {
            if (select['protocol'] == 'S7_200_Network' || select['protocol'] == 'S7_1200_Network') {
                document.getElementById('device_addr_div').style.display = 'none';
            } else {
                document.getElementById('device_addr_div').style.display = '';
            }
            document.getElementById('mstp_parameters').style.display = 'none';
            document.getElementById('device_parameters').style.display = 'none';
            $('#equipment_add').dialog({
                width: '350px',
                height: '210px'
            });
        }
    }
    $('#equipment_add').dialog({
        buttons: [{
                text: messages[initial]['common']['ok'],
                iconCls: 'icon-ok',
                handler: function() {
                    if ($('#equipment_add_form').form('validate')) {
                        device_add(old_text)
                    }
                }
            },
            {
                text: messages[initial]['common']['cancel'],
                iconCls: 'icon-cancel',
                handler: function() {
                    $('#equipment_add').dialog('close')
                }
            }
        ]
    });
}


function device_add(old_text) {
    var add_name = $('#equipment_name').textbox('getText');
    var selected = $('#tt').tree('getSelected');
    channelName = selected.text;
    slaveId = $('#equipment_addr').numberbox('getText');
    advance = {};
    if (old_text == 'null') { // 新建设备
        if (selected['protocol'] == 'BACnetMSTP') {
            var status = $("#mstp_type").is(":checked");
            if (status) {
                mstp_mac = $('#mstp_mac').textbox('getText');
                advance['mac'] = parseInt(mstp_mac);
            }
        } else if (selected['category'] == 'Modbus') {
            advance['baseAddr'] = 1 // 通讯地址，选择的模板名称，基地址
        }
    } else {
        var select_channel = $('#tt').tree('getParent', selected.target);
        channelName = select_channel.text;
        if (select_channel['protocol'] == 'BACnetMSTP') {
            var status = $("#mstp_type").is(":checked");
            if (status) {
                mstp_mac = $('#mstp_mac').textbox('getText');
                advance['mac'] = parseInt(mstp_mac);
            }
        } else if (selected['category'] == 'Modbus') {
            advance['baseAddr'] = 1 // 通讯地址，选择的模板名称，基地址
        }
    }
    var status = equipment_modify(add_name, channelName, slaveId, advance, old_text);
}

// 复制设备
function copy_device(type) {
    display_dialog('equipment_add', messages[initial]['index']['Copy_device']);

    var dir = $('#text').textbox('getText'); // 选中的文件夹名称
    var select = $('#tt').tree('getSelected');
    var level = easyui_tree_options.getLevel('#tt', select);
    parent = get_tt_parents(level - 2);
    var select = $('#tt').tree('getSelected');
    var sql = "select text from Device where text LIKE'Device_%'";
    value = selectsql('Project/' + dir + '/Gateway', sql);
    device_newname = add_device_name(value); // 生成不重复的device名称
    $("#equipment_name").textbox({ value: device_newname }); // 复制设备时新增不重复的device名称
    $('#equipment_add').dialog({
        buttons: [{
                text: messages[initial]['common']['ok'],
                iconCls: 'icon-ok',
                handler: function() {
                    device_add(type)
                }
            },
            {
                text: messages[initial]['common']['cancel'],
                iconCls: 'icon-cancel',
                handler: function() {
                    $('#equipment_add').dialog('close')
                }
            }
        ]
    });
}

// 设备属性修改
function equipment_modify(add_name, channelName, slaveId, advance, old_text) {
    var dir = $('#text').textbox('getText'); // 选中的文件夹名称
    var dialog_title = $('#equipment_add').dialog('options').title;
    if (add_name.indexOf('.') != -1) {
        $.messager.alert(messages[initial]['common']['system_hint'], messages[initial]['index_tree']['catnot_has'], "info")
        $("#equipment_add").dialog('close');
        return true;
    } else if (['clientid', 'time'].indexOf(add_name) != -1) {
        $.messager.alert(messages[initial]['common']['system_hint'], messages[initial]['index_tree']['catnot_is'] + add_name, "info")
        $("#equipment_add").dialog('close');
        return true;
    }
    // else if (feature[0] > 247) {
    //     $.messager.alert(messages[initial]['common']['system_hint'], "Modbus的通讯地址不能大于247！", "info")
    //     return true;
    // }
    var select = $('#tt').tree('getSelected');
    if (dialog_title == messages[initial]['index_tree']['device_config_modify']) {
        var select_channel = $('#tt').tree('getParent', select.target);
        var level = easyui_tree_options.getLevel('#tt', select);
        parent = get_tt_parents(level - 2);
        sql = "update device set text='{0}', slaveID=nullif('{1}',''),advance=nullif('{2}','{}') where text='{3}'".format(add_name, slaveId, JSON.stringify(advance), old_text);
        result = updatesql('Project/' + dir + '/Gateway', sql);
        if (result == 'true') {
            insert_info(add_name + messages[initial]['index_tree']['node_modify_success'])
            $("#equipment_add").dialog('close');
            $('#tt').tree('update', {
                target: select.target,
                text: add_name,
                slaveID: slaveId,
                advance: JSON.stringify(advance)
            });
        } else {
            sqlite_message(result, messages[initial]['common']['system_hint']);
        }
    } else if (dialog_title == messages[initial]['index']['Copy_device']) {
        var select_channel = $('#tt').tree('getParent', select.target);
        var level = easyui_tree_options.getLevel('#tt', select);
        parent = get_tt_parents(level - 2);
        category = select_channel['category'];
        sql = "insert into device values ('{0}','{1}',nullif('{2}',''),nullif('{3}','{}'))".format(add_name, select_channel.text, slaveId, JSON.stringify(advance));
        result = insertsql('Project/' + dir + '/Gateway', sql);
        if (result == 'true') {
            sql = "select * from {0} where deviceCode='{1}'".format(category, select.text)
            content = selectsql('Project/' + dir + '/Gateway', sql);
            value = JSON.parse(content);
            value.forEach(function(tag) {
                tag['deviceCode'] = add_name
            })
            bulk_value = {}
            bulk_value[category] = value;
            result = bulk_insert('Project/' + dir + '/Gateway', JSON.stringify(bulk_value));
            if (result == 'true') {
                insert_info(add_name + messages[initial]['index_tree']['add_copy_success'])
                $("#equipment_add").dialog('close');
                $('#tt').tree('append', {
                    parent: select_channel.target,
                    data: [{
                        text: add_name,
                        category: category,
                        channelName: select_channel.text,
                        protocol: select_channel['protocol'],
                        slaveID: slaveId,
                        advance: JSON.stringify(advance),
                        iconCls: 'icon-meter'
                    }]
                });
            } else {
                sqlite_message(result, messages[initial]['common']['system_hint']);
            }
        } else {
            sqlite_message(result, messages[initial]['common']['system_hint']);
        }
    } else {
        var level = easyui_tree_options.getLevel('#tt', select);
        parent = get_tt_parents(level - 2);
        category = select['category'];
        sql = "insert into device values ('{0}','{1}',nullif('{2}',''),nullif('{3}','{}'))".format(add_name, select.text, slaveId, JSON.stringify(advance));
        result = insertsql('Project/' + dir + '/Gateway', sql);
        if (result == 'true') {
            insert_info(add_name + messages[initial]['index_tree']['add_node_success'])
            $("#equipment_add").dialog('close');
            $('#tt').tree('append', {
                parent: select.target,
                data: [{
                    text: add_name,
                    category: category,
                    channelName: select.text,
                    protocol: select['protocol'],
                    slaveID: slaveId,
                    advance: JSON.stringify(advance),
                    iconCls: 'icon-meter'
                }]
            });
        } else {
            sqlite_message(result, messages[initial]['common']['system_hint']);
        }
    }
}

$(function() {
    $("#mstp_type").change(function() {
        var status = $("#mstp_type").is(":checked");
        if (!status) {
            $('#mstp_mac').textbox({
                disabled: true
            });
        } else {
            $('#mstp_mac').textbox({
                disabled: false
            });
        }
    });
})