/**
 * Created by Administrator on 2017/9/14.
 */

function table_export() {
    // var value = $("#DLT645_reverse_config").edatagrid('getRows');
    var obj = get_select();
    var sql = "select * from dlt645_reverse";
    var dir = self.parent.$('#text').textbox('getText'); // 选中的文件夹Name
    var select = self.parent.$('#tt').tree('getSelected');
    var parent1 = self.parent.$('#tt').tree('getParent', select.target);
    var parent2 = self.parent.$('#tt').tree('getParent', parent1.target);
    path = 'Project/' + dir + '/' + parent2.text;
    content = selectsql(path, sql);
    value = JSON.parse(content);
    if (value.length == 0) {
        value = [{ 'id': '', 'slaveID': '', 'protocolType': '', 'dataItem': '', 'dataID': '', 'dataFormat': '' }]
    }
    json = JSON.stringify({ 'dlt645_reverse': value })
    jsontoexcel(json, 'dlt645_reverse_config.xls')
}

function data_save() {
    var dir = self.parent.$('#text').textbox('getText'); // 选中的文件夹Name
    var select = self.parent.$('#tt').tree('getSelected');
    var parent1 = self.parent.$('#tt').tree('getParent', select.target);
    var parent2 = self.parent.$('#tt').tree('getParent', parent1.target);
    result = bulk_insert('Project/' + dir + '/' + parent2.text, JSON.stringify(content));
    if (result == "true") {
        $("#DLT645_reverse_config").edatagrid('reload');
        self.parent.insert_info('添加成功');
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

window.onmessage = function(e) {
    content = { "dlt645_reverse": [] }
    data = JSON.parse(e.data);
    if (data.length != 0) {
        i = 0;
        data.forEach(function(tag) {
            i += 1;
            tag_value = {
                'id': tag[0],
                'slaveID': i,
                'protocolType': 'DLT645-1997',
                'dataItem': '正向有功总电量',
                'dataID': '9010',
                'dataFormat': 'XXXXXX. XX'

            }
            content['dlt645_reverse'].push(tag_value)
        });
        data_save(content);
    }
};

$(function() {
    $("#DLT645_reverse_config").edatagrid({
        url: '../static/json/treegrid_data1.json',
        fitColumns: true,
        striped: true,
        rownumbers: true,
        loadFilter: function(data, parentId) {
            var dir = self.parent.$('#text').textbox('getText'); // 选中的文件夹Name
            var select = self.parent.$('#tt').tree('getSelected');
            var parent1 = self.parent.$('#tt').tree('getParent', select.target);
            var parent2 = self.parent.$('#tt').tree('getParent', parent1.target);
            path = 'Project/' + dir + '/' + parent2.text;
            content = selectsql(path, "select * from dlt645_reverse");
            return JSON.parse(content)
        },
        onDestroy: function(index, row) {
            var dir = self.parent.$('#text').textbox('getText'); // 选中的文件夹Name
            var select = self.parent.$('#tt').tree('getSelected');
            var parent1 = self.parent.$('#tt').tree('getParent', select.target);
            var parent2 = self.parent.$('#tt').tree('getParent', parent1.target);
            sql = "delete from dlt645_reverse where id='{0}'".format(row['id']);
            result = deletesql('Project/' + dir + '/' + parent2.text, sql)
            if (result == 'true') {
                self.parent.insert_info('删除成功')
            } else {
                sqlite_message(result, self.parent.messages[initial]['common']['system_hint']);
                $("#DLT645_reverse_config").datagrid('reload');
            }
        },
        //保存后执行
        onEndEdit: function(index, row, changs) {
            var old_data = $('#DLT645_reverse_config').datagrid('getEditor', { index: index, field: "id" });
            var dir = self.parent.$('#text').textbox('getText'); // 选中的文件夹Name
            var select = self.parent.$('#tt').tree('getSelected');
            var parent1 = self.parent.$('#tt').tree('getParent', select.target);
            var parent2 = self.parent.$('#tt').tree('getParent', parent1.target);
            if (old_data.oldHtml) { // 判断是否是更新数据
                sql = "update dlt645_reverse set id='{0}',slaveID='{1}',protocolType='{2}',dataItem='{3}',dataID='{4}',dataFormat='{5}' where id='{6}'".format(row['id'], row['slaveID'], row['protocolType'], row['dataItem'], row['dataID'], row['dataFormat'], old_data['oldHtml']);
            }
            console.log(sql)
            result = updatesql('Project/' + dir + '/' + parent2.text, sql)
            if (result == 'true') {
                self.parent.insert_info('保存成功')
            } else {
                sqlite_message(result, self.parent.messages[initial]['common']['system_hint']);
                $("#DLT645_reverse_config").datagrid('reload');
            }
        },
        // 禁用编辑
        //onBeginEdit: function(index, row) {
        //    $("#DLT645_reverse_config").datagrid('cancelEdit', index);
        //},
        idField: 'id',
        columns: [
            [{
                    field: 'id',
                    title: '名称',
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
                    field: 'slaveID',
                    title: '电表表号',
                    width: 100,
                    align: 'center',
                    editor: {
                        type: 'numberbox',
                        options: {
                            required: true
                                //validType: "eqmaxLength[12]",
                        }
                    }
                },
                {
                    field: 'protocolType',
                    title: '协议类型',
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
                                var row = $('#DLT645_reverse_config').datagrid('getSelected');
                                if (row != null) {
                                    var index = $('#DLT645_reverse_config').datagrid('getRowIndex', row);
                                    var smEditor1 = $('#DLT645_reverse_config').datagrid('getEditor', {
                                        index: index,
                                        field: 'dataItem'
                                    });
                                    var smEditor2 = $('#DLT645_reverse_config').datagrid('getEditor', {
                                        index: index,
                                        field: 'dataID'
                                    });
                                    var smEditor3 = $('#DLT645_reverse_config').datagrid('getEditor', {
                                        index: index,
                                        field: 'dataFormat'
                                    });
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
                                        $.getJSON("../static/json/dlt97_format.json", function(json) {
                                            $(smEditor3.target).combobox("loadData", json);
                                        });
                                    } else if (n == 'DLT645-2007') {
                                        $.getJSON("../static/json/dlt.json", function(json) {
                                            $(smEditor1.target).combobox("loadData", json);
                                        });
                                        $.getJSON("../static/json/dlt07_format.json", function(json) {
                                            $(smEditor3.target).combobox("loadData", json);
                                        });
                                    }
                                }
                            }
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
                            panelHeight: 150,
                            method: 'get',
                            data: [],
                            //url: Flask.url_for("static", { "filename": "json/a.json" }),
                            editable: false,
                            valueField: "text",
                            textField: "text",
                            required: true,
                            onChange: function(n, o) {
                                identification = '';
                                format = '';
                                var row = $('#DLT645_reverse_config').datagrid('getSelected');
                                if (row != null) {
                                    var index = $('#DLT645_reverse_config').datagrid('getRowIndex', row);
                                    var smEditor1 = $('#DLT645_reverse_config').datagrid('getEditor', {
                                        index: index,
                                        field: 'dataID'
                                    });
                                    var smEditor2 = $('#DLT645_reverse_config').datagrid('getEditor', {
                                        index: index,
                                        field: 'dataFormat'
                                    });
                                    if (n == '自定义数据项名称') {
                                        $(smEditor1.target).textbox({ 'editable': true });
                                        $(smEditor1.target).textbox('setValue', '');
                                        $(smEditor2.target).combobox({ 'readonly': false });
                                        $(smEditor2.target).combobox('setValue', '');
                                        if (dlt_type == 'DLT645-1997') {
                                            $.getJSON("../static/json/dlt97_format.json", function(json) {
                                                $(smEditor2.target).combobox("loadData", json);
                                            });
                                        } else {
                                            $.getJSON("../static/json/dlt07_format.json", function(json) {
                                                $(smEditor2.target).combobox("loadData", json);
                                            });
                                        }
                                    } else if (n == '') {
                                        $(smEditor1.target).textbox({ 'editable': false });
                                        $(smEditor1.target).textbox('setValue', '');
                                        $(smEditor2.target).combobox({ 'readonly': true });
                                        $(smEditor2.target).combobox('setValue', '');
                                    } else {
                                        $.ajaxSettings.async = false;
                                        if (dlt_type == 'DLT645-1997') {
                                            $.getJSON("../static/json/dlt97_slave.json", function(json) {
                                                identification = json[n]['tag'];
                                                format = json[n]['parser']
                                            });
                                        } else if (dlt_type == 'DLT645-2007') {
                                            $.getJSON("../static/json/dlt07_slave.json", function(json) {
                                                identification = json[n]['tag'];
                                                format = json[n]['parser']
                                            });
                                        }
                                        $.ajaxSettings.async = true;
                                        $(smEditor1.target).textbox({ 'editable': false });
                                        $(smEditor1.target).textbox('setValue', identification);
                                        $(smEditor2.target).combobox('setValue', format);
                                        $(smEditor2.target).combo('readonly');
                                    }
                                }
                            }
                        }
                    }
                },
                {
                    field: 'dataID',
                    title: '数据标识',
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
                    title: '数据格式',
                    width: 100,
                    align: 'center',
                    editor: {
                        type: 'combobox',
                        options: {
                            panelHeight: 'auto',
                            method: 'get',
                            url: "../static/json/dlt07_format.json",
                            editable: false,
                            valueField: "text",
                            textField: "text",
                            required: true
                        }
                    }
                }
            ]
        ],
        toolbar: [
            /*{
             text: i18next.t('total.Add_to'),
             iconCls: 'icon-add',
             handler: function() {
             var row = $('#DLT645_reverse_config').edatagrid('getRows').length;
             if (row) {
             var idvalue = $('#DLT645_reverse_config').edatagrid('getData').rows[row - 1].id;
             var value = parseInt(idvalue.substring(4, 8)) + 1;
             for (var i = 0; i < 3; i++) {
             if (value.length != 4) {
             var value = '0' + value
             }
             }
             data = idvalue.substring(0, 4) + value
             } else {
             data = 'MID10001'
             }
             $('#DLT645_reverse_config').edatagrid('addRow', {
             //index:0,#首行
             row: {
             id: data
             }
             });
             }
             }, '-',*/
            {
                text: '添加',
                iconCls: 'icon-add',
                handler: function() {
                    self.parent.display_tag('dlt645_reverse', null, true)
                }
            },
            '-',
            {
                text: '保存',
                iconCls: 'icon-save',
                handler: function() {
                    $('#DLT645_reverse_config').edatagrid('saveRow');
                }
            },
            '-', {
                text: '撤销',
                iconCls: 'icon-redo',
                handler: function() {
                    $('#DLT645_reverse_config').edatagrid('cancelRow');
                }
            }, '-', {
                text: '删除',
                iconCls: 'icon-remove',
                handler: function() {
                    $("#DLT645_reverse_config").edatagrid('destroyRow');
                }
            }, '-', {
                text: '清空',
                iconCls: 'icon-empty',
                handler: function() {
                    $.messager.confirm('系统提示', '您确定要清空表数据吗?', function(r) {
                        if (r) {
                            var dir = self.parent.$('#text').textbox('getText'); // 选中的文件夹Name
                            var select = self.parent.$('#tt').tree('getSelected');
                            var parent1 = self.parent.$('#tt').tree('getParent', select.target);
                            var parent2 = self.parent.$('#tt').tree('getParent', parent1.target);
                            sql = "DELETE FROM dlt645_reverse";
                            result = truncatesql('Project/' + dir + '/' + parent2.text, sql, 'VACUUM');
                            if (result == 'true') {
                                self.parent.insert_info('清空成功');
                                $("#DLT645_reverse_config").datagrid('reload');
                            } else {
                                sqlite_message(result, self.parent.messages[initial]['common']['system_hint']);
                                $("#DLT645_reverse_config").datagrid('reload');
                            }
                        }
                    });

                }
            }
            //,
            // '-',
            //{
            //    text: '刷新',
            //    iconCls: 'icon-reload',
            //    handler: function() {
            //        $("#DLT645_reverse_config").edatagrid('reload');
            //    }
            //}
            , '-', {
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
            }
        ]
    });
    //$('#dlt_modbus_type').switchbutton("options").checked;
});