/**
 * Created by Administrator on 2017/9/14.
 */

function data_save() {
    var dir = self.parent.$('#text').textbox('getText'); // 选中的文件夹Name
    result = bulk_insert('Project/' + dir + '/Gateway', JSON.stringify(content));
    if (result == "true") {
        $("#mqtt_json_config").edatagrid('reload');
        self.parent.insert_info(self.parent.messages[initial]['common']['add_success']);
    } else {
        if (result.indexOf('NOT NULL') != -1) {
            $.messager.alert(self.parent.messages[initial]['common']['system_hint'], 'Excel中“名称”不能为空！', "info")
        } else if (result.indexOf('UNIQUE') != -1) {
            $.messager.alert(self.parent.messages[initial]['common']['system_hint'], '名称重复！', "info")
        } else {
            $.messager.alert(self.parent.messages[initial]['common']['system_hint'], result, "info")
        }
    }
}

function ssldialog(type) {
    filepath = cfxApi.uploadsslfile('');
    filename = filepath.split('\\').pop();
    if (type == 'ca') {
        copyfile(filepath, 'mqtt/ssl/cafile/' + filename);
        $("#ca").combobox('setText', filename);
    } else if (type == 'cert') {
        copyfile(filepath, 'mqtt/ssl/certfile/' + filename);
        $("#cert").combobox('setText', filename);
    } else if (type == 'key') {
        copyfile(filepath, 'mqtt/ssl/keyfile/' + filename);
        $("#key").combobox('setText', filename);
    }
}

window.onmessage = function(e) {
    content = { "mqtt": [] }
    data = JSON.parse(e.data);
    topic = document.getElementById('realtopic').value;
    if (data.length != 0) {
        data.forEach(function(tag) {
            tag_value = {
                'name': 'MQTT',
                'id': tag[0],
                'topic': topic
            }
            content['mqtt'].push(tag_value)
        });
        data_save(content);
    }
};

function load_file() {
    var cacontent = JSON.parse(scanDir("mqtt/ssl/cafile"));
    var certcontent = JSON.parse(scanDir("mqtt/ssl/certfile"));
    var keycontent = JSON.parse(scanDir("mqtt/ssl/keyfile"));
    $("#ca").combobox({
        data: cacontent,
        valueField: 'Name',
        textField: 'Name',
        panelHeight: 'auto'
    });
    $("#cert").combobox({
        data: certcontent,
        valueField: 'Name',
        textField: 'Name',
        panelHeight: 'auto'
    });
    $("#key").combobox({
        data: keycontent,
        valueField: 'Name',
        textField: 'Name',
        panelHeight: 'auto'
    });
}

$(function() {
    load_file();


    $("#mqtt_json_config").edatagrid({
        url: '../static/json/treegrid_data1.json',
        fitColumns: true,
        striped: true,
        rownumbers: true,
        loadFilter: function(data, parentId) {
            var dir = self.parent.$('#text').textbox('getText'); // 选中的文件夹Name
            path = 'Project/' + dir + '/Gateway';
            current_topic = document.getElementById('realtopic').value;
            mqttcontent = selectsql(path, "select * from mqtt where topic='{0}' and name='MQTT'".format(current_topic));
            return JSON.parse(mqttcontent)
        },
        onDestroy: function(index, row) {
            var dir = self.parent.$('#text').textbox('getText'); // 选中的文件夹Name
            current_topic = $('#realtopic').combobox('getValue');
            sql = "delete from mqtt where id='{0}' and topic='{1}'  and name='MQTT'".format(row['id'], current_topic);
            result = deletesql('Project/' + dir + '/Gateway', sql)
            if (result == 'true') {
                self.parent.insert_info(self.parent.messages[initial]['common']['successfully_deleted'])
            } else {
                sqlite_message(result, self.parent.messages[initial]['common']['system_hint']);
                $("#mqtt_json_config").datagrid('reload');
            }
        },
        //禁用编辑
        // onBeginEdit: function(index, row) {
        //     $("#mqtt_json_config").datagrid('cancelEdit', index);
        // },
        //保存后执行
        onEndEdit: function(index, row, changs) {
            var old_data = $('#mqtt_json_config').datagrid('getEditor', { index: index, field: "id" });
            var dir = self.parent.$('#text').textbox('getText'); // 选中的文件夹Name
            current_topic = $('#realtopic').combobox('getValue');
            if (row['advance'] != "") {
                if (isJsonString(row['advance'])) {
                    sql = "update mqtt set advance='{0}' where id='{1}' and topic='{2}'  and name='MQTT'".format(row['advance'], old_data['oldHtml'], current_topic);
                    result = insertsql('Project/' + dir + '/Gateway', sql)
                    if (result == 'true') {
                        self.parent.insert_info(self.parent.messages[initial]['common']['Saved_successfully'])
                    } else {
                        sqlite_message(result, self.parent.messages[initial]['common']['system_hint']);
                        $("#mqtt_json_config").datagrid('reload');
                    }
                } else {
                    self.parent.insert_info(self.parent.messages[initial]['mqtt']['no_json'])
                    $("#mqtt_json_config").datagrid('reload');
                }
            } else {
                sql = "update mqtt set advance=null where id='{1}' and topic='{2}'  and name='MQTT'".format(row['advance'], old_data['oldHtml'], current_topic);
                result = insertsql('Project/' + dir + '/Gateway', sql)
                if (result == 'true') {
                    self.parent.insert_info(self.parent.messages[initial]['common']['Saved_successfully'])
                } else {
                    sqlite_message(result, self.parent.messages[initial]['common']['system_hint']);
                    $("#mqtt_json_config").datagrid('reload');
                }
            }
        },
        idField: 'id',
        columns: [
            [{
                    field: 'id',
                    title: self.parent.messages[initial]['common']['name'],
                    width: 100,
                    align: 'center',
                    editor: {
                        type: 'textbox',
                        options: {
                            required: true,
                            editable: false
                        }
                    }
                },
                {
                    field: 'advance',
                    title: self.parent.messages[initial]['index']['Advanced_parameters'],
                    width: 100,
                    align: 'center',
                    editor: {
                        type: 'textbox'
                    }
                }
                // ,
                // {
                //     field: '阈值宽度类型',
                //     title: '阈值宽度类型',
                //     width: 100,
                //     align: 'center',
                //     editor: {
                //         type: 'combobox',
                //         options: {
                //             panelHeight: 'auto',
                //             editable: false,
                //             valueField: "text",
                //             textField: "text",
                //             url: '../static/json/threshold_type.json',
                //             required: true
                //         }
                //     }
                // },
                // {
                //     field: '阈值宽度',
                //     title: '阈值宽度',
                //     width: 100,
                //     align: 'center',
                //     editor: {
                //         type: 'textbox',
                //         options: {
                //             validType: "maxLength[15]",
                //             required: true
                //         }
                //     }
                // },
                // //{
                // //    field: '抖动时间',
                // //    title: '抖动时间',
                // //    width: 100,
                // //    align: 'center',
                // //    editor: {
                // //        type: 'textbox',
                // //        options: {
                // //            validType: "maxLength[15]"
                // //        }
                // //    }
                // //},
                // {
                //     field: '小数位数',
                //     title: '小数位数',
                //     width: 100,
                //     align: 'center',
                //     editor: {
                //         type: 'numberbox',
                //         options: {
                //             validType: "maxLength[6]"
                //         }
                //     }
                // }

            ]
        ],
        toolbar: [{
                text: self.parent.messages[initial]['common']['add'],
                iconCls: 'icon-add',
                handler: function() {
                    self.parent.display_tag('mqtt', null, true)
                }
            },
            '-',
            {
                text: self.parent.messages[initial]['common']['save'],
                iconCls: 'icon-save',
                handler: function() {
                    $('#mqtt_json_config').edatagrid('saveRow');
                }
            },
            '-', {
                text: self.parent.messages[initial]['common']['redo'],
                iconCls: 'icon-redo',
                handler: function() {
                    $('#mqtt_json_config').edatagrid('cancelRow');
                }
            }, '-', {
                text: self.parent.messages[initial]['common']['remove'],
                iconCls: 'icon-remove',
                handler: function() {
                    $("#mqtt_json_config").edatagrid('destroyRow');
                }
            }, '-', {
                text: self.parent.messages[initial]['index']['Empty'],
                iconCls: 'icon-empty',
                handler: function() {
                    $.messager.confirm(self.parent.messages[initial]['common']['system_hint'], self.parent.messages[initial]['common']['if_clear_table'], function(r) {
                        if (r) {
                            var dir = self.parent.$('#text').textbox('getText'); // 选中的文件夹Name
                            current_topic = $('#realtopic').combobox('getValue');
                            sql = "DELETE FROM mqtt where topic='{0}'  and name='MQTT'".format(current_topic);
                            result = deletesql('Project/' + dir + '/Gateway', sql);
                            if (result == 'true') {
                                self.parent.insert_info(self.parent.messages[initial]['common']['clear_success']);
                                $("#mqtt_json_config").datagrid('reload');
                            } else {
                                sqlite_message(result, self.parent.messages[initial]['common']['system_hint ']);
                                $("#mqtt_json_config").datagrid('reload');
                            }
                        }
                    });

                }
            }
            // , '-', {
            //     text: '导入配置',
            //     iconCls: 'icon-excel',
            //     handler: function() {
            //         $("#mrx").dialog()
            //     }
            // }, '-', {
            //     text: '导出配置',
            //     iconCls: 'icon-excel',
            //     handler: function() {
            //         downFile('/mqtt/excelexport')
            //     }
            // }
        ]
    });
    $('#ssl').switchbutton("options").checked;
})