/**
 * Created by Administrator on 2017/9/14.
 */
$(function() {
    $("#system_xls_config").edatagrid({
        url: '../static/json/treegrid_data1.json',
        fitColumns: true,
        striped: true,
        rownumbers: true,
        loadFilter: function(data, parentId) {
            var dir = self.parent.$('#text').textbox('getText'); // 选中的文件夹名称
            path = 'Project/' + dir + '/Gateway';
            content1 = JSON.parse(selectsql(path, "select * from system_point"));
            content2 = JSON.parse(selectsql(path, "select * from DEVICE_STATUS_VIEW"));
            return content1.concat(content2);
        },
        onDestroy: function(index, data) {
            data_save();
            self.parent.insert_info('删除成功')
        },
        // 禁用编辑
        //onBeginEdit: function(index, row) {
        //    $("#system_xls_config").datagrid('cancelEdit', index);
        //},
        //保存后执行
        onAfterEdit: function(rowIndex, rowData, changs) {
            var value = $("#system_xls_config").edatagrid('getRows');
            var select = self.parent.$('#tt').tree('getSelected');
            select.task = value;
            self.parent.insert_info('保存成功')
        },
        onDblClickRow: function(index, row) {
            $("#system_xls_config").datagrid('cancelEdit', index); // 取消编辑
        },
        idField: 'id',
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
                }
            ]
        ]
    });
});