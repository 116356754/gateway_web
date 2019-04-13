/**
 * Created by Administrator on 2017/9/14.
 */
function table_export() {
    // var value = $("#dlt_xls_config").edatagrid('getRows');
    var obj = get_select();
    var sql = "select * from DLT645 where deviceCode='{0}'".format(obj.select.text);
    content = selectsql(obj.path, sql);
    value = JSON.parse(content);
    if (value.length == 0) {
        value = [{ 'tagCode': '', 'description': '', 'protocolType': '', 'dataItem': '', 'dataID': '', 'dataFormat': '', 'dataOffset': '', 'rate': '' }]
    }
    json = JSON.stringify({ 'DLT645': value })
    jsontoexcel(json, 'DLT645_config.xls')
}

$(function() {
    var dlt_type = '';
    $("#dlt_xls_config").edatagrid({
        url: '../static/json/treegrid_data1.json',
        fitColumns: true,
        striped: true,
        rownumbers: true,
        // data: data,
        loadFilter: function(data, parentId) {
            var obj = get_select();
            var sql = "select * from DLT645 where deviceCode='{0}'".format(obj.select.text)
            content = selectsql(obj.path, sql);
            return JSON.parse(content)
        },
        onClickRow: function(index, row) {
            // console.log(index)
            $("#dlt_xls_config").edatagrid('endEdit', index);
        },
        onDblClickRow: function(index, row) {
            // console.log(row)
        },
        onDestroy: function(index, row) {
            var obj = get_select();
            var sql = "delete from DLT645 where tagCode='{0}' and deviceCode='{1}'".format(row['tagCode'], obj.select.text);
            result = deletesql(obj.path, sql)
            if (result == 'true') {
                self.parent.insert_info(self.parent.messages[initial]['common']['successfully_deleted'])
            } else {
                sqlite_message(result, self.parent.messages[initial]['common']['system_hint']);
                $("#dlt_xls_config").datagrid('reload');
            }
        },
        //保存后执行
        onEndEdit: function(index, row, changs) {
            var old_data = $('#dlt_xls_config').datagrid('getEditor', { index: index, field: "tagCode" });
            if (row['rate'] > 0) {
                var obj = get_select();
                if (!row.isNewRecord) { // 判断是否是更新数据
                    sql = "update DLT645 set tagCode='{0}',description=nullif('{1}',''),protocolType='{2}',dataItem='{3}',dataID='{4}',dataFormat='{5}',dataOffset='{6}',rate={7},objectType='{8}' where deviceCode='{9}' and tagCode='{10}'".format(row['tagCode'], row['description'], row['protocolType'], row['dataItem'], row['dataID'], row['dataFormat'], row['dataOffset'], row['rate'], 'AI', obj.select.text, old_data['oldHtml']);
                } else {
                    sql = "insert into DLT645 values ('{0}','{1}',nullif('{2}',''),'{3}','{4}','{5}','{6}','{7}',{8},'{9}')".format(obj.select.text, row['tagCode'], row['description'], row['protocolType'], row['dataItem'], row['dataID'], row['dataFormat'], row['dataOffset'], row['rate'], 'AI')
                }
                result = insertsql(obj.path, sql)
                if (result == 'true') {
                    self.parent.insert_info(self.parent.messages[initial]['common']['Saved_successfully'])
                } else {
                    sqlite_message(result, self.parent.messages[initial]['common']['system_hint']);
                    $("#dlt_xls_config").datagrid('reload');
                }
            } else {
                $.messager.alert(self.parent.messages[initial]['common']['system_hint'], self.parent.messages[initial]['common']['rate0'], "info");
                $("#dlt_xls_config").datagrid('reload');
            }
        },
        // onBeforeSave: function(index, row) {
        //     $('#dlt_xls_config').edatagrid('unselectAll')
        // },
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
                        type: 'textbox'
                    }
                },
                {
                    field: 'protocolType',
                    title: self.parent.messages[initial]['dlt645']['protocol_type'],
                    width: 100,
                    align: 'center',
                    editor: {
                        type: 'combobox',
                        options: {
                            panelHeight: 'auto',
                            method: 'get',
                            url: "../static/json/agreement_type.json",
                            editable: false,
                            valueField: "text",
                            textField: "text",
                            required: true,
                            onChange: function(n, o) {
                                dlt_type = n;
                                var row = $('#dlt_xls_config').datagrid('getSelected');
                                if (row != null) {
                                    var index = $('#dlt_xls_config').datagrid('getRowIndex', row);
                                    var smEditor1 = $('#dlt_xls_config').datagrid('getEditor', {
                                        index: index,
                                        field: 'dataItem'
                                    });
                                    var smEditor2 = $('#dlt_xls_config').datagrid('getEditor', {
                                        index: index,
                                        field: 'dataID'
                                    });
                                    var smEditor3 = $('#dlt_xls_config').datagrid('getEditor', {
                                        index: index,
                                        field: 'dataFormat'
                                    });
                                    if (smEditor1 != null) {
                                        $(smEditor1.target).combobox({
                                            onLoadSuccess: function() {
                                                $(smEditor1.target).combobox('setValue', []);
                                            }
                                        });
                                        $(smEditor2.target).textbox('setValue', '');
                                        $(smEditor3.target).combobox({
                                            onLoadSuccess: function() {
                                                $(smEditor3.target).combobox('setValue', []);
                                            }
                                        });
                                        //onShowPanel: function () { //下拉展开时动态修改options
                                        //datatype处理统计方法
                                        if (n == 'DLT645-1997') {
                                            $.getJSON("../static/json/dlt97.json", function(json) {
                                                $(smEditor1.target).combobox("loadData", json);
                                            });
                                        } else if (n == 'DLT645-2007') {
                                            $.getJSON("../static/json/dlt.json", function(json) {
                                                $(smEditor1.target).combobox("loadData", json);
                                            });
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                {
                    field: 'dataItem',
                    title: self.parent.messages[initial]['dlt645']['dataItem'],
                    width: 100,
                    align: 'center',
                    editor: {
                        type: 'combobox',
                        options: {
                            panelHeight: 150,
                            method: 'get',
                            data: [],
                            //url: Flask.url_for("static", { "filename": "json/a.json" }),
                            editable: false,
                            valueField: "text",
                            textField: "text",
                            required: true,
                            onChange: function(n, o) {
                                var row = $('#dlt_xls_config').datagrid('getSelected');
                                if (row != null) {
                                    var index = $('#dlt_xls_config').datagrid('getRowIndex', row);
                                    var smEditor1 = $('#dlt_xls_config').datagrid('getEditor', {
                                        index: index,
                                        field: 'dataID'
                                    });
                                    var smEditor2 = $('#dlt_xls_config').datagrid('getEditor', {
                                        index: index,
                                        field: 'dataFormat'
                                    });
                                    // if (n == '自定义数据项名称') {
                                    //     $(smEditor1.target).textbox({ 'editable': true });
                                    //     $(smEditor1.target).textbox('setValue', '');
                                    //     $(smEditor2.target).combobox({ 'readonly': false });
                                    //     $(smEditor2.target).combobox('setValue', '');
                                    //     if (dlt_type == 'DLT645-1997') {
                                    //         $.getJSON("../static/json/dlt97_format.json", function(json) {
                                    //             $(smEditor2.target).combobox("loadData", json);
                                    //         });
                                    //     } else {
                                    //         $.getJSON("../static/json/dlt07_format.json", function(json) {
                                    //             $(smEditor2.target).combobox("loadData", json);
                                    //         });
                                    //     }
                                    if (n == '') { // 双击修改时会先显示原有的名称，之后会因为协议类型修改了会变成''
                                        // $(smEditor1.target).textbox({ 'editable': false });
                                        $(smEditor1.target).textbox('setValue', '');
                                        // $(smEditor2.target).combobox({ 'readonly': true });
                                        $(smEditor2.target).combobox('setValue', '');
                                    } else {
                                        $.ajaxSettings.async = false;
                                        if (dlt_type == 'DLT645-1997') {
                                            $.getJSON("../static/json/dlt97_slave.json", function(json) {
                                                if (json[n]) {
                                                    identification = json[n]['tag'];
                                                    format = json[n]['parser']
                                                } else {
                                                    identification = '';
                                                    format = '';
                                                }
                                            });
                                        } else if (dlt_type == 'DLT645-2007') {
                                            $.getJSON("../static/json/dlt07_slave.json", function(json) {
                                                if (json[n]) {
                                                    identification = json[n]['tag'];
                                                    format = json[n]['parser']
                                                } else {
                                                    identification = '';
                                                    format = '';
                                                }
                                            });
                                        }
                                        $.ajaxSettings.async = true;
                                        if (smEditor1 != null) {
                                            // $(smEditor1.target).textbox({ 'editable': false });
                                            $(smEditor1.target).textbox('setValue', identification);
                                            $(smEditor2.target).combobox('setValue', format);
                                            // $(smEditor2.target).combo('readonly');
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                {
                    field: 'dataID',
                    title: self.parent.messages[initial]['dlt645']['dataID'],
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
                    field: 'dataFormat',
                    title: self.parent.messages[initial]['dlt645']['dataFormat'],
                    width: 100,
                    align: 'center',
                    editor: {
                        type: 'combobox',
                        options: {
                            panelHeight: 'auto',
                            method: 'get',
                            //data: [],
                            url: "../static/json/dlt07_format.json",
                            editable: false,
                            readonly: true,
                            valueField: "text",
                            textField: "text",
                            required: true
                        }
                    }
                }, {
                    field: 'dataOffset',
                    title: self.parent.messages[initial]['dlt645']['dataOffset'],
                    width: 100,
                    align: 'center',
                    editor: {
                        type: 'numberbox',
                        options: {
                            required: true,
                            editable: false
                        }
                    }
                },
                {
                    field: 'rate',
                    title: self.parent.messages[initial]['dlt645']['rate'],
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
                    // $('#dlt_xls_config').datagrid('unselectAll')
                    $('#dlt_xls_config').edatagrid('saveRow');
                    var obj = get_select();
                    var sql = "select tagCode from DLT645 where deviceCode='{0}' and tagCode LIKE'tag%'".format(obj.select.text)
                    value = selectsql(obj.path, sql);
                    tagCode = create_name(value);
                    $('#dlt_xls_config').edatagrid('addRow', {
                        row: {
                            tagCode: tagCode,
                            rate: 1.00,
                            dataOffset: 0
                        }
                    });
                }
            }, '-',
            {
                text: self.parent.messages[initial]['dlt645']['insert'],
                iconCls: 'icon-dltinsert',
                handler: function() {
                    display_dialog('insert_dialog', '插入数据');
                    $('#dlt_xls_config').edatagrid('saveRow');
                    var obj = get_select();
                    var sql = "select tagCode from DLT645 where deviceCode='{0}' and tagCode LIKE'tag%'".format(obj.select.text)
                    value = selectsql(obj.path, sql);
                    tagCode = create_name(value);
                    $('#dialog_tagcode').textbox('setValue', tagCode);
                    $('#insert_dialog').dialog({
                        buttons: [{
                                text: self.parent.messages[initial]['common']['ok'],
                                iconCls: 'icon-ok',
                                handler: function() {
                                    if ($('#insert_form').form('validate')) {
                                        row = {};
                                        row['tagCode'] = $('#dialog_tagcode').textbox('getValue');
                                        row['description'] = $('#dialog_description').textbox('getValue');
                                        row['protocolType'] = $('#dialog_protocol_type').textbox('getValue');
                                        row['dataItem'] = $('#dialog_dataItem').textbox('getValue');
                                        row['dataID'] = $('#dialog_dataID').textbox('getValue');
                                        row['dataFormat'] = $('#dialog_dataFormat').textbox('getValue');
                                        row['dataOffset'] = $('#dialog_dataOffset').textbox('getValue');
                                        rate_float = parseFloat($('#dialog_rate').textbox('getValue'));
                                        row['rate'] = rate_float.toFixed(2);
                                        if (row['rate'] > 0) {
                                            var obj = get_select();
                                            sql = "insert into DLT645 values ('{0}','{1}','{2}','{3}','{4}','{5}','{6}','{7}',{8},'{9}')".format(obj.select.text, row['tagCode'], row['description'], row['protocolType'], row['dataItem'], row['dataID'], row['dataFormat'], row['dataOffset'], row['rate'], 'AI')
                                            result = insertsql(obj.path, sql)
                                            if (result == 'true') {
                                                self.parent.insert_info(self.parent.messages[initial]['common']['Saved_successfully'])
                                                $('#insert_dialog').dialog('close');
                                                $("#dlt_xls_config").datagrid('reload');
                                            } else {
                                                sqlite_message(result, self.parent.messages[initial]['common']['system_hint']);
                                                $("#dlt_xls_config").datagrid('reload');
                                            }
                                        } else {
                                            $.messager.alert(self.parent.messages[initial]['common']['system_hint'], self.parent.messages[initial]['common']['rate0'], "info");
                                            $("#dlt_xls_config").datagrid('reload');
                                        }
                                    }
                                }
                            },
                            {
                                text: self.parent.messages[initial]['common']['cancel'],
                                iconCls: 'icon-cancel',
                                handler: function() {
                                    $('#insert_dialog').dialog('close')
                                }
                            }
                        ]
                    });
                }
            }, '-', {
                text: self.parent.messages[initial]['common']['save'],
                iconCls: 'icon-save',
                handler: function() {
                    // $('#dlt_xls_config').edatagrid('unselectAll')
                    $('#dlt_xls_config').edatagrid('saveRow');
                }
            }, '-', {
                text: self.parent.messages[initial]['common']['redo'],
                iconCls: 'icon-redo',
                handler: function() {
                    $('#dlt_xls_config').edatagrid('cancelRow');
                }
            }, '-', {
                text: self.parent.messages[initial]['common']['remove'],
                iconCls: 'icon-remove',
                handler: function() {
                    $("#dlt_xls_config").edatagrid('destroyRow');
                }
            }, '-', {
                text: self.parent.messages[initial]['index']['Empty'],
                iconCls: 'icon-empty',
                handler: function() {
                    $.messager.confirm(self.parent.messages[initial]['common']['system_hint'], self.parent.messages[initial]['common']['if_clear_table'], function(r) {
                        if (r) {
                            var obj = get_select();
                            var sql = "delete from DLT645 where deviceCode='{0}'".format(obj.select.text);
                            result = cfxApi.deletesql(obj.path, sql);
                            if (result == 'true') {
                                self.parent.insert_info(self.parent.messages[initial]['common']['clear_success']);
                                $("#dlt_xls_config").datagrid('reload');
                            } else {
                                sqlite_message(result, self.parent.messages[initial]['common']['system_hint']);
                                $("#dlt_xls_config").datagrid('reload');
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
                        var sql = "select deviceCode from Template where protocol='DLT645'";
                        content = selectsql('Template/Template', sql);
                        template_list = JSON.parse(content);
                        $("#template_name").combobox({
                            valueField: 'deviceCode',
                            textField: 'deviceCode',
                            data: template_list,
                            panelHeight: 'auto'
                        });
                        if (template_list.length == 0) {
                            $.messager.alert(self.parent.messages[initial]['common']['system_hint'], self.parent.messages[initial]['dlt645']['no_template'], "info")
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
                                            var sql = "select * from DLT645 where deviceCode='{0}'".format(template_name);
                                            content = selectsql('Template/Template', sql);
                                            content_object = JSON.parse(content);
                                            content_object.forEach(function(tag) {
                                                tag['deviceCode'] = obj.select.text
                                            });
                                            result = bulk_operate(content_object);
                                            if (result == "true") {
                                                $("#dlt_xls_config").edatagrid('reload');
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
                    // values = $("#dlt_xls_config").datagrid('getRows');
                    // var blob = new Blob([JSON.stringify(values)], { type: "" });
                    // saveAs(blob, "*.json");
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
                                                sql = "update Template set protocol='DLT645' where deviceCode='{0}'".format(template_name);
                                                status = updatesql('Template/Template', sql);
                                                sql = "delete from DLT645 where deviceCode='{0}'".format(template_name);
                                                status = deletesql('Template/Template', sql);
                                                var sql = "select * from DLT645 where deviceCode='{0}'".format(obj.select.text);
                                                DLT645_content = selectsql(obj.path, sql);
                                                DLT645_content_object = JSON.parse(DLT645_content);
                                                DLT645_content_object.forEach(function(tag) {
                                                    tag['deviceCode'] = template_name
                                                });
                                                result = save_template(DLT645_content_object);
                                                if (result == "true") {
                                                    $("#dlt_xls_config").edatagrid('reload');
                                                    self.parent.insert_info(self.parent.messages[initial]['common']['save_template_success'].format(template_name));
                                                    $('#templete_save_dialog').dialog('close');
                                                    self.parent.load_template();
                                                } else {
                                                    sqlite_message(result, self.parent.messages[initial]['common']['system_hint']);
                                                }
                                            }
                                        });
                                    } else {
                                        sql = "insert into Template values('{0}','DLT645')".format(template_name);
                                        status = insertsql('Template/Template', sql);
                                        var sql = "select * from DLT645 where deviceCode='{0}'".format(obj.select.text);
                                        DLT645_content = selectsql(obj.path, sql);
                                        DLT645_content_object = JSON.parse(DLT645_content);
                                        DLT645_content_object.forEach(function(tag) {
                                            tag['deviceCode'] = template_name
                                        });
                                        result = save_template(DLT645_content_object);
                                        if (result == "true") {
                                            $("#dlt_xls_config").edatagrid('reload');
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
            }
        ]
    });
});