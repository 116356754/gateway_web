/**
 * Created by Administrator on 2017/9/14.
 */

function table_export() {
    // var value = $("#tg").treegrid('getRows');
    var obj = get_select();
    var sql = "select * from OPC_UA";
    var dir = self.parent.$('#text').textbox('getText'); // 选中的文件夹Name
    path = 'Project/' + dir + '/Gateway';
    content = selectsql(path, sql);
    value = JSON.parse(content);
    if (value.length == 0) {
        value = [{ 'id': '', 'slaveID': '', 'protocolType': '', 'dataItem': '', 'dataID': '', 'dataFormat': '' }]
    }
    json = JSON.stringify({ 'OPC_UA': value })
    jsontoexcel(json, 'tg.xls')
}

function data_save() {
    var dir = self.parent.$('#text').textbox('getText'); // 选中的文件夹Name
    result = bulk_insert('Project/' + dir + '/Gateway', JSON.stringify(content));
    if (result == "true") {
        $("#tg").treegrid('reload');
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
    content = { "OPC_UA": [] }
    data = JSON.parse(e.data);
    if (data.length != 0) {
        data.forEach(function(tag) {
            tag_value = {
                'id': tag[0],
                'deviceCode': tag[1],
                'tagCode': tag[2],
                'name': tag[2],
                // 'objectType': tag[4]
                dataType: "float"
            }
            content['OPC_UA'].push(tag_value)
        });
        data_save(content);
    }
};

$(function() {
    var editingId;
    var row_value;
    $("#tg").treegrid({
        url: '../static/json/treegrid_data1.json',
        iconCls: 'icon-ok',
        rownumbers: true,
        animate: true,
        collapsible: true,
        fitColumns: true,
        method: 'get',
        treeField: 'rowid',
        ctrlSelect: true,
        loadFilter: function(data, parentId) {
            opcua_tree = [];
            var dir = self.parent.$('#text').textbox('getText'); // 选中的文件夹Name
            path = 'Project/' + dir + '/Gateway';
            content = selectsql(path, "select distinct deviceCode from OPC_UA");
            content = JSON.parse(content);
            content.forEach(function(device) {
                device_tree = { 'rowid': device['deviceCode'], "iconCls": "icon-opc_folder", 'name': device['deviceCode'], 'children': [] };
                tags = selectsql(path, "select * from OPC_UA where deviceCode='{0}'".format(device['deviceCode']));
                tags_object = JSON.parse(tags);
                tags_object.forEach(function(tag) {
                    tag_tree = { 'id': tag['tagCode'], "iconCls": "icon-opc_tag", 'rowid': tag['id'], 'name': tag['name'], 'dataType': tag['dataType'], 'deviceCode': tag['deviceCode'] };
                    device_tree['children'].push(tag_tree);
                });
                opcua_tree.push(device_tree);
            })
            return opcua_tree
        },
        onDblClickRow: function(row) {
            editingId = row.rowid;
            row_value = row;
            if (row._parentId != null) {
                $('#tg').treegrid('beginEdit', editingId);
            } else {
                $.messager.alert(self.parent.messages[initial]['common']['system_hint'], '设备不可编辑', "info")
            }
        },
        onClickRow: function(row) {
            editingId = row.rowid;
            row_value = row;
            $("#tg").treegrid('endEdit', row.rowid);
        },
        onAfterEdit: function(row) {
            var dir = self.parent.$('#text').textbox('getText'); // 选中的文件夹Name
            sql = "update OPC_UA set name='{0}',dataType='{1}' where id='{2}'".format(row['name'], row['dataType'], row['rowid']);
            result = updatesql('Project/' + dir + '/Gateway', sql)
            if (result == 'true') {
                self.parent.insert_info('保存成功')
            } else {
                sqlite_message(result, self.parent.messages[initial]['common']['system_hint']);
                $("#tg").treegrid('reload');
            }
        },
        // 禁用编辑
        //onBeginEdit: function(index, row) {
        //    $("#tg").treegrid('cancelEdit', index);
        //},
        idField: 'rowid',
        columns: [
            [{
                    field: 'rowid',
                    title: 'ID',
                    width: 100,
                    align: 'left',
                    editor: {
                        type: 'textbox',
                        options: {
                            required: true,
                            editable: false
                        }
                    }
                },
                {
                    field: 'name',
                    title: '名称',
                    width: 100,
                    align: 'center',
                    editor: {
                        type: 'textbox',
                        options: {
                            required: true
                                //validType: "eqmaxLength[12]",
                        }
                    }
                },
                {
                    field: 'dataType',
                    title: '数据类型',
                    width: 100,
                    align: 'center',
                    editor: {
                        type: 'combobox',
                        options: {
                            panelHeight: 'auto',
                            method: 'get',
                            url: "../static/json/opcua.json",
                            editable: false,
                            valueField: "text",
                            textField: "text",
                            required: true
                        }
                    }
                }
            ]
        ],
        toolbar: [{
                text: '添加',
                iconCls: 'icon-add',
                handler: function() {
                    self.parent.display_tag('OPC_UA', null, true)
                }
            },
            '-',
            {
                text: '保存',
                iconCls: 'icon-save',
                handler: function() {
                    if (editingId != undefined) {
                        $('#tg').treegrid('endEdit', editingId);
                        editingId = undefined;
                    }
                }
            },
            '-', {
                text: '撤销',
                iconCls: 'icon-redo',
                handler: function() {
                    if (editingId != undefined) {
                        $('#tg').treegrid('cancelEdit', editingId);
                        editingId = undefined;
                    }
                }
            }, '-', {
                text: '删除',
                iconCls: 'icon-remove',
                handler: function() {
                    // if (editingId != undefined) {
                    //     $('#tg').treegrid('remove', editingId);
                    //     editingId = undefined;
                    // }
                    $.messager.confirm('系统提示', '您确定要删除该节点和他的所有子节点吗?', function(r) {
                        if (r) {
                            var dir = self.parent.$('#text').textbox('getText'); // 选中的文件夹Name
                            if (row_value._parentId != null) {
                                sql = "DELETE FROM OPC_UA where id='{0}'".format(row_value.rowid);
                            } else {
                                sql = "DELETE FROM OPC_UA where deviceCode='{0}'".format(row_value.id);
                            }
                            result = deletesql('Project/' + dir + '/Gateway', sql);
                            if (result == 'true') {
                                self.parent.insert_info('删除成功');
                                $("#tg").treegrid('reload');
                            } else {
                                sqlite_message(result, self.parent.messages[initial]['common']['system_hint']);
                                $("#tg").treegrid('reload');
                            }
                        }
                    });
                }
            }, '-', {
                text: '清空',
                iconCls: 'icon-empty',
                handler: function() {
                    $.messager.confirm('系统提示', '您确定要清空表数据吗?', function(r) {
                        if (r) {
                            var dir = self.parent.$('#text').textbox('getText'); // 选中的文件夹Name
                            sql = "DELETE FROM OPC_UA";
                            result = truncatesql('Project/' + dir + '/Gateway', sql, 'VACUUM');
                            if (result == 'true') {
                                self.parent.insert_info('清空成功');
                                $("#tg").treegrid('reload');
                            } else {
                                sqlite_message(result, self.parent.messages[initial]['common']['system_hint']);
                                $("#tg").treegrid('reload');
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
            //        $("#tg").treegrid('reload');
            //    }
            //}
            // , '-', {
            //     text: '导入配置',
            //     iconCls: 'icon-excel',
            //     handler: function() {
            //         $("#excel-file").click();
            //     }
            // }, '-', {
            //     text: '导出配置',
            //     iconCls: 'icon-excel',
            //     handler: function() {
            //         table_export()
            //     }
            // }
        ]
    });
    //$('#dlt_modbus_type').switchbutton("options").checked;
});