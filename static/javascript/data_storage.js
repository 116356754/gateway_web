/**
 * Created by Administrator on 2017/9/14.
 */
function data_save(data) {
    var dir = self.parent.$('#text').textbox('getText'); // 选中的文件夹名称
    content = { "data_storage": [] }
    data.forEach(function(tag) {
        content['data_storage'].push({ "id": tag[0] })
    });
    result = bulk_insert('Project/' + dir + '/Gateway', JSON.stringify(content));
    if (result == "true") {
        $("#storage_xls_config").edatagrid('reload');
        self.parent.insert_info(self.parent.messages[initial]['common']['add_success']);
    } else {
        sqlite_message(result, self.parent.messages[initial]['common']['system_hint']);
    }
}

var add_button = '';
window.onmessage = function(e) {
    if (add_button == 'add') {
        data = JSON.parse(e.data);
        if (data.length != 0) {
            data_save(data);
        }
    } else if (add_button == 'textbox') {
        data = JSON.parse(e.data);
        $('#tag_id').textbox('setText', data[0])
    }
};

$(function() {
    $('#tag_id').textbox({
        onClickButton: function() {
            add_button = 'textbox';
            self.parent.display_tag('data_storage', null, true)
        }
    });

    $("#storage_xls_config").edatagrid({
        url: '../static/json/treegrid_data1.json',
        fitColumns: true,
        striped: true,
        rownumbers: true,
        loadFilter: function(data, parentId) {
            var dir = self.parent.$('#text').textbox('getText'); // 选中的文件夹名称
            path = 'Project/' + dir + '/Gateway';
            content = selectsql(path, "select * from data_storage");
            return JSON.parse(content)
        },
        onDestroy: function(index, row) {
            var dir = self.parent.$('#text').textbox('getText'); // 选中的文件夹名称
            sql = "delete from data_storage where id='{0}'".format(row['id']);
            result = deletesql('Project/' + dir + '/Gateway', sql)
            if (result == 'true') {
                self.parent.insert_info(self.parent.messages[initial]['common']['successfully_deleted'])
            } else {
                sqlite_message(result, self.parent.messages[initial]['common']['system_hint']);
                $("#storage_xls_config").datagrid('reload');
            }
        },
        //禁用编辑
        onBeginEdit: function(index, row) {
            $('#storage_xls_config').datagrid('cancelEdit', index);
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
                        validType: "maxLength[15]"
                    }
                }
            }]
        ],
        toolbar: [{
                text: self.parent.messages[initial]['common']['add'],
                iconCls: 'icon-add',
                handler: function() {
                    add_button = 'add';
                    self.parent.display_tag('data_storage', null, true)
                }
            }, '-', {
                text: self.parent.messages[initial]['common']['remove'],
                iconCls: 'icon-remove',
                handler: function() {
                    $("#storage_xls_config").edatagrid('destroyRow');
                }
            }, '-', {
                text: self.parent.messages[initial]['index']['Empty'],
                iconCls: 'icon-empty',
                handler: function() {
                    $.messager.confirm(self.parent.messages[initial]['common']['system_hint'], self.parent.messages[initial]['common']['if_clear_table'], function(r) {
                        if (r) {
                            var dir = self.parent.$('#text').textbox('getText'); // 选中的文件夹名称
                            sql = "DELETE FROM data_storage";
                            result = truncatesql('Project/' + dir + '/Gateway', sql, 'VACUUM');
                            if (result == 'true') {
                                self.parent.insert_info(self.parent.messages[initial]['common']['clear_success']);
                                $("#storage_xls_config").datagrid('reload');
                            } else {
                                sqlite_message(result, self.parent.messages[initial]['common']['system_hint']);
                                $("#storage_xls_config").datagrid('reload');
                            }
                        }
                    });

                }
            }
            //, '-', {
            //    text: '导入配置',
            //    iconCls: 'icon-excel',
            //    handler: function() {
            //        $("#mrx").dialog()
            //    }
            //}, '-', {
            //    text: '导出配置',
            //    iconCls: 'icon-excel',
            //    handler: function() {
            //        table_export()
            //    }
            //}
            //    ,
            //    {
            //    text: '输入框3<input type="file" id="username"/>'
            //}
        ]
    });

});