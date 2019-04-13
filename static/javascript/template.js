$(function() {
    $('#template_protocol').combobox({
        url: "../static/json/drive.json",
        valueField: 'id',
        textField: 'text',
        method: "GET",
        panelHeight: 'auto',
        disabled: false
    });
})

function load_template() {
    // 打开软件时显示所有模板
    result = selectsql('Template/Template', "select * from Template");
    result_object = JSON.parse(result);
    var root = $('#template_tree').tree('getRoot');
    var child = new Array();
    result_object.forEach(function(tag) {
        tag['text'] = tag['deviceCode'];
        tag['iconCls'] = 'icon-report';
        child.push(tag)
    })
    $('#template_tree').tree({
        url: '../static/json/template_tree.json',
        onDblClick: function(node) {
            document.getElementById('mainPanle').innerHTML = '';
            // clearTimeout(TimeFn);
            $('#deviceCode').textbox('setText', node.text);
            $('#template_protocol').combobox({ disabled: true });
            $('#template_protocol').combobox('setValues', node.protocol);
            if (node.iconCls != 'icon-template') {
                display_dialog('template_dialog', messages[initial]['index']['Modify_template']);
                $('#template_dialog').dialog({
                    buttons: [{
                            text: messages[initial]['common']['ok'],
                            iconCls: 'icon-ok',
                            handler: function() {
                                addtemplate(node.text);
                                $('#template_dialog').dialog('close')
                            }
                        },
                        {
                            text: messages[initial]['common']['cancel'],
                            iconCls: 'icon-cancel',
                            handler: function() {
                                $('#template_dialog').dialog('close')
                            }
                        }
                    ]
                });
            }
        },
        onClick: function(node) {
            // clearTimeout(TimeFn);
            // //执行延时
            // TimeFn = setTimeout(function() {
            document.getElementById('mainPanle').innerHTML = '';
            if (node.iconCls != 'icon-template') {
                if (node.protocol == 'Modbus') {
                    document.getElementById('mainPanle').innerHTML = '<iframe src="../templates/ModbusTCPClient.html" style="width:99%;height:100%;background:#fafafa;"></iframe>';
                } else if (node.protocol == 'BACnet') {
                    document.getElementById('mainPanle').innerHTML = '<iframe src="../templates/BACnetIP.html" style="width:99%;height:100%;background:#fafafa;"></iframe>';
                } else if (node.protocol == 'PLC') {
                    document.getElementById('mainPanle').innerHTML = '<iframe src="../templates/S7_200_PPI.html" style="width:99%;height:100%;background:#fafafa;"></iframe>';
                } else {
                    src = "../templates/" + node.protocol + ".html";
                    document.getElementById('mainPanle').innerHTML = '<iframe src="' + src + '" style="width:99%;height:100%;background:#fafafa;"></iframe>';
                }
            }
            // }, 500);
        },
        onContextMenu: function(e, node) {
            if (node.iconCls == 'icon-template') {
                $('#template_add').menu('show', {
                    left: e.pageX,
                    top: e.pageY
                });
            } else {
                $('#template_remove').menu('show', {
                    left: e.pageX,
                    top: e.pageY
                });
            }
        },
        onLoadSuccess: function(node, data) {
            var root = $('#template_tree').tree('getRoot');
            $('#template_tree').tree('append', {
                parent: root.target,
                data: child
            });
        }
    });
}

// 添加模板到数据库
function addtemplate(old_text) {
    var select = $("#template_tree").tree('getSelected');
    var dialog_title = $('#template_dialog').dialog('options').title;
    var deviceCode = $('#deviceCode').textbox('getText');
    if (dialog_title == messages[initial]['index']['New_Template']) {
        var template_protocol = $('#template_protocol').combobox('getValue');
        result = insertsql('Template/Template', "insert into Template values ('{0}','{1}')".format(deviceCode, template_protocol));
        if (result == 'true') {
            var root = $('#template_tree').tree('getRoot');
            $('#template_tree').tree('append', {
                parent: root.target,
                data: [{
                    text: deviceCode,
                    protocol: template_protocol,
                    protocolConf: 1,
                    deviceCode: deviceCode,
                    iconCls: 'icon-report'
                }]
            });
            insert_info(messages[initial]['index_tree']['new_tem_success'].format(deviceCode));
            $('#template_dialog').dialog('close')
        } else {
            sqlite_message(result, messages[initial]['common']['system_hint']);
        }
    } else if (dialog_title == messages[initial]['index']['Modify_template']) {
        sql = "update Template set deviceCode='{0}' where deviceCode='{1}'".format(deviceCode, old_text);
        result = updatesql('Template/Template', sql);
        if (result == 'true') {
            var root = $('#template_tree').tree('getRoot');
            $('#template_tree').tree('update', {
                target: select.target,
                text: deviceCode
            });
            insert_info(messages[initial]['index_tree']['modify_tem_success'].format(deviceCode));
        } else {
            sqlite_message(result, messages[initial]['common']['system_hint']);
        }
    }
}

// 新建模板
function template_add() {
    $('#template_protocol').combobox({ disabled: false });
    display_dialog('template_dialog', messages[initial]['index']['New_Template']);
    $('#template_dialog').dialog({
        buttons: [{
                text: messages[initial]['common']['ok'],
                iconCls: 'icon-ok',
                handler: function() {
                    addtemplate('null');
                }
            },
            {
                text: messages[initial]['common']['cancel'],
                iconCls: 'icon-cancel',
                handler: function() {
                    $('#template_dialog').dialog('close')
                }
            }
        ]
    });
}

// 删除模板
function template_remove() {
    var select = $('#template_tree').tree('getSelected');
    $.messager.confirm(messages[initial]['common']['system_hint'], messages[initial]['index_tree']['if_delect_tem'].format(select.text), function(r) {
        if (r) {
            sql = "delete from template where deviceCode='{0}'".format(select.text);
            status = deletesql('Template/Template', sql)
            $('#template_tree').tree('remove', select.target);
            document.getElementById('mainPanle').innerHTML = '';
            insert_info(messages[initial]['index_tree']['delect_tem_success'].format(select.text));
        }
    });
}