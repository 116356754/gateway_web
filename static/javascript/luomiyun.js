/**
 * Created by Administrator on 2017/9/14.
 */

function data_save() {
    var dir = self.parent.$('#text').textbox('getText'); // 选中的文件夹Name
    result = bulk_insert('Project/' + dir + '/Gateway', JSON.stringify(content));
    if (result == "true") {
        $("#luomiyun_json_config").edatagrid('reload');
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
    // content = { "luomiyun": [] }
    // data = JSON.parse(e.data);
    // if (data.length != 0) {
    //     data.forEach(function(tag) {
    //         tag_value = {
    //             'id': tag[0],
    //             'deviceCode': tag[1],
    //             'tagCode': tag[2],
    //             'description': tag[3],
    //             'objectType': tag[4]
    //         }
    //         content['luomiyun'].push(tag_value)
    //     });
    //     data_save(content);
    // }


    content = { "mqtt": [] };
    data = JSON.parse(e.data);
    mqttfeature = selectsql(feature_path, "select config from iot where name='LUOMIYUN'");
    content_object = JSON.parse(mqttfeature);
    obj = JSON.parse(content_object[0]['config']);
    topic = "lm/gw/status/" + obj['base']['username'];
    if (data.length != 0) {
        data.forEach(function(tag) {
            tag_value = {
                'name': 'LUOMIYUN',
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


    $("#luomiyun_json_config").edatagrid({
        url: '../static/json/treegrid_data1.json',
        fitColumns: true,
        striped: true,
        rownumbers: true,
        loadFilter: function(data, parentId) {
            var dir = self.parent.$('#text').textbox('getText'); // 选中的文件夹Name
            path = 'Project/' + dir + '/Gateway';
            mqttfeature = selectsql(feature_path, "select config from iot where name='LUOMIYUN'");
            content_object = JSON.parse(mqttfeature);
            obj = JSON.parse(content_object[0]['config']);
            current_topic = "lm/gw/status/" + obj['base']['username'];
            content = selectsql(path, "select * from mqtt where topic='{0}' and name='LUOMIYUN'".format(current_topic));
            return JSON.parse(content)
        },
        onDestroy: function(index, row) {
            var dir = self.parent.$('#text').textbox('getText'); // 选中的文件夹Name
            mqttfeature = selectsql(feature_path, "select config from iot where name='LUOMIYUN'");
            content_object = JSON.parse(mqttfeature);
            obj = JSON.parse(content_object[0]['config']);
            current_topic = "lm/gw/status/" + obj['base']['username'];
            sql = "delete from mqtt where id='{0}' and topic='{1}' and name='LUOMIYUN'".format(row['id'], current_topic);
            result = deletesql('Project/' + dir + '/Gateway', sql)
            if (result == 'true') {
                self.parent.insert_info(self.parent.messages[initial]['common']['successfully_deleted'])
            } else {
                sqlite_message(result, self.parent.messages[initial]['common']['system_hint']);
                $("#luomiyun_json_config").datagrid('reload');
            }
        },
        //禁用编辑
        onBeginEdit: function(index, row) {
            $("#luomiyun_json_config").datagrid('cancelEdit', index);
        },
        //保存后执行
        onEndEdit: function(index, row, changs) {

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
                    self.parent.display_tag('luomiyun', null, true)
                }
            }
            // , '-', {
            //     text: '保存',
            //     iconCls: 'icon-save',
            //     handler: function() {
            //         $('#luomiyun_json_config').edatagrid('saveRow');
            //     }
            // }, '-', {
            //     text: '撤销',
            //     iconCls: 'icon-redo',
            //     handler: function() {
            //         $('#luomiyun_json_config').edatagrid('cancelRow');
            //     }
            // }
            , '-', {
                text: self.parent.messages[initial]['common']['remove'],
                iconCls: 'icon-remove',
                handler: function() {
                    $("#luomiyun_json_config").edatagrid('destroyRow');
                }
            }, '-', {
                text: self.parent.messages[initial]['index']['Empty'],
                iconCls: 'icon-empty',
                handler: function() {
                    $.messager.confirm(self.parent.messages[initial]['common']['system_hint'], self.parent.messages[initial]['common']['if_clear_table'], function(r) {
                        if (r) {
                            var dir = self.parent.$('#text').textbox('getText'); // 选中的文件夹Name
                            mqttfeature = selectsql(feature_path, "select config from iot where name='LUOMIYUN'");
                            content_object = JSON.parse(mqttfeature);
                            obj = JSON.parse(content_object[0]['config']);
                            current_topic = "lm/gw/status/" + obj['base']['username'];
                            sql = "DELETE FROM mqtt where topic='{0}' and name='LUOMIYUN'".format(current_topic);
                            result = deletesql('Project/' + dir + '/Gateway', sql);
                            if (result == 'true') {
                                self.parent.insert_info(self.parent.messages[initial]['common']['clear_success']);
                                $("#luomiyun_json_config").datagrid('reload');
                            } else {
                                sqlite_message(result, self.parent.messages[initial]['common']['system_hint ']);
                                $("#luomiyun_json_config").datagrid('reload');
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
})