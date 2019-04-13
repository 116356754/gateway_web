/**
 * Created by Administrator on 2017/9/14.
 */

$(function() {
    var q = 0;
    $("#user_xls_config").edatagrid({
        //url: '../../collector/bin/Release/Project/a/treegrid_data1.json',
        //url: ' file:////' + task_path,
        url: '../static/json/treegrid_data1.json',
        fitColumns: true,
        striped: true,
        rownumbers: true,
        loadFilter: function(data, parentId) {
            var dir = self.parent.$('#text').textbox('getText'); // 选中的文件夹名称
            var path = 'Project/' + dir + '/Gateway';
            content = selectsql(path, "select * from user_point");
            return JSON.parse(content)
        },
        onClickRow: function(index, row) {
            $("#user_xls_config").edatagrid('endEdit', index);
        },
        onDestroy: function(index, row) {
            var dir = self.parent.$('#text').textbox('getText'); // 选中的文件夹名称
            var path = 'Project/' + dir + '/Gateway';
            var sql = "delete from user_point where tagCode='{0}'".format(row['tagCode']);
            result = deletesql(path, sql)
            if (result == 'true') {
                self.parent.insert_info(self.parent.messages[initial]['common']['successfully_deleted'])
            } else {
                sqlite_message(result, self.parent.messages[initial]['common']['system_hint']);
                $("#user_xls_config").datagrid('reload');
            }
        },
        //保存后执行
        onEndEdit: function(index, row, changs) {
            var old_data = $('#user_xls_config').datagrid('getEditor', { index: index, field: "tagCode" });
            var dir = self.parent.$('#text').textbox('getText'); // 选中的文件夹名称
            var path = 'Project/' + dir + '/Gateway';
            if (row['dataType'] == 'Analog') {
                objectType = 'AV'
            } else {
                objectType = 'BV'
            }
            if (objectType == 'BV' && row['defaultValue'] != '0' && row['defaultValue'] != '1') {
                $.messager.alert(self.parent.messages[initial]['common']['system_hint'], self.parent.messages[initial]['user_point']['bv_range'], "info");
                $("#user_xls_config").datagrid('reload');
            } else {
                if (!row.isNewRecord) { // 判断是否是更新数据
                    sql = "update user_point set tagCode='{0}',description=nullif('{1}',''),dataType='{2}',defaultValue='{3}',objectType='{4}' where tagCode='{5}'".format(row['tagCode'], row['description'], row['dataType'], row['defaultValue'], objectType, old_data['oldHtml']);
                } else {
                    sql = "insert into user_point values ('{0}','{1}',nullif('{2}',''),'{3}','{4}','{5}')".format('user', row['tagCode'], row['description'], row['dataType'], row['defaultValue'], objectType)
                }
                result = insertsql(path, sql)
                if (result == 'true') {
                    self.parent.insert_info(self.parent.messages[initial]['common']['Saved_successfully'])
                } else {
                    sqlite_message(result, self.parent.messages[initial]['common']['system_hint']);
                    $("#user_xls_config").datagrid('reload');
                }
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
                    field: 'dataType',
                    title: self.parent.messages[initial]['user_point']['dataType'],
                    width: 100,
                    align: 'center',
                    editor: {
                        type: 'combobox',
                        options: {
                            panelHeight: 'auto',
                            method: 'get',
                            url: "../static/json/userType.json",
                            editable: false,
                            valueField: "text",
                            textField: "text",
                            required: true
                        }
                    }
                },
                {
                    field: 'defaultValue',
                    title: self.parent.messages[initial]['user_point']['defaultValue'],
                    width: 100,
                    align: 'center',
                    editor: {
                        type: 'textbox',
                        options: {
                            required: true,
                            validType: "eqmaxLength[10]"
                        }
                    }
                }
            ]
        ],
        toolbar: [{
            text: self.parent.messages[initial]['common']['add'],
            iconCls: 'icon-add',
            handler: function() {
                $('#user_xls_config').edatagrid('saveRow');
                var dir = self.parent.$('#text').textbox('getText'); // 选中的文件夹名称
                var path = 'Project/' + dir + '/Gateway';
                var sql = "select tagCode from user_point where tagCode LIKE'tag%'"
                value = selectsql(path, sql);
                tagCode = create_name(value);
                $('#user_xls_config').edatagrid('addRow', {
                    row: {
                        tagCode: tagCode
                    }
                });
            }
        }, '-', {
            text: self.parent.messages[initial]['common']['save'],
            iconCls: 'icon-save',
            handler: function() {
                $('#user_xls_config').edatagrid('saveRow');
            }
        }, '-', {
            text: self.parent.messages[initial]['common']['redo'],
            iconCls: 'icon-redo',
            handler: function() {
                $('#user_xls_config').edatagrid('cancelRow');
            }
        }, '-', {
            text: self.parent.messages[initial]['common']['remove'],
            iconCls: 'icon-remove',
            handler: function() {
                $("#user_xls_config").edatagrid('destroyRow');
            }
        }, '-', {
            text: self.parent.messages[initial]['index']['Empty'],
            iconCls: 'icon-empty',
            handler: function() {
                $.messager.confirm(self.parent.messages[initial]['common']['system_hint'], self.parent.messages[initial]['common']['if_clear_table'], function(r) {
                    if (r) {
                        var dir = self.parent.$('#text').textbox('getText'); // 选中的文件夹Name
                        sql = "DELETE FROM user_point";
                        result = truncatesql('Project/' + dir + '/Gateway', sql, 'VACUUM');
                        if (result == 'true') {
                            self.parent.insert_info(self.parent.messages[initial]['common']['clear_success']);
                            $("#user_xls_config").datagrid('reload');
                        } else {
                            sqlite_message(result, self.parent.messages[initial]['common']['system_hint']);
                            $("#user_xls_config").datagrid('reload');
                        }
                    }
                });
            }
        }]
    });

});