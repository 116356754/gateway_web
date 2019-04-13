/**
 * Created by Administrator on 2017/9/14.
 */
function Btable_add(max, title_text) {
    content = { "BaCnet_Service": [] }
    data.forEach(function(tag) {
        max = parseInt(max) + 1;
        tag_value = {
            'id': tag[0],
            'objectName': '',
            'description': '',
            'objectInstance': max,
            'objectType': title_text
        }
        content['BaCnet_Service'].push(tag_value);
    });
    return content;
}

function Bdisplay() {

    // var title_text = "AI";
    // $('#tabs').tabs({
    //     onSelect: function(title, index) {
    //         title_text = title;
    //         console.log($('BaCnetB_xls_config').datagrid('getColumnOption', 'units'))
    //         $('#BaCnetB_xls_config').edatagrid('reload');
    //     }
    // });

    $("#BaCnetB_xls_config").edatagrid({
        url: '../static/json/treegrid_data1.json',
        fitColumns: true,
        striped: true,
        remoteSort: false,
        //singleSelect: false, //允许选择多行
        //selectOnCheck: true,//true勾选会选择行，false勾选不选择行, 1.3以后有此选项。重点在这里
        //checkOnSelect: true, //true选择行勾选，false选择行不勾选, 1.3以后有此选项
        rownumbers: true,
        loadFilter: function(data, parentId) {
            var dir = self.parent.$('#text').textbox('getText'); // 选中的文件夹Name
            path = 'Project/' + dir + '/Gateway';
            content = selectsql(path, "select * from BaCnet_Service where objectType='{0}'".format(title_text));
            return JSON.parse(content)
        },
        onDestroy: function(index, row) {
            var dir = self.parent.$('#text').textbox('getText'); // 选中的文件夹Name
            sql = "delete from BaCnet_Service where id='{0}' and objectType='{1}'".format(row['id'], title_text);
            result = deletesql('Project/' + dir + '/Gateway', sql)
            if (result == 'true') {
                self.parent.insert_info(self.parent.messages[initial]['common']['successfully_deleted'])
            } else {
                sqlite_message(result, self.parent.messages[initial]['common']['system_hint']);
                $("#BaCnetB_xls_config").datagrid('reload');
            }
        },
        //保存后执行
        onEndEdit: function(index, row, changs) {
            var old_data = $('#BaCnetB_xls_config').datagrid('getEditor', { index: index, field: "id" });
            var dir = self.parent.$('#text').textbox('getText'); // 选中的文件夹Name
            if (old_data.oldHtml) { // 判断是否是更新数据
                sql = "update  BaCnet_Service set id='{0}',objectName='{1}',description='{2}',objectInstance={3},units={4} where id='{5}' and objectType='{6}'".format(row['id'], row['objectName'], row['description'], row['objectInstance'], row['units'], old_data['oldHtml'], title_text);
            }
            result = insertsql('Project/' + dir + '/Gateway', sql)
            if (result == 'true') {
                self.parent.insert_info(self.parent.messages[initial]['common']['Saved_successfully'])
            } else {
                sqlite_message(result, self.parent.messages[initial]['common']['system_hint']);
                $("#BaCnetB_xls_config").datagrid('reload');
            }
        },
        idField: 'id',
        columns: [
            [
                //{
                //    field: 'ck',
                //    checkbox: true
                //},
                {
                    field: 'id',
                    title: self.parent.messages[initial]['common']['name'],
                    width: 100,
                    align: 'center',
                    editor: {
                        type: 'textbox',
                        options: {
                            required: true,
                            editable: false
                        }
                    }
                }, {
                    field: 'objectName',
                    title: self.parent.messages[initial]['bacnet_service']['objectName'],
                    width: 100,
                    align: 'center',
                    editor: {
                        type: 'textbox'
                    }
                }, {
                    field: 'description',
                    title: self.parent.messages[initial]['bacnet_service']['description'],
                    width: 100,
                    align: 'center',
                    editor: {
                        type: 'textbox'
                    }
                },
                {
                    field: 'objectInstance',
                    title: self.parent.messages[initial]['bacnet_service']['objectInstance'],
                    width: 100,
                    align: 'center',
                    editor: {
                        type: 'numberbox',
                        options: {
                            required: true
                        }
                    },
                    sortable: true,
                    sorter: function(a, b) {
                        return (parseFloat(a) > parseFloat(b) ? 1 : -1);

                    }
                }

            ]
        ],
        toolbar: [{
                text: self.parent.messages[initial]['common']['add'],
                iconCls: 'icon-add',
                handler: function() {
                    self.parent.display_tag('BaCnet_Service', null, true)
                }
            },
            '-',
            {
                text: self.parent.messages[initial]['common']['save'],
                iconCls: 'icon-save',
                handler: function() {
                    $('#BaCnetB_xls_config').edatagrid('saveRow');
                }
            },
            '-', {
                text: self.parent.messages[initial]['common']['redo'],
                iconCls: 'icon-redo',
                handler: function() {
                    $('#BaCnetB_xls_config').edatagrid('cancelRow');
                }
            }, '-', {
                text: self.parent.messages[initial]['common']['remove'],
                iconCls: 'icon-remove',
                handler: function() {
                    //var selRow = $('#BaCnetB_xls_config').edatagrid('getSelections')
                    //console.log(selRow.length)
                    $("#BaCnetB_xls_config").edatagrid('destroyRow');
                }
            }, '-', {
                text: self.parent.messages[initial]['index']['Empty'],
                iconCls: 'icon-empty',
                handler: function() {
                    $.messager.confirm(self.parent.messages[initial]['common']['system_hint'], self.parent.messages[initial]['common']['if_clear_table'], function(r) {
                        if (r) {
                            var dir = self.parent.$('#text').textbox('getText'); // 选中的文件夹Name
                            sql = "DELETE FROM BaCnet_Service where objectType='{0}'".format(title_text);
                            result = deletesql('Project/' + dir + '/Gateway', sql);
                            if (result == 'true') {
                                self.parent.insert_info(self.parent.messages[initial]['common']['clear_success']);
                                $("#BaCnetB_xls_config").datagrid('reload');
                            } else {
                                sqlite_message(result, self.parent.messages[initial]['common']['system_hint']);
                                $("#BaCnetB_xls_config").datagrid('reload');
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
            }
        ]
    });
};