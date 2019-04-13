/**
 * Created by Administrator on 2017/9/14.
 */
function table_export() {
    var dir = self.parent.$('#text').textbox('getText'); // 选中的文件夹名称
    content = { 'AI': [], 'AO': [], 'AV': [], 'BI': [], 'BO': [], 'BV': [], 'MSI': [], 'MSO': [], 'MSV': [] }
        // BaCnet_values = content[parent2['text']]['BaCnet'];
    for (value in content) {
        if (value.indexOf('A') != -1) {
            sql = "select id,objectName,description,objectInstance,units from BaCnet_Service where objectType='{0}'".format(value);
        } else if (value.indexOf('B') != -1) {
            sql = "select id,objectName,description,objectInstance from BaCnet_Service where objectType='{0}'".format(value);
        } else if (value.indexOf('M') != -1) {
            sql = "select id,objectName,description,objectInstance,multistate from BaCnet_Service where objectType='{0}'".format(value);
        }
        BaCnet_Service_value = selectsql('Project/' + dir + '/Gateway', sql);
        content[value] = JSON.parse(BaCnet_Service_value);
        if (content[value].length == 0) {
            if (value.indexOf('A') != -1) {
                content[value] = [{ 'id': '', 'objectName': '', 'description': '', 'objectInstance': '', 'units': '' }]
            } else if (value.indexOf('B') != -1) {
                content[value] = [{ 'id': '', 'objectName': '', 'description': '', 'objectInstance': '' }]
            } else if (value.indexOf('M') != -1) {
                content[value] = [{ 'id': '', 'objectName': '', 'description': '', 'objectInstance': '', 'multistate': '' }]
            }
        }
    }
    json = JSON.stringify(content)
    jsontoexcel(json, 'BaCnet_Service_config.xls')
}

function data_save(content) {
    var dir = self.parent.$('#text').textbox('getText'); // 选中的文件夹Name
    result = bulk_insert('Project/' + dir + '/Gateway', JSON.stringify(content));
    if (result == "true") {
        $("#BaCnetA_xls_config").edatagrid('reload');
        $("#BaCnetB_xls_config").edatagrid('reload');
        $("#BaCnetM_xls_config").edatagrid('reload');
        self.parent.insert_info(self.parent.messages[initial]['common']['add_success']);
    } else {
        sqlite_message(result, self.parent.messages[initial]['common']['system_hint']);
    }
}

function Mtable_add(max, title_text) {
    content = { "BaCnet_Service": [] }
    data.forEach(function(tag) {
        max = parseInt(max) + 1;
        tag_value = {
            'id': tag[0],
            'objectName': '',
            'description': '',
            'objectInstance': max,
            'multistate': '[]',
            'objectType': title_text
        }
        content['BaCnet_Service'].push(tag_value);
    });
    return content;
}

window.onmessage = function(e) {
    var dir = self.parent.$('#text').textbox('getText'); // 选中的文件夹Name
    data = JSON.parse(e.data);
    if (data.length != 0) {
        sql = "select * from BaCnet_Service where objectType='{0}'".format(title_text);
        BaCnet_Service_value = selectsql('Project/' + dir + '/Gateway', sql);
        Instance_array = [];
        if (BaCnet_Service_value != '[]') { // 是否已有tag点
            value = JSON.parse(BaCnet_Service_value);
            value.forEach(function(tag) {
                Instance_array.push(parseInt(tag['objectInstance']));
            });
            var max = Math.max.apply(null, Instance_array);
        } else {
            var max = -1
        }
        if (['AI', 'AO', 'AV'].indexOf(title_text) != -1) {
            content = Atable_add(max, title_text); // 追加新行。新行将被添加到最后的位置。
        } else if (['BI', 'BO', 'BV'].indexOf(title_text) != -1) {
            content = Btable_add(max, title_text); // 追加新行。新行将被添加到最后的位置。
        } else if (['MSI', 'MSO', 'MSV'].indexOf(title_text) != -1) {
            content = Mtable_add(max, title_text); // 追加新行。新行将被添加到最后的位置。
        }
        data_save(content); // 保存到数据库当中
    }
};

function Mdisplay() {

    $("#BaCnetM_xls_config").edatagrid({
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
            a = JSON.parse(content)
                // a.forEach(function(tag) {
                //     tag['multistate'] = '["State1","State2"]'
                // })
                // console.log(a)
            return a
        },
        onBeginEdit: function(index, row) {
            var dangerousInfoTextbox = $('#BaCnetM_xls_config').datagrid('getEditor', { index: index, field: 'multistate' }).target;
            dangerousInfoTextbox.textbox('textbox').bind("click", function() {
                $('#multistate_dialog').dialog({
                    title: self.parent.messages[initial]['tag_tree']['select_point'],
                    closable: true,
                    draggable: false,
                    modal: true,
                    buttons: [{
                            text: self.parent.messages[initial]['common']['ok'],
                            iconCls: 'icon-new-project',
                            handler: function() {
                                current_multistate = [];
                                var Roots = $('#multistate_tree').tree('getRoots');
                                console.log(Roots)
                                if (Roots != null) {
                                    Roots.forEach(function(multistate) {
                                        // text = multistate['text'].substring(multistate['text'].indexOf("-") + 1)
                                        current_multistate.push(multistate['value']);
                                    })
                                };
                                row['multistate'] = JSON.stringify(current_multistate);
                                dangerousInfoTextbox.textbox('setValue', JSON.stringify(current_multistate));
                                $("#multistate_dialog").dialog('close');
                            }
                        },
                        {
                            text: self.parent.messages[initial]['common']['cancel'],
                            iconCls: 'icon-cancel',
                            handler: function() {
                                $("#multistate_dialog").dialog('close');
                            }
                        }
                    ]
                });
                multistate_object = JSON.parse(row['multistate']);
                data = [];
                i = 0;
                multistate_object.forEach(function(multistate) {
                    i += 1;
                    data.push({ "text": i + '-' + multistate, "value": multistate, "number": i, "iconCls": "icon-blank" })
                });
                $('#multistate_tree').tree({
                    data: data,
                    lines: true,
                    onClick: function(node) {
                        $('#number').textbox('setValue', node['number']);
                        $('#mtext').textbox('setValue', node['value']);
                    }
                });
                $('#number').textbox('setValue', '');
                $('#mtext').textbox('setValue', '');
                $("#multistate_dialog").dialog('open'); //必须先显示，再弹出
            })
        },
        onDestroy: function(index, row) {
            var dir = self.parent.$('#text').textbox('getText'); // 选中的文件夹Name
            sql = "delete from BaCnet_Service where id='{0}' and objectType='{1}'".format(row['id'], title_text);
            result = deletesql('Project/' + dir + '/Gateway', sql)
            if (result == 'true') {
                self.parent.insert_info(self.parent.messages[initial]['common']['successfully_deleted'])
            } else {
                sqlite_message(result, self.parent.messages[initial]['common']['system_hint']);
                $("#BaCnetM_xls_config").datagrid('reload');
            }
        },
        // onLoadSuccess: function(data) {
        //     var panel = $(this).datagrid('getPanel');
        //     var tr = panel.find('div.datagrid-body tr');
        //     tr.each(function() {
        //         var td = $(this).children('td[field="multistate"]');
        //         td.children("div").css({
        //             //"text-align": "right" 
        //             "height": "80px"
        //         });
        //     });
        // },
        rowStyler: function() {　　
            return 'height: 80px';
        },
        //保存后执行
        onEndEdit: function(index, row, changs) {
            var old_data = $('#BaCnetM_xls_config').datagrid('getEditor', { index: index, field: "id" });
            var dir = self.parent.$('#text').textbox('getText'); // 选中的文件夹Name
            if (old_data.oldHtml) { // 判断是否是更新数据
                sql = "update  BaCnet_Service set id='{0}',objectName='{1}',description='{2}',objectInstance={3},multistate='{4}' where id='{5}' and objectType='{6}'".format(row['id'], row['objectName'], row['description'], row['objectInstance'], row['multistate'], old_data['oldHtml'], title_text);
            }
            result = insertsql('Project/' + dir + '/Gateway', sql)
            if (result == 'true') {
                self.parent.insert_info(self.parent.messages[initial]['common']['Saved_successfully'])
            } else {
                sqlite_message(result, self.parent.messages[initial]['common']['system_hint']);
                $("#BaCnetM_xls_config").datagrid('reload');
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
                },
                {
                    field: 'multistate',
                    title: self.parent.messages[initial]['bacnet_service']['multistate'],
                    width: 100,
                    align: 'center',
                    editor: {
                        type: 'textbox',
                        options: {
                            editable: false
                        }
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
                    $('#BaCnetM_xls_config').edatagrid('saveRow');
                }
            },
            '-', {
                text: self.parent.messages[initial]['common']['redo'],
                iconCls: 'icon-redo',
                handler: function() {
                    $('#BaCnetM_xls_config').edatagrid('cancelRow');
                }
            }, '-', {
                text: self.parent.messages[initial]['common']['remove'],
                iconCls: 'icon-remove',
                handler: function() {
                    //var selRow = $('#BaCnetM_xls_config').edatagrid('getSelections')
                    //console.log(selRow.length)
                    $("#BaCnetM_xls_config").edatagrid('destroyRow');
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
                                $("#BaCnetM_xls_config").datagrid('reload');
                            } else {
                                sqlite_message(result, self.parent.messages[initial]['common']['system_hint']);
                                $("#BaCnetM_xls_config").datagrid('reload');
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