/**
 * Created by Administrator on 2017/9/14.
 */
function table_export() {
    // var value = $("#cj_xls_config").edatagrid('getRows');
    var obj = get_select();
    var sql = "select * from CJ188 where deviceCode='{0}'".format(obj.select.text);
    content = selectsql(obj.path, sql);
    value = JSON.parse(content);
    if (value.length == 0) {
        value = [{ 'tagCode': '', 'description': '', 'vendorCode': '', 'dataItem': '', 'rate': '' }]
    }
    json = JSON.stringify({ 'CJ188': value })
    jsontoexcel(json, 'CJ188_config.xls')
}

$(function() {
    var q = 0;
    $("#cj_xls_config").edatagrid({
        //url: '../../collector/bin/Release/Project/a/treegrid_data1.json',
        //url: ' file:////' + task_path,
        url: '../static/json/treegrid_data1.json',
        fitColumns: true,
        striped: true,
        rownumbers: true,
        loadFilter: function(data, parentId) {
            var obj = get_select();
            var sql = "select * from CJ188 where deviceCode='{0}'".format(obj.select.text);
            content = selectsql(obj.path, sql);
            return JSON.parse(content)
        },
        onClickRow: function(index, row) {
            $("#cj_xls_config").edatagrid('endEdit', index);
        },
        onDestroy: function(index, row) {
            var obj = get_select();
            var sql = "delete from CJ188 where tagCode='{0}' and deviceCode='{1}'".format(row['tagCode'], obj.select.text);
            result = deletesql(obj.path, sql)
            if (result == 'true') {
                self.parent.insert_info(self.parent.messages[initial]['common']['successfully_deleted'])
            } else {
                sqlite_message(result, self.parent.messages[initial]['common']['system_hint']);
                $("#cj_xls_config").datagrid('reload');
            }
        },
        //保存后执行
        onEndEdit: function(index, row, changs) {
            var old_data = $('#cj_xls_config').datagrid('getEditor', { index: index, field: "tagCode" });
            if (row['rate'] > 0) {
                var obj = get_select();
                if (!row.isNewRecord) { // 判断是否是更新数据
                    sql = "update CJ188 set tagCode='{0}',description=nullif('{1}',''),vendorCode='{2}',dataItem='{3}',rate='{4}',objectType='{5}' where deviceCode='{6}' and tagCode='{7}'".format(row['tagCode'], row['description'], row['vendorCode'], row['dataItem'], row['rate'], 'AI', obj.select.text, old_data['oldHtml']);
                } else {
                    sql = "insert into CJ188 values ('{0}','{1}',nullif('{2}',''),'{3}','{4}','{5}','{6}')".format(obj.select.text, row['tagCode'], row['description'], row['vendorCode'], row['dataItem'], row['rate'], 'AI')
                }
                result = insertsql(obj.path, sql)
                if (result == 'true') {
                    self.parent.insert_info(self.parent.messages[initial]['common']['Saved_successfully'])
                } else {
                    sqlite_message(result, self.parent.messages[initial]['common']['system_hint']);
                    $("#cj_xls_config").datagrid('reload');
                }
            } else {
                $.messager.alert(self.parent.messages[initial]['common']['system_hint'], self.parent.messages[initial]['common']['rate0'], "info");
                $("#dlt_xls_config").datagrid('reload');
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
                    field: 'vendorCode',
                    title: self.parent.messages[initial]['CJ188']['vendorCode'],
                    width: 100,
                    align: 'center',
                    editor: {
                        type: 'textbox',
                        options: {
                            required: true,
                            validType: "eq_letter_Length[4]"
                        }
                    }
                },
                {
                    field: 'dataItem',
                    title: self.parent.messages[initial]['CJ188']['dataItem'],
                    width: 100,
                    align: 'center',
                    editor: {
                        type: 'combobox',
                        options: {
                            panelHeight: 'auto',
                            method: 'get',
                            url: "../static/json/cj_188.json",
                            editable: false,
                            valueField: "text",
                            textField: "text",
                            required: true
                        }
                    }
                },
                {
                    field: 'rate',
                    title: self.parent.messages[initial]['CJ188']['rate'],
                    width: 100,
                    align: 'center',
                    editor: {
                        type: 'textbox',
                        options: {
                            required: true,
                            validType: "mone"
                        }
                    }
                }
            ]
        ],
        toolbar: [{
            text: self.parent.messages[initial]['common']['add'],
            iconCls: 'icon-add',
            handler: function() {
                $('#cj_xls_config').edatagrid('saveRow');
                var obj = get_select();
                var sql = "select tagCode from CJ188 where deviceCode='{0}' and tagCode LIKE'tag%'".format(obj.select.text)
                value = selectsql(obj.path, sql);
                tagCode = create_name(value);
                $('#cj_xls_config').edatagrid('addRow', {
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
                $('#cj_xls_config').edatagrid('saveRow');
            }
        }, '-', {
            text: self.parent.messages[initial]['common']['redo'],
            iconCls: 'icon-redo',
            handler: function() {
                $('#cj_xls_config').edatagrid('cancelRow');
            }
        }, '-', {
            text: self.parent.messages[initial]['common']['remove'],
            iconCls: 'icon-remove',
            handler: function() {
                $("#cj_xls_config").edatagrid('destroyRow');
            }
        }, '-', {
            text: self.parent.messages[initial]['index']['Empty'],
            iconCls: 'icon-empty',
            handler: function() {
                $.messager.confirm(self.parent.messages[initial]['common']['system_hint'], self.parent.messages[initial]['common']['if_clear_table'], function(r) {
                    if (r) {
                        var obj = get_select();
                        var sql = "delete from CJ188 where deviceCode='{0}'".format(obj.select.text);
                        result = cfxApi.deletesql(obj.path, sql);
                        if (result == 'true') {
                            self.parent.insert_info(self.parent.messages[initial]['common']['clear_success']);
                            $("#cj_xls_config").datagrid('reload');
                        } else {
                            sqlite_message(result, self.parent.messages[initial]['common']['system_hint']);
                            $("#cj_xls_config").datagrid('reload');
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
                    var sql = "select deviceCode from Template where protocol='CJ188'";
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
                                        var sql = "select * from CJ188 where deviceCode='{0}'".format(template_name);
                                        content = selectsql('Template/Template', sql);
                                        content_object = JSON.parse(content);
                                        content_object.forEach(function(tag) {
                                            tag['deviceCode'] = obj.select.text
                                        });
                                        result = bulk_operate(content_object);
                                        if (result == "true") {
                                            $("#cj_xls_config").edatagrid('reload');
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
                                            sql = "update Template set protocol='CJ188' where deviceCode='{0}'".format(template_name);
                                            status = updatesql('Template/Template', sql);
                                            sql = "delete from CJ188 where deviceCode='{0}'".format(template_name);
                                            status = deletesql('Template/Template', sql);
                                            var sql = "select * from CJ188 where deviceCode='{0}'".format(obj.select.text);
                                            CJ188_content = selectsql(obj.path, sql);
                                            CJ188_content_object = JSON.parse(CJ188_content);
                                            CJ188_content_object.forEach(function(tag) {
                                                tag['deviceCode'] = template_name
                                            });
                                            result = save_template(CJ188_content_object);
                                            if (result == "true") {
                                                $("#cj_xls_config").edatagrid('reload');
                                                self.parent.insert_info(self.parent.messages[initial]['common']['save_template_success'].format(template_name));
                                                $('#templete_save_dialog').dialog('close');
                                                self.parent.load_template();
                                            } else {
                                                sqlite_message(result, self.parent.messages[initial]['common']['system_hint']);
                                            }
                                        }
                                    });
                                } else {
                                    sql = "insert into Template values('{0}','CJ188')".format(template_name);
                                    status = insertsql('Template/Template', sql);
                                    var sql = "select * from CJ188 where deviceCode='{0}'".format(obj.select.text);
                                    CJ188_content = selectsql(obj.path, sql);
                                    CJ188_content_object = JSON.parse(CJ188_content);
                                    CJ188_content_object.forEach(function(tag) {
                                        tag['deviceCode'] = template_name
                                    });
                                    result = save_template(CJ188_content_object);
                                    if (result == "true") {
                                        $("#cj_xls_config").edatagrid('reload');
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