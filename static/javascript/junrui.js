/**
 * Created by Administrator on 2017/9/14.
 */
function table_export() {
    var value = $("#junrui_xls_config").edatagrid('getRows');
    if (value.length == 0) {
        value = [{ 'tagCode': '', 'description': '', 'dataItem': '', 'rate': '' }]
    }
    json = JSON.stringify({ 'JunRui': value })
    jsontoexcel(json, 'JunRui_config.xls')
}

$(function() {
    var q = 0;
    $("#junrui_xls_config").edatagrid({
        //url: '../../collector/bin/Release/Project/a/treegrid_data1.json',
        //url: ' file:////' + task_path,
        url: '../static/json/treegrid_data1.json',
        fitColumns: true,
        striped: true,
        rownumbers: true,
        loadFilter: function(data, parentId) {
            var obj = get_select();
            var sql = "select * from JunRui where deviceCode='{0}'".format(obj.select.text);
            content = selectsql(obj.path, sql);
            return JSON.parse(content)
        },
        onClickRow: function(index, row) {
            $("#junrui_xls_config").edatagrid('endEdit', index);
        },
        onDestroy: function(index, row) {
            var obj = get_select();
            var sql = "delete from JunRui where tagCode='{0}' and deviceCode='{1}'".format(row['tagCode'], obj.select.text);
            result = deletesql(obj.path, sql)
            if (result == 'true') {
                self.parent.insert_info('删除成功')
            } else {
                sqlite_message(result, self.parent.messages[initial]['common']['system_hint']);
                $("#junrui_xls_config").datagrid('reload');
            }
        },
        //保存后执行
        onEndEdit: function(index, row, changs) {
            var old_data = $('#junrui_xls_config').datagrid('getEditor', { index: index, field: "tagCode" });
            if (row['rate'] > 0) {
                var obj = get_select();
                if (row['dataItem'] == '读累积量') {
                    objectType = 'AI'
                } else {
                    objectType = 'BO'
                }
                if (!row.isNewRecord) { // 判断是否是更新数据
                    sql = "update JunRui set tagCode='{0}',description='{1}',dataItem='{2}',rate='{3}',objectType='{4}' where deviceCode='{5}' and tagCode='{6}'".format(row['tagCode'], row['description'], row['dataItem'], row['rate'], objectType, obj.select.text, old_data['oldHtml']);
                } else {
                    sql = "insert into JunRui values ('{0}','{1}','{2}','{3}','{4}','{5}')".format(obj.select.text, row['tagCode'], row['description'], row['dataItem'], row['rate'], objectType)
                }
                result = insertsql(obj.path, sql)
                if (result == 'true') {
                    self.parent.insert_info('保存成功')
                } else {
                    sqlite_message(result, self.parent.messages[initial]['common']['system_hint']);
                    $("#junrui_xls_config").datagrid('reload');
                }
            } else {
                $.messager.alert(self.parent.messages[initial]['common']['system_hint'], '“倍率”必须大于0！', "info");
                $("#dlt_xls_config").datagrid('reload');
            }
        },
        idField: 'tagCode',
        columns: [
            [{
                    field: 'tagCode',
                    title: '名称',
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
                    title: '描述',
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
                    field: 'dataItem',
                    title: '数据项名称',
                    width: 100,
                    align: 'center',
                    editor: {
                        type: 'combobox',
                        options: {
                            panelHeight: 'auto',
                            method: 'get',
                            url: "../static/json/junrui_type.json",
                            editable: false,
                            valueField: "text",
                            textField: "text",
                            required: true
                        }
                    }
                },
                {
                    field: 'rate',
                    title: '倍率',
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
                text: '添加',
                iconCls: 'icon-add',
                handler: function() {
                    var obj = get_select();
                    var sql = "select tagCode from JunRui where deviceCode='{0}' and tagCode LIKE'tag%'".format(obj.select.text)
                    value = selectsql(obj.path, sql);
                    tagCode = create_name(value);
                    $('#junrui_xls_config').edatagrid('addRow', {
                        row: {
                            tagCode: tagCode,
                            rate: 1.00
                        }
                    });
                }
            }, '-', {
                text: '保存',
                iconCls: 'icon-save',
                handler: function() {
                    $('#junrui_xls_config').edatagrid('saveRow');
                }
            }, '-', {
                text: '撤销',
                iconCls: 'icon-redo',
                handler: function() {
                    $('#junrui_xls_config').edatagrid('cancelRow');
                }
            }, '-', {
                text: '删除',
                iconCls: 'icon-remove',
                handler: function() {
                    $("#junrui_xls_config").edatagrid('destroyRow');
                }
            }, '-',
            {
                text: '刷新',
                iconCls: 'icon-reload',
                handler: function() {
                    $("#junrui_xls_config").edatagrid('reload');
                }
            }, '-', {
                text: '导入配置',
                iconCls: 'icon-excel',
                handler: function() {
                    $("#excel-file").click();
                }
            }, '-', {
                text: '导出配置',
                iconCls: 'icon-excel',
                handler: function() {
                    table_export()
                }
            }, '-', {
                text: '装载模板文件',
                iconCls: 'icon-template',
                handler: function() {
                    var select = self.parent.$('#tt').tree('getSelected');
                    var sql = "select deviceCode from Template where protocol='JunRui'";
                    content = selectsql('Template/Template', sql);
                    template_list = JSON.parse(content);
                    $("#template_name").combobox({
                        valueField: 'deviceCode',
                        textField: 'deviceCode',
                        data: template_list,
                        panelHeight: 'auto'
                    });
                    if (template_list.length == 0) {
                        $.messager.alert(self.parent.messages[initial]['common']['system_hint'], '没有JunRui协议的模板，请先新建模板', "info")
                    } else {
                        $("#template_name").combobox('setValue', template_list[0]['deviceCode']);
                        $("#templete_dialog").dialog({
                            closable: false,
                            draggable: false,
                            modal: true,
                            buttons: [{
                                    text: "确定",
                                    iconCls: 'icon-ok',
                                    handler: function() {
                                        var obj = get_select();
                                        template_name = $("#template_name").combobox('getValue');
                                        var sql = "select * from JunRui where deviceCode='{0}'".format(template_name);
                                        content = selectsql('Template/Template', sql);
                                        content_object = JSON.parse(content);
                                        content_object.forEach(function(tag) {
                                            tag['deviceCode'] = obj.select.text
                                        });
                                        result = bulk_operate(content_object);
                                        if (result == "true") {
                                            $("#junrui_xls_config").edatagrid('reload');
                                            self.parent.insert_info('装载模板' + template_name + '成功');
                                            $('#templete_dialog').dialog('close');
                                        } else {
                                            sqlite_message(result, self.parent.messages[initial]['common']['system_hint']);
                                        }
                                    }
                                },
                                {
                                    text: "取消",
                                    iconCls: 'icon-cancel',
                                    handler: function() {
                                        $('#templete_dialog').dialog('close')
                                    }
                                }
                            ]
                        });
                    }
                }
            }, '-', {
                text: '保存为模板文件',
                iconCls: 'icon-template',
                handler: function() {
                    $("#templete_save_dialog").dialog({
                        closable: false,
                        draggable: false,
                        modal: true,
                        buttons: [{
                                text: "确定",
                                iconCls: 'icon-ok',
                                handler: function() {
                                    var obj = get_select();
                                    template_name = $("#template_save").textbox('getText');
                                    var sql = "select * from Template where deviceCode='{0}'".format(template_name);
                                    content = selectsql('Template/Template', sql);
                                    if (content != '[]') {
                                        $.messager.confirm('系统提示', '已有名称为' + template_name + '的模板,是否要替换模板?', function(r) {
                                            if (r) {
                                                sql = "update Template set protocol='JunRui' where deviceCode='{0}'".format(template_name);
                                                status = updatesql('Template/Template', sql);
                                                sql = "delete from JunRui where deviceCode='{0}'".format(template_name);
                                                status = deletesql('Template/Template', sql);
                                                var sql = "select * from JunRui where deviceCode='{0}'".format(obj.select.text);
                                                JunRui_content = selectsql(obj.path, sql);
                                                JunRui_content_object = JSON.parse(JunRui_content);
                                                JunRui_content_object.forEach(function(tag) {
                                                    tag['deviceCode'] = template_name
                                                });
                                                result = save_template(JunRui_content_object);
                                                if (result == "true") {
                                                    $("#junrui_xls_config").edatagrid('reload');
                                                    self.parent.insert_info('保存模板' + template_name + '成功');
                                                    $('#templete_save_dialog').dialog('close');
                                                    self.parent.load_template();
                                                } else {
                                                    sqlite_message(result, self.parent.messages[initial]['common']['system_hint']);
                                                }
                                            }
                                        });
                                    } else {
                                        sql = "insert into Template values('{0}','JunRui')".format(template_name);
                                        status = insertsql('Template/Template', sql);
                                        var sql = "select * from JunRui where deviceCode='{0}'".format(obj.select.text);
                                        JunRui_content = selectsql(obj.path, sql);
                                        JunRui_content_object = JSON.parse(JunRui_content);
                                        JunRui_content_object.forEach(function(tag) {
                                            tag['deviceCode'] = template_name
                                        });
                                        result = save_template(JunRui_content_object);
                                        if (result == "true") {
                                            $("#junrui_xls_config").edatagrid('reload');
                                            self.parent.insert_info('保存模板' + template_name + '成功');
                                            $('#templete_save_dialog').dialog('close');
                                            self.parent.load_template();
                                        } else {
                                            sqlite_message(result, self.parent.messages[initial]['common']['system_hint']);
                                        }
                                    }
                                }
                            },
                            {
                                text: "取消",
                                iconCls: 'icon-cancel',
                                handler: function() {
                                    $('#templete_save_dialog').dialog('close')
                                }
                            }
                        ]
                    });
                }
            }
        ]
    });

});