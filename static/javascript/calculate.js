/**
 * Created by Administrator on 2017/9/14.
 */
function newtag_dialog(type, old_name) {
    $('#add').dialog({
        closable: false,
        draggable: false,
        modal: true,
        buttons: [{
                text: self.parent.messages[initial]['common']['ok'],
                iconCls: 'icon-ok',
                handler: function() {
                    add_new(type, old_name)
                }
            },
            {
                text: self.parent.messages[initial]['common']['cancel'],
                iconCls: 'icon-cancel',
                handler: function() {
                    $("#add").dialog('close');
                }
            }
        ]
    });
    $("#add").dialog('open'); //必须先显示，再弹出
}

// 添加新点
function add_new(type, old_name) {
    var dir = self.parent.$('#text').textbox('getText'); // 选中的文件夹名称
    tagCode = $('#new_id').textbox('getText');
    description = $('#new_name').textbox('getText');
    // cycle = $('#new_cycle').textbox('getText');
    expression = document.getElementById("expression").value;
    expression = expression.replace('A', '[A]');
    expression = expression.replace('B', '[B]');
    expression = expression.replace('C', '[C]');
    expression = expression.replace('D', '[D]');
    A = $('#A').textbox('getText');
    B = $('#B').textbox('getText');
    C = $('#C').textbox('getText');
    D = $('#D').textbox('getText');
    var sql = '';
    if (type == 'add') {
        sql = "insert into calculate values ('{0}','{1}',nullif('{2}',''),nullif('{3}',''),nullif('{4}',''),nullif('{5}',''),nullif('{6}',''),nullif('{7}',''),'AI')".format('calculate', tagCode, description, A, B, C, D, expression)
    } else {
        sql = "update calculate set deviceCode='{0}',tagCode='{1}',description=nullif('{2}',''),A=nullif('{3}',''),B=nullif('{4}',''),C=nullif('{5}',''),D=nullif('{6}',''),expression=nullif('{7}','') where tagCode='{8}'".format('calculate', tagCode, description, A, B, C, D, expression, old_name);
    }
    result = insertsql('Project/' + dir + '/Gateway', sql)
    if (result == 'true') {
        $("#add").dialog('close');
        $("#calculate_xls_config").datagrid('reload');
        self.parent.insert_info(self.parent.messages[initial]['common']['Saved_successfully'])
    } else {
        console.log(result)
        if (result.indexOf('NOT NULL') != -1) {
            $.messager.alert(self.parent.messages[initial]['common']['system_hint'], self.parent.messages[initial]['calculate']['not_null'], "info")
        } else if (result.indexOf('UNIQUE') != -1) {
            $.messager.alert(self.parent.messages[initial]['common']['system_hint'], self.parent.messages[initial]['common']['duplicate_name'], "info")
        } else {
            $.messager.alert(self.parent.messages[initial]['common']['system_hint'], result, "info")
        }
        $("#calculate_xls_config").datagrid('reload');
    }
}

$(function() {
    var q = 0;
    $("#calculate_xls_config").edatagrid({
        url: '../static/json/treegrid_data1.json',
        fitColumns: true,
        striped: true,
        rownumbers: true,
        loadFilter: function(data, parentId) {
            var dir = self.parent.$('#text').textbox('getText'); // 选中的文件夹名称
            path = 'Project/' + dir + '/Gateway';
            content = JSON.parse(selectsql(path, "select * from calculate"));
            content.forEach(function(tag) {
                tag['expression'] = tag['expression'].replace('[A]', 'A');
                tag['expression'] = tag['expression'].replace('[B]', 'B');
                tag['expression'] = tag['expression'].replace('[C]', 'C');
                tag['expression'] = tag['expression'].replace('[D]', 'D');
            })
            return content;
        },
        onDestroy: function(index, row) {
            var dir = self.parent.$('#text').textbox('getText'); // 选中的文件夹名称
            sql = "delete from calculate where tagCode='{0}'".format(row['tagCode']);
            result = deletesql('Project/' + dir + '/Gateway', sql)
            if (result == 'true') {
                self.parent.insert_info(self.parent.messages[initial]['common']['successfully_deleted'])
            } else {
                sqlite_message(result, self.parent.messages[initial]['common']['system_hint']);
                $("#calculate_xls_config").datagrid('reload');
            }
        },
        onDblClickRow: function(index, row) {
            data = $("#calculate_xls_config").datagrid('getSelected');
            newtag_dialog('modify', row['tagCode']);
            $('#new_id').textbox('setText', data.tagCode);
            $('#new_name').textbox('setText', data.description);
            // $('#new_cycle').textbox('setText', data.周期);
            document.getElementById("expression").value = data.expression;
            $('#A').textbox('setText', data.A);
            $('#B').textbox('setText', data.B);
            $('#C').textbox('setText', data.C);
            $('#D').textbox('setText', data.D);
            $("#calculate_xls_config").datagrid('cancelEdit', index); // 取消编辑
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
                        type: 'textbox'
                    }
                },
                {
                    field: 'A',
                    title: 'A',
                    width: 100,
                    align: 'center',
                    editor: {
                        type: 'textbox'
                    }
                },
                {
                    field: 'B',
                    title: 'B',
                    width: 100,
                    align: 'center',
                    editor: {
                        type: 'textbox'
                    }
                },
                {
                    field: 'C',
                    title: 'C',
                    width: 100,
                    align: 'center',
                    editor: {
                        type: 'textbox'
                    }
                },
                {
                    field: 'D',
                    title: 'D',
                    width: 100,
                    align: 'center',
                    editor: {
                        type: 'textbox'
                    }
                },
                {
                    field: 'expression',
                    title: self.parent.messages[initial]['calculate']['expression'],
                    width: 100,
                    align: 'center',
                    editor: {
                        type: 'textbox',
                        options: {
                            required: true
                                //validType: "eqmaxLength[12]",
                        }
                    }
                }
            ]
        ],
        toolbar: [{
            text: self.parent.messages[initial]['common']['add'],
            iconCls: 'icon-add',
            handler: function() {
                var dir = self.parent.$('#text').textbox('getText'); // 选中的文件夹名称
                var path = 'Project/' + dir + '/Gateway';
                var sql = "select tagCode from calculate where tagCode LIKE'tag%'"
                value = selectsql(path, sql);
                tagCode = create_name(value);
                $('#new_id').textbox('setText', tagCode);
                newtag_dialog('add', 'null')
            }
        }, '-', {
            text: self.parent.messages[initial]['common']['save'],
            iconCls: 'icon-save',
            handler: function() {
                $('#calculate_xls_config').edatagrid('saveRow');
            }
        }, '-', {
            text: self.parent.messages[initial]['common']['redo'],
            iconCls: 'icon-redo',
            handler: function() {
                $('#calculate_xls_config').edatagrid('cancelRow');
            }
        }, '-', {
            text: self.parent.messages[initial]['common']['remove'],
            iconCls: 'icon-remove',
            handler: function() {
                $("#calculate_xls_config").edatagrid('destroyRow');
            }
        }, '-', {
            text: self.parent.messages[initial]['index']['Empty'],
            iconCls: 'icon-empty',
            handler: function() {
                $.messager.confirm(self.parent.messages[initial]['common']['system_hint'], self.parent.messages[initial]['common']['if_clear_table'], function(r) {
                    if (r) {
                        var dir = self.parent.$('#text').textbox('getText'); // 选中的文件夹Name
                        sql = "DELETE FROM calculate";
                        result = truncatesql('Project/' + dir + '/Gateway', sql, 'VACUUM');
                        if (result == 'true') {
                            self.parent.insert_info(self.parent.messages[initial]['common']['clear_success']);
                            $("#calculate_xls_config").datagrid('reload');
                        } else {
                            sqlite_message(result, self.parent.messages[initial]['common']['system_hint']);
                            $("#calculate_xls_config").datagrid('reload');
                        }
                    }
                });
            }
        }]
    });
});