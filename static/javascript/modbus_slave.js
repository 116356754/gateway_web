/**
 * Created by Administrator on 2017/9/14.
 */
function table_export() {
    var sql = "select * from Modbus_Service";
    var dir = self.parent.$('#text').textbox('getText'); // 选中的文件夹Name
    path = 'Project/' + dir + '/Gateway';
    content = selectsql(path, sql);
    value = JSON.parse(content);
    if (value.length == 0) {
        value = [{ 'id': '', 'pointType': '', 'address': '', 'dataType': '', 'sort': '', 'exceptionDefault': '' }]
    }
    json = JSON.stringify({ 'Modbus_Service': value })
    jsontoexcel(json, 'modbus_slave_config.xls')
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

function data_save(content) {
    var dir = self.parent.$('#text').textbox('getText'); // 选中的文件夹Name
    result = bulk_insert('Project/' + dir + '/Gateway', JSON.stringify(content));
    if (result == "true") {
        $("#modsv_xls_config").edatagrid('reload');
        self.parent.insert_info(self.parent.messages[initial]['common']['add_success']);
    } else {
        sqlite_message(result, self.parent.messages[initial]['common']['system_hint']);
    }
}

function create_modbusaddr(person) {
    if (person['pointType'] == '0X (Coil Status)') {
        addr_length = person['address'].length;
        person['modbusAddress'] = person['address'];
        for (var i = 0; i < 6 - addr_length; i++) {
            person['modbusAddress'] = '0' + person['modbusAddress']
        }
        person['dataType'] = 'bool'
    }
    if (person['pointType'] == '1X (Input Status)') {
        addr_length = person['address'].length;
        person['modbusAddress'] = person['address'];
        for (var i = 0; i < 6 - addr_length - 1; i++) {
            person['modbusAddress'] = '0' + person['modbusAddress']
        }
        person['modbusAddress'] = '1' + person['modbusAddress']
        person['dataType'] = 'bool'
    }
    if (person['pointType'] == '4X (Holding Register)') {
        addr_length = person['address'].length;
        person['modbusAddress'] = person['address'];
        if (person['address'].indexOf('.') != -1) {
            for (var i = 0; i < 9 - addr_length - 1; i++) {
                person['modbusAddress'] = '0' + person['modbusAddress']
            }
        } else {
            for (var i = 0; i < 6 - addr_length - 1; i++) {
                person['modbusAddress'] = '0' + person['modbusAddress']
            }
        }
        person['modbusAddress'] = '4' + person['modbusAddress']
        if (person['dataType'] == 'bool') {
            person['dataType'] = 'float cd ab'
        }
    }
    if (person['pointType'] == '3X (Input Registers)') {
        addr_length = person['address'].length;
        person['modbusAddress'] = person['address'];
        if (person['address'].indexOf('.') != -1) {
            for (var i = 0; i < 9 - addr_length - 1; i++) {
                person['modbusAddress'] = '0' + person['modbusAddress']
            }
        } else {
            for (var i = 0; i < 6 - addr_length - 1; i++) {
                person['modbusAddress'] = '0' + person['modbusAddress']
            }
        }
        person['modbusAddress'] = '3' + person['modbusAddress']
        if (person['dataType'] == 'bool') {
            person['dataType'] = 'float cd ab'
        }
    }
    return person;
}


function table_add(max, tag_type, modbustype, modbussort, max_type) {
    var two = false;
    var four = false;
    content = { "Modbus_Service": [] };
    if (['4X (Holding Register)', '3X (Input Registers)'].indexOf(tag_type) != -1 && modbustype == 'bool') {
        modbustype = 'float';
        modbussort = 'Little-endian byte swap';
    };
    if (['uint32', 'int32', 'float'].indexOf(max_type) != -1) {
        max += 1;
        two = true;
    };
    if (['double', 'uint64', 'int64'].indexOf(max_type) != -1) {
        max += 3;
        four = true;
    };
    if (['int16', 'uint16'].indexOf(modbustype) != -1) {
        modbussort = 'Null';
    };
    if (['int16', 'uint16', 'bool'].indexOf(modbustype) != -1 || ['0X (Coil Status)', '1X (Input Status)'].indexOf(tag_type) != -1) {
        data.forEach(function(tag) {
            max += 1;
            if (['0X (Coil Status)', '1X (Input Status)'].indexOf(tag_type) != -1) {
                modbustype = 'bool';
                modbussort = 'Null';
            }
            if (max == 0) {
                max += 1
            }
            tag_value = {
                'id': tag[0],
                'pointType': tag_type,
                'address': max.toString(),
                'dataType': modbustype,
                'sort': modbussort,
                'exceptionDefault': '9999'
            }
            tag_value = create_modbusaddr(tag_value)
            content['Modbus_Service'].push(tag_value)
        });
    } else {
        if (two) {
            max -= 1;
            two = false;
        } else if (four) {
            max -= 3;
            four = false;
        }

        if (['double', 'uint64', 'int64'].indexOf(modbustype) != -1) {
            if (max == -1) {
                max = -3
            }
            data.forEach(function(tag) {
                max += 4;
                tag_value = {
                    'id': tag[0],
                    'pointType': tag_type,
                    'address': max.toString(),
                    'dataType': modbustype,
                    'sort': modbussort,
                    'exceptionDefault': '9999'
                }
                tag_value = create_modbusaddr(tag_value)
                content['Modbus_Service'].push(tag_value)
            });
        } else {
            data.forEach(function(tag) {
                max += 2;
                tag_value = {
                    'id': tag[0],
                    'pointType': tag_type,
                    'address': max.toString(),
                    'dataType': modbustype,
                    'sort': modbussort,
                    'exceptionDefault': '9999'
                }
                tag_value = create_modbusaddr(tag_value)
                content['Modbus_Service'].push(tag_value)
            });
        }
    }
    return content;
}

window.onmessage = function(e) {
    var dir = self.parent.$('#text').textbox('getText'); // 选中的文件夹Name
    var tag_type = self.parent.$('#tag_type').combobox('getText');
    var modbustype = self.parent.$('#modbustype').combobox('getText');
    var modbussort = self.parent.$('#modbussort').combobox('getText');
    data = JSON.parse(e.data);
    if (data.length != 0) {
        modbusid_array = [-1];
        sql = "select * from Modbus_Service";
        modbus_slave_value = selectsql('Project/' + dir + '/Gateway', sql)
        if (modbus_slave_value != '[]') { // 是否已有tag点
            value = JSON.parse(modbus_slave_value);
            value.forEach(function(tag) {
                modbusid_array.push(parseInt(tag['address']));
            });
            var max = Math.max.apply(null, modbusid_array);
            sql = "select dataType from Modbus_Service where address='{0}'".format(max.toString());
            type_value = selectsql('Project/' + dir + '/Gateway', sql)
            type_value_object = JSON.parse(type_value);
            var max_type = type_value_object[0]['dataType']
                // for (var q = 0; q < value[parent2['text']]['Modbus_Service'].length; q++) {
                //     if (value[parent2['text']]['Modbus_Service'][q].pointType == tag_type) {
                //         addr = parseInt(value[parent2['text']]['Modbus_Service'][q].address);
                //         modbusid_array.push(addr);
                //     }
                // }
                // var max = Math.max.apply(null, modbusid_array);
                // for (var q = 0; q < value[parent2['text']]['Modbus_Service'].length; q++) {
                //     if (value[parent2['text']]['Modbus_Service'][q].pointType == tag_type) {
                //         if (max = parseInt(value[parent2['text']]['Modbus_Service'][q].address)) {
                //             var max_type = value[parent2['text']]['Modbus_Service'][q].dataType
                //         }
                //     }
                // }

        } else {
            var max = -1
        }
        content = table_add(max, tag_type, modbustype, modbussort, max_type); // 追加新行。新行将被添加到最后的位置。
        data_save(content); // 保存到数据库当中
    }
};

$(function() {
    $('#dlt_modbus_type').switchbutton({
        onChange: function(checked) {
            if (checked == true) {
                $('#dlt_modbus_comm').combobox({
                    disabled: true
                });
                return;
            }
            if (checked == false) {
                $('#dlt_modbus_comm').combobox({
                    disabled: false
                });
            }
        }
    });

    var q = 0;
    $("#modsv_xls_config").edatagrid({
        //url: ' file:////' + task_path,
        url: '../static/json/treegrid_data1.json',
        fitColumns: true,
        striped: true,
        remoteSort: false,
        //singleSelect: false, //允许选择多行
        //selectOnCheck: true,//true勾选会选择行，false勾选不选择行, 1.3以后有此选项。重点在这里
        //checkOnSelect: true, //true选择行勾选，false选择行不勾选, 1.3以后有此选项
        rownumbers: true,
        multiSort: true,
        loadFilter: function(data, parentId) {
            var dir = self.parent.$('#text').textbox('getText'); // 选中的文件夹Name
            path = 'Project/' + dir + '/Gateway';
            content = selectsql(path, "select * from Modbus_Service");
            return JSON.parse(content)
        },
        onDestroy: function(index, row) {
            var dir = self.parent.$('#text').textbox('getText'); // 选中的文件夹Name
            sql = "delete from Modbus_Service where id='{0}'".format(row['id']);
            result = deletesql('Project/' + dir + '/Gateway', sql)
            if (result == 'true') {
                self.parent.insert_info(self.parent.messages[initial]['common']['successfully_deleted'])
            } else {
                sqlite_message(result, self.parent.messages[initial]['common']['system_hint']);
                $("#modsv_xls_config").datagrid('reload');
            }
        },
        //保存后执行
        onEndEdit: function(index, rowData, changs) {
            var old_data = $('#modsv_xls_config').datagrid('getEditor', { index: index, field: "id" });
            addr_float = parseFloat(rowData['address']);
            addr_int = parseInt(rowData['address']);
            status = 'false';
            // if (['0X (Coil Status)', '1X (Input Status)'].indexOf(rowData['pointType']) != -1 && addr_int > 0 && addr_int < 65535) {
            //     if (rowData['dataType'] == 'bool' && rowData['address'].indexOf('.') == -1) {
            //         status = 'true';
            //     }
            // } else {
            //     if (rowData['dataType'] != 'bool' && addr_int > 0 && addr_int < 65535) {
            //         if (rowData['dataType'] == 'bit' && addr_float >= addr_int && addr_float <= addr_int + 0.15) {
            //             var point = rowData['address'].indexOf('.');
            //             if (rowData['address'].substring(point + 1).length == 2) {
            //                 status = 'true';
            //             }
            //         } else if (rowData['address'].indexOf('.') == -1 && addr_int < 65535) {
            //             status = 'true';
            //         }
            //     }
            // }
            if (addr_int > 0 && addr_int < 65535) {
                if (['0X (Coil Status)', '1X (Input Status)'].indexOf(rowData['pointType']) != -1) {
                    if (rowData['dataType'] == 'bool' && rowData['address'].indexOf('.') == -1 && rowData['sort'] == 'Null') {
                        status = 'true';
                    }
                } else {
                    if (rowData['dataType'] != 'bool') {
                        if (rowData['dataType'] == 'bit' && addr_float >= addr_int && addr_float <= addr_int + 0.15 && rowData['sort'] == 'Null') {
                            var point = rowData['address'].indexOf('.');
                            if (rowData['address'].substring(point + 1).length == 2) {
                                status = 'true';
                            }
                        } else if (rowData['address'].indexOf('.') == -1) {
                            if (['int16', 'uint16'].indexOf(rowData['dataType']) != -1) {
                                if (rowData['sort'] == 'Null') {
                                    status = 'true';
                                }
                            } else {
                                if (rowData['sort'] != 'Null') {
                                    status = 'true';
                                }
                            }
                        }
                    }
                }
            }
            if (status == 'true') {
                row = create_modbusaddr(rowData);
                if (old_data.oldHtml) { // 判断是否是更新数据
                    sql = "update  Modbus_Service set id='{0}',pointType='{1}',address='{2}',dataType='{3}',sort='{4}',exceptionDefault='{5}',modbusAddress='{6}' where id='{7}'".format(row['id'], row['pointType'], row['address'], row['dataType'], row['sort'], row['exceptionDefault'], row['modbusAddress'], old_data['oldHtml']);
                }
                result = insertsql('Project/' + dir + '/Gateway', sql)
                if (result == 'true') {
                    self.parent.insert_info(self.parent.messages[initial]['common']['Saved_successfully'])
                } else {
                    sqlite_message(result, self.parent.messages[initial]['common']['system_hint']);
                    $("#modsv_xls_config").datagrid('reload');
                }
            } else {
                $.messager.alert(self.parent.messages[initial]['common']['system_hint'], self.parent.messages[initial]['modbus_slave']['Mismatch'], "info");
                $("#modsv_xls_config").datagrid('reload');
            }
        },
        // 禁用编辑
        //onBeginEdit: function(index, row) {
        //    $("#modsv_xls_config").datagrid('cancelEdit', index);
        //},
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
                },
                {
                    field: 'pointType',
                    title: self.parent.messages[initial]['modbus_slave']['pointType'],
                    width: 100,
                    align: 'center',
                    editor: {
                        type: 'combobox',
                        options: {
                            panelHeight: 'auto',
                            method: 'get',
                            url: "../static/json/tag_type.json",
                            editable: false,
                            valueField: "text",
                            textField: "text",
                            required: true
                        }
                    },
                    sortable: true
                },
                {
                    field: 'address',
                    title: self.parent.messages[initial]['modbus_slave']['address'],
                    width: 100,
                    align: 'center',
                    editor: {
                        type: 'textbox',
                        options: {
                            required: true,
                            validType: "maxLength[5]",
                        }
                    },
                    sortable: true,
                    sorter: function(a, b) {
                        return (parseFloat(a) > parseFloat(b) ? 1 : -1);

                    }
                },
                // {
                //     field: 'modbusAddress',
                //     title: 'modbusAddress',
                //     width: 100,
                //     align: 'center',
                //     editor: {
                //         type: 'validatebox',
                //         options: {
                //             required: true
                //                 //editable: false
                //         }
                //     }
                // },
                {
                    field: 'dataType',
                    title: self.parent.messages[initial]['modbus_slave']['dataType'],
                    width: 100,
                    align: 'center',
                    editor: {
                        type: 'combobox',
                        options: {
                            panelHeight: 'auto',
                            method: 'get',
                            url: "../static/json/modslave.json",
                            editable: false,
                            valueField: "text",
                            textField: "text",
                            required: true
                        }
                    }
                }, {
                    field: 'sort',
                    title: self.parent.messages[initial]['modbus_master']['sort'],
                    width: 100,
                    align: 'center',
                    editor: {
                        type: 'combobox',
                        options: {
                            panelHeight: 'auto',
                            method: 'get',
                            url: "../static/json/modbussort.json",
                            editable: false,
                            valueField: "text",
                            textField: "text",
                            required: true
                        }
                    }
                },
                //{
                //    field: '小端在前',
                //    title: '小端在前',
                //    width: 100,
                //    align: 'center',
                //    editor: {
                //        type: 'checkbox',
                //        options: {
                //            on: "true",
                //            off: "false"
                //        }
                //    }
                //},
                //{
                //    field: '反转字序',
                //    title: '反转字序',
                //    width: 100,
                //    align: 'center',
                //    editor: {
                //        type: 'checkbox',
                //        options: {
                //            on: "true",
                //            off: "false"
                //        }
                //    }
                //},
                {
                    field: 'exceptionDefault',
                    title: self.parent.messages[initial]['modbus_slave']['exceptionDefault'],
                    width: 100,
                    align: 'center',
                    editor: {
                        type: 'textbox',
                        options: {
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
             var row = $('#modsv_xls_config').edatagrid('getRows').length;
             if (row) {
             var idvalue = $('#modsv_xls_config').edatagrid('getData').rows[row - 1].id;
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
             $('#modsv_xls_config').edatagrid('addRow', {
             //index:0,#首行
             row: {
             id: data
             }
             });
             }
             }, '-',*/
            {
                text: self.parent.messages[initial]['common']['add'],
                iconCls: 'icon-add',
                handler: function() {
                    self.parent.display_tag('modbus_slave', null, true)
                }
            },
            '-',
            {
                text: self.parent.messages[initial]['common']['save'],
                iconCls: 'icon-save',
                handler: function() {
                    $('#modsv_xls_config').edatagrid('saveRow');
                }
            },
            '-', {
                text: self.parent.messages[initial]['common']['redo'],
                iconCls: 'icon-redo',
                handler: function() {
                    $('#modsv_xls_config').edatagrid('cancelRow');
                }
            }, '-', {
                text: self.parent.messages[initial]['common']['remove'],
                iconCls: 'icon-remove',
                handler: function() {
                    //var selRow = $('#modsv_xls_config').edatagrid('getSelections')
                    //console.log(selRow.length)
                    $("#modsv_xls_config").edatagrid('destroyRow');
                }
            }, '-', {
                text: self.parent.messages[initial]['index']['Empty'],
                iconCls: 'icon-empty',
                handler: function() {
                    $.messager.confirm(self.parent.messages[initial]['common']['system_hint'], self.parent.messages[initial]['common']['if_clear_table'], function(r) {
                        if (r) {
                            var dir = self.parent.$('#text').textbox('getText'); // 选中的文件夹Name
                            sql = "DELETE FROM Modbus_Service";
                            result = truncatesql('Project/' + dir + '/Gateway', sql, 'VACUUM');
                            if (result == 'true') {
                                self.parent.insert_info(self.parent.messages[initial]['common']['clear_success']);
                                $("#modsv_xls_config").datagrid('reload');
                            } else {
                                sqlite_message(result, self.parent.messages[initial]['common']['system_hint']);
                                $("#modsv_xls_config").datagrid('reload');
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
    //$('#dlt_modbus_type').switchbutton("options").checked;
});