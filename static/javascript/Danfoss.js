/**
 * Created by Administrator on 2017/9/14.
 */
function table_export() {
    // var value = $("#Danfoss_xls_config").edatagrid('getRows');
    var obj = get_select();
    var sql = "select * from Danfoss where deviceCode='{0}'".format(obj.select.text);
    content = selectsql(obj.path, sql);
    value = JSON.parse(content);
    if (value.length == 0) {
        value = [{ 'tagCode': '', 'description': '', 'vid': '' }]
    }
    json = JSON.stringify({ 'Danfoss': value })
    jsontoexcel(json, 'Danfoss_config.xls')
}

$(function() {
    var q = 0;
    $("#Danfoss_xls_config").edatagrid({
        //url: '../../collector/bin/Release/Project/a/treegrid_data1.json',
        //url: ' file:////' + task_path,
        url: '../static/json/treegrid_data1.json',
        fitColumns: true,
        striped: true,
        rownumbers: true,
        loadFilter: function(data, parentId) {
            var obj = get_select();
            var sql = "select * from Danfoss where deviceCode='{0}'".format(obj.select.text);
            content = selectsql(obj.path, sql);
            return JSON.parse(content)
        },
        onClickRow: function(index, row) {
            $("#Danfoss_xls_config").edatagrid('endEdit', index);
        },
        onDestroy: function(index, row) {
            var obj = get_select();
            var sql = "delete from Danfoss where tagCode='{0}' and deviceCode='{1}'".format(row['tagCode'], obj.select.text);
            result = deletesql(obj.path, sql)
            if (result == 'true') {
                self.parent.insert_info(self.parent.messages[initial]['common']['successfully_deleted'])
            } else {
                sqlite_message(result, self.parent.messages[initial]['common']['system_hint']);
                $("#Danfoss_xls_config").datagrid('reload');
            }
        },
        //保存后执行
        onEndEdit: function(index, row, changs) {
            var old_data = $('#Danfoss_xls_config').datagrid('getEditor', { index: index, field: "tagCode" });

            var obj = get_select();
            if (!row.isNewRecord) { // 判断是否是更新数据
                sql = "update Danfoss set tagCode='{0}',description=nullif('{1}',''),vid='{2}' where deviceCode='{3}' and tagCode='{4}'".format(row['tagCode'], row['description'], row['vid'], obj.select.text, old_data['oldHtml']);
            } else {
                sql = "insert into Danfoss values ('{0}','{1}',nullif('{2}',''),'{3}','{4}')".format(obj.select.text, row['tagCode'], row['description'], row['vid'], 'AI')
            }
            result = insertsql(obj.path, sql)
            if (result == 'true') {
                self.parent.insert_info(self.parent.messages[initial]['common']['Saved_successfully'])
            } else {
                sqlite_message(result, self.parent.messages[initial]['common']['system_hint']);
                $("#Danfoss_xls_config").datagrid('reload');
            }

        },
        idField: 'tagCode',
        columns: [
            [{
                    field: 'tagCode',
                    title: self.parent.messages[initial]['common']['name'],
                    width: 100,
                    align: 'center',
                    editor: {
                        type: 'textbox',
                        options: {
                            required: true,
                            validType: "maxLength[15]"
                        }
                    }
                },
                {
                    field: 'description',
                    title: self.parent.messages[initial]['common']['description'],
                    width: 100,
                    align: 'center',
                    editor: {
                        type: 'textbox',
                        options: {
                            validType: "maxLength[15]"
                        }
                    }
                },
                {
                    field: 'vid',
                    title: 'vid',
                    width: 100,
                    align: 'center',
                    editor: {
                        type: 'textbox',
                        options: {
                            required: true
                        }
                    }
                }
            ]
        ],
        toolbar: [{
            text: self.parent.messages[initial]['common']['add'],
            iconCls: 'icon-add',
            handler: function() {
                $('#Danfoss_xls_config').edatagrid('saveRow');
                var obj = get_select();
                var sql = "select tagCode from Danfoss where deviceCode='{0}' and tagCode LIKE'tag%'".format(obj.select.text)
                value = selectsql(obj.path, sql);
                tagCode = create_name(value);
                $('#Danfoss_xls_config').edatagrid('addRow', {
                    row: {
                        tagCode: tagCode,
                        rate: 1.00
                    }
                });
            }
        }, '-', {
            text: self.parent.messages[initial]['common']['save'],
            iconCls: 'icon-save',
            handler: function() {
                $('#Danfoss_xls_config').edatagrid('saveRow');
            }
        }, '-', {
            text: self.parent.messages[initial]['common']['redo'],
            iconCls: 'icon-redo',
            handler: function() {
                $('#Danfoss_xls_config').edatagrid('cancelRow');
            }
        }, '-', {
            text: self.parent.messages[initial]['common']['remove'],
            iconCls: 'icon-remove',
            handler: function() {
                $("#Danfoss_xls_config").edatagrid('destroyRow');
            }
        }, '-', {
            text: self.parent.messages[initial]['index']['Empty'],
            iconCls: 'icon-empty',
            handler: function() {
                $.messager.confirm(self.parent.messages[initial]['common']['system_hint'], self.parent.messages[initial]['common']['if_clear_table'], function(r) {
                    if (r) {
                        var obj = get_select();
                        var sql = "delete from Danfoss where deviceCode='{0}'".format(obj.select.text);
                        result = cfxApi.deletesql(obj.path, sql);
                        if (result == 'true') {
                            self.parent.insert_info(self.parent.messages[initial]['common']['clear_success']);
                            $("#Danfoss_xls_config").datagrid('reload');
                        } else {
                            sqlite_message(result, self.parent.messages[initial]['common']['system_hint']);
                            $("#Danfoss_xls_config").datagrid('reload');
                        }
                    }
                });

            }
        }, '-', {
            text: self.parent.messages[initial]['common']['importexcel'],
            iconCls: 'icon-excel',
            handler: function() {
                $("#excel-file").click();
            }
        }, '-', {
            text: self.parent.messages[initial]['common']['exportexcel'],
            iconCls: 'icon-excel',
            handler: function() {
                table_export()
            }
        }, '-', {
            text: self.parent.messages[initial]['common']['Load_template_file'],
            iconCls: 'icon-template',
            handler: function() {
                var obj = get_select();
                if (obj.index == 0) {
                    var select = self.parent.$('#tt').tree('getSelected');
                    var sql = "select deviceCode from Template where protocol='Danfoss'";
                    content = selectsql('Template/Template', sql);
                    template_list = JSON.parse(content);
                    $("#template_name").combobox({
                        valueField: 'deviceCode',
                        textField: 'deviceCode',
                        data: template_list,
                        panelHeight: 'auto'
                    });
                    if (template_list.length == 0) {
                        $.messager.alert(self.parent.messages[initial]['common']['system_hint'], self.parent.messages[initial]['modbus_master']['no_template'], "info")
                    } else {
                        $("#template_name").combobox('setValue', template_list[0]['deviceCode']);
                        $("#templete_dialog").dialog({
                            closable: false,
                            draggable: false,
                            modal: true,
                            buttons: [{
                                    text: self.parent.messages[initial]['common']['ok'],
                                    iconCls: 'icon-ok',
                                    handler: function() {
                                        var obj = get_select();
                                        template_name = $("#template_name").combobox('getValue');
                                        var sql = "select * from Danfoss where deviceCode='{0}'".format(template_name);
                                        content = selectsql('Template/Template', sql);
                                        content_object = JSON.parse(content);
                                        content_object.forEach(function(tag) {
                                            tag['deviceCode'] = obj.select.text
                                        });
                                        result = bulk_operate(content_object);
                                        if (result == "true") {
                                            $("#Danfoss_xls_config").edatagrid('reload');
                                            // self.parent.insert_info('装载模板' + template_name + '成功');
                                            $('#templete_dialog').dialog('close');
                                        } else {
                                            sqlite_message(result, self.parent.messages[initial]['common']['system_hint']);
                                        }
                                    }
                                },
                                {
                                    text: self.parent.messages[initial]['common']['cancel'],
                                    iconCls: 'icon-cancel',
                                    handler: function() {
                                        $('#templete_dialog').dialog('close')
                                    }
                                }
                            ]
                        });
                    }
                } else {
                    $.messager.alert(self.parent.messages[initial]['common']['system_hint'], self.parent.messages[initial]['modbus_master']['cannot_load'], "info");
                }
            }
        }, '-', {
            text: self.parent.messages[initial]['common']['Save_as_template_file'],
            iconCls: 'icon-template',
            handler: function() {
                $("#templete_save_dialog").dialog({
                    closable: false,
                    draggable: false,
                    modal: true,
                    buttons: [{
                            text: self.parent.messages[initial]['common']['ok'],
                            iconCls: 'icon-ok',
                            handler: function() {
                                var obj = get_select();
                                template_name = $("#template_save").textbox('getText');
                                var sql = "select * from Template where deviceCode='{0}'".format(template_name);
                                content = selectsql('Template/Template', sql);
                                if (content != '[]') {
                                    $.messager.confirm(self.parent.messages[initial]['common']['system_hint'], self.parent.messages[initial]['common']['if_replace_template'].format(template_name), function(r) {
                                        if (r) {
                                            sql = "update Template set protocol='Danfoss' where deviceCode='{0}'".format(template_name);
                                            status = updatesql('Template/Template', sql);
                                            sql = "delete from Danfoss where deviceCode='{0}'".format(template_name);
                                            status = deletesql('Template/Template', sql);
                                            var sql = "select * from Danfoss where deviceCode='{0}'".format(obj.select.text);
                                            CJ188_content = selectsql(obj.path, sql);
                                            CJ188_content_object = JSON.parse(CJ188_content);
                                            CJ188_content_object.forEach(function(tag) {
                                                tag['deviceCode'] = template_name
                                            });
                                            result = save_template(CJ188_content_object);
                                            if (result == "true") {
                                                $("#Danfoss_xls_config").edatagrid('reload');
                                                self.parent.insert_info(self.parent.messages[initial]['common']['save_template_success'].format(template_name));
                                                $('#templete_save_dialog').dialog('close');
                                                self.parent.load_template();
                                            } else {
                                                sqlite_message(result, self.parent.messages[initial]['common']['system_hint']);
                                            }
                                        }
                                    });
                                } else {
                                    sql = "insert into Template values('{0}','Danfoss')".format(template_name);
                                    status = insertsql('Template/Template', sql);
                                    var sql = "select * from Danfoss where deviceCode='{0}'".format(obj.select.text);
                                    CJ188_content = selectsql(obj.path, sql);
                                    CJ188_content_object = JSON.parse(CJ188_content);
                                    CJ188_content_object.forEach(function(tag) {
                                        tag['deviceCode'] = template_name
                                    });
                                    result = save_template(CJ188_content_object);
                                    if (result == "true") {
                                        $("#Danfoss_xls_config").edatagrid('reload');
                                        self.parent.insert_info(self.parent.messages[initial]['common']['save_template_success'].format(template_name));
                                        $('#templete_save_dialog').dialog('close');
                                        self.parent.load_template();
                                    } else {
                                        sqlite_message(result, self.parent.messages[initial]['common']['system_hint']);
                                    }
                                }
                            }
                        },
                        {
                            text: self.parent.messages[initial]['common']['cancel'],
                            iconCls: 'icon-cancel',
                            handler: function() {
                                $('#templete_save_dialog').dialog('close')
                            }
                        }
                    ]
                });
            }
        }]
    });

});