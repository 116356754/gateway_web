/**
 * Created by Administrator on 2017/9/14.
 */
function downFile(url) {
    try {
        var elemIF = document.createElement('iframe');
        elemIF.src = url;
        elemIF.style.display = "none";
        document.body.appendChild(elemIF);
    } catch (e) {}
}

// 判断元素是否在数组中
function in_array(stringToSearch, arrayToSearch) {
    for (s = 0; s < arrayToSearch.length; s++) {
        thisEntry = arrayToSearch[s].toString();
        if (thisEntry == stringToSearch) {
            return true;
        }
    }
    return false;
}

function get_data(data) {
    var path = new Array();
    for (var a = 0; a < data.length; a++) {
        var tree_path = new Array();
        if (data[a].children) {
            tree_path.push(data[a].text);
            for (var b = 0; b < data[a].children.length; b++) {
                if (data[a].children[b].children) {
                    var task_path = tree_path.slice(0); // 复制tree_path
                    task_path.push(data[a].children[b].text);
                    for (var c = 0; c < data[a].children[b].children.length; c++) {
                        if (data[a].children[b].children[c].task) {
                            var all_path = task_path.slice(0); // 复制tree_path
                            all_path.push(data[a].children[b].children[c].text);
                            all_path.push(data[a].children[b].children[c].task);
                            path.push(all_path)
                        }
                    }
                }
            }
        }
    }
    return path
}

function data_save() {
    var dir = self.parent.$('#text').textbox('getText'); // 选中的文件夹名称
    var value = $("#cj_188_reverse_config").edatagrid('getRows');
    server_task_path = 'Project/' + dir + '/server_task.json';
    server_task_content = readFileSync(server_task_path);
    content = JSON.parse(server_task_content);
    var select = self.parent.$('#tt').tree('getSelected');
    var parent1 = self.parent.$('#tt').tree('getParent', select.target);
    var parent2 = self.parent.$('#tt').tree('getParent', parent1.target);
    content[parent2['text']]['cj_188_reverse'] = value;
    wirte_localfile(server_task_path, JSON.stringify(content))
}

function empty(tag_type) {
    if (tag_type == 'AI') {
        return '299999'
    }
    if (tag_type == 'AO') {
        return '399999'
    }
    if (tag_type == 'DI') {
        return '100000'
    }
    if (tag_type == 'DO') {
        return '0'
    }
}

window.onmessage = function(e) {
    data = JSON.parse(e.data);
    if (data.length != 0) {
        data.forEach(function(tag) {
            $("#cj_188_reverse_config").edatagrid('appendRow', {
                'id': tag[0],
                '水表表号': '',
                '厂商代码': '',
                '数据项名称': '',
                '异常默认值': '9999'
            });
        });
        data_save();
        self.parent.insert_info('添加成功')
    }
};

$(function() {
    $("#cj_188_reverse_config").edatagrid({
        url: '../static/json/treegrid_data1.json',
        fitColumns: true,
        striped: true,
        rownumbers: true,
        loadFilter: function(data, parentId) {
            var dir = self.parent.$('#text').textbox('getText'); // 选中的文件夹名称
            var treepath_array = get_treepath(dir);
            content = readFileSync(treepath_array[2]);
            value = JSON.parse(content);
            var select = self.parent.$('#tt').tree('getSelected');
            var parent1 = self.parent.$('#tt').tree('getParent', select.target);
            var parent2 = self.parent.$('#tt').tree('getParent', parent1.target);
            all_values = value[parent2['text']]['cj_188_reverse'];
            return all_values
        },
        onDestroy: function(index, data) {
            data_save()
            self.parent.insert_info('删除成功')
        },
        //保存后执行
        onAfterEdit: function(rowIndex, rowData, changs) {
            data_save()
            self.parent.insert_info('保存成功')
        },
        // 禁用编辑
        //onBeginEdit: function(index, row) {
        //    $("#cj_188_reverse_config").datagrid('cancelEdit', index);
        //},
        idField: 'id',
        columns: [
            [{
                    field: 'id',
                    title: 'ID',
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
                    field: '水表表号',
                    title: '水表表号',
                    width: 100,
                    align: 'center',
                    editor: {
                        type: 'numberbox',
                        options: {
                            required: true,
                            validType: "eqmaxLength[10]"
                        }
                    }
                },
                {
                    field: '厂商代码',
                    title: '厂商代码',
                    width: 100,
                    align: 'center',
                    editor: {
                        type: 'textbox',
                        options: {
                            required: true,
                            validType: "eq_letter_Length[4]"
                        }
                    }
                },
                {
                    field: '数据项名称',
                    title: '数据项名称',
                    width: 100,
                    align: 'center',
                    editor: {
                        type: 'combobox',
                        options: {
                            panelHeight: 'auto',
                            method: 'get',
                            url: "../static/json/cj_188.json",
                            editable: false,
                            valueField: "text",
                            textField: "text",
                            editable: false
                        }
                    }
                },
                {
                    field: '异常默认值',
                    title: '异常默认值',
                    width: 100,
                    align: 'center',
                    editor: {
                        type: 'textbox',
                        options: {
                            required: true,
                            editable: false
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
             var row = $('#cj_188_reverse_config').edatagrid('getRows').length;
             if (row) {
             var idvalue = $('#cj_188_reverse_config').edatagrid('getData').rows[row - 1].id;
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
             $('#cj_188_reverse_config').edatagrid('addRow', {
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
                    self.parent.display_tag('cj_188_reverse', null, true)
                }
            },
            '-',
            {
                text: '保存',
                iconCls: 'icon-save',
                handler: function() {
                    $('#cj_188_reverse_config').edatagrid('saveRow');
                }
            },
            '-', {
                text: '撤销',
                iconCls: 'icon-redo',
                handler: function() {
                    $('#cj_188_reverse_config').edatagrid('cancelRow');
                }
            }, '-', {
                text: '删除',
                iconCls: 'icon-remove',
                handler: function() {
                    $("#cj_188_reverse_config").edatagrid('destroyRow');
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
                            sql = "DELETE FROM cj_188_reverse";
                            result = truncatesql('Project/' + dir + '/' + parent2.text, sql, 'VACUUM');
                            if (result == 'true') {
                                self.parent.insert_info('清空成功');
                                $("#cj_188_reverse_config").datagrid('reload');
                            } else {
                                sqlite_message(result, self.parent.messages[initial]['common']['system_hint']);
                                $("#cj_188_reverse_config").datagrid('reload');
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
            //        $("#cj_188_reverse_config").edatagrid('reload');
            //    }
            //}
            // , '-', {
            //     text: '导入配置',
            //     iconCls: 'icon-excel',
            //     handler: function() {
            //         $("#msvex").dialog()
            //     }
            // }
            // , '-', {
            //     text: '导出配置',
            //     iconCls: 'icon-excel',
            //     handler: function() {
            //         downFile('/cj_188_reverse/modsvexcelexport')
            //     }
            // }
        ]
    });
    //$('#dlt_modbus_type').switchbutton("options").checked;
});