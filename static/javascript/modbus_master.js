/**
 * Created by Administrator on 2017/9/14.
 */
function doSearch() {
    var a = $('#querytb').form('enableValidation').form('validate');
    if (!a) {
        return false
    } else {
        var dir = self.parent.$('#text').textbox('getText'); // 选中的文件夹名称
        base_addr_check = $("#base_addr").switchbutton("options").checked;
        if (base_addr_check) {
            addr_value = 1
        } else {
            addr_value = 0
        }
        var obj = get_select();
        if (obj.path != 'Template/Template') {
            var sql = "update Device SET advance=nullif('{0}','{}') where text='{1}'".format(JSON.stringify({ "baseAddr": addr_value }), obj.select.text)
        }
        result = updatesql(obj.path, sql);
        if (result == 'true') {
            obj.select.protocolConf = addr_value;
        } else {
            $.messager.alert(result);
        }
        self.parent.insert_info(self.parent.messages[initial]['modbus_master']['baseaddr_success'])
    }
}

function table_export() {
    // var value = $("#modr_xls_config").edatagrid('getRows');
    var obj = get_select();
    var sql = "select * from Modbus where deviceCode='{0}'".format(obj.select.text);
    content = selectsql(obj.path, sql);
    value = JSON.parse(content);
    value.forEach(function(tag) {
        tag["access"] = modbus_item[tag["objectType"]]["en-US"]
    })
    if (value.length == 0) {
        value = [{ 'tagCode': '', 'description': '', 'function': '', 'address': '', 'dataType': '', 'sort': '', 'rate': '' }]
    }
    json = JSON.stringify({ 'Modbus': value })
    jsontoexcel(json, 'modbus_master_config.xls')
}

function create_modbusaddr(person) {
    if (person['function'] == '0X (Coil Status)') {
        addr_length = person['address'].length;
        person['modbusAddress'] = person['address'];
        for (var i = 0; i < 6 - addr_length; i++) {
            person['modbusAddress'] = '0' + person['modbusAddress']
        }
        if (person['access'] == '只读' || person['access'] == 'Read Only') {
            person['objectType'] = 'BI'
        } else if (person['access'] == '只写' || person['access'] == 'Write Only') {
            person['objectType'] = 'BO'
        } else if (person['access'] == '读写' || person['access'] == 'Read And Write') {
            person['objectType'] = 'BV'
        }
    }
    if (person['function'] == '1X (Input Status)') {
        addr_length = person['address'].length;
        person['modbusAddress'] = person['address'];
        for (var i = 0; i < 6 - addr_length - 1; i++) {
            person['modbusAddress'] = '0' + person['modbusAddress']
        }
        person['modbusAddress'] = '1' + person['modbusAddress']
        person['objectType'] = 'BI'
    }
    if (person['function'] == '4X (Holding Register)') {
        if (person['address'].indexOf('.') == -1) {
            addr_length = person['address'].length;
            person['modbusAddress'] = person['address'];
            for (var i = 0; i < 6 - addr_length - 1; i++) {
                person['modbusAddress'] = '0' + person['modbusAddress']
            }
            person['modbusAddress'] = '4' + person['modbusAddress']
        } else {
            addr_length = person['address'].length;
            person['modbusAddress'] = person['address'];
            for (var i = 0; i < 9 - addr_length - 1; i++) {
                person['modbusAddress'] = '0' + person['modbusAddress']
            }
            person['modbusAddress'] = '4' + person['modbusAddress']
        }
        if (person['access'] == '只读' || person['access'] == 'Read Only') {
            person['objectType'] = 'AI'
        } else if (person['access'] == '只写' || person['access'] == 'Write Only') {
            person['objectType'] = 'AO'
        } else if (person['access'] == '读写' || person['access'] == 'Read And Write') {
            person['objectType'] = 'AV'
        }
    }
    if (person['function'] == '3X (Input Registers)') {
        if (person['address'].indexOf('.') == -1) {
            addr_length = person['address'].length;
            person['modbusAddress'] = person['address'];
            for (var i = 0; i < 6 - addr_length - 1; i++) {
                person['modbusAddress'] = '0' + person['modbusAddress']
            }
            person['modbusAddress'] = '3' + person['modbusAddress']
        } else {
            addr_length = person['address'].length;
            person['modbusAddress'] = person['address'];
            for (var i = 0; i < 9 - addr_length - 1; i++) {
                person['modbusAddress'] = '0' + person['modbusAddress']
            }
            person['modbusAddress'] = '3' + person['modbusAddress']
        }
        person['objectType'] = 'AI'
    }
    return person;
}

/* ================ 深拷贝 ================ */
function deepClone(initalObj) {
    var obj = {};
    obj = JSON.parse(JSON.stringify(initalObj));

    return obj;
}

$(function() {
    access = new Array();
    modbus_item = "";
    $.ajaxSettings.async = false;
    $.getJSON('../static/json/access.json', function(data) {
        modbus_item = data;
    })
    if (initial == "zh-CN") {
        access = [{ "text": "只读", "id": "Read Only" }, { "text": "只写", "id": "Write Only" }, { "text": "读写", "id": "Read And Write" }]
    } else {
        access = [{ "text": "Read Only", "id": "Read Only" }, { "text": "Write Only", "id": "Write Only" }, { "text": "Read And Write", "id": "Read And Write" }]
    }

    $("#modr_xls_config").edatagrid({
        url: '../static/json/treegrid_data1.json',
        fitColumns: true,
        striped: true,
        rownumbers: true,
        singleSelect: true,
        ctrlSelect: true,
        closable: true,
        remoteSort: false,
        multiSort: true,
        loadFilter: function(data, parentId) {
            var obj = get_select();
            var sql = "select * from Modbus where deviceCode='{0}'".format(obj.select.text)
            content = JSON.parse(selectsql(obj.path, sql));
            content.forEach(function(tag) {
                tag["access"] = modbus_item[tag["objectType"]][initial]
            })
            return content;
        },
        onClickRow: function(index, row) {
            $("#modr_xls_config").edatagrid('endEdit', index);
        },
        onDestroy: function(index, row) {
            var obj = get_select();
            var sql = "delete from Modbus where tagCode='{0}' and deviceCode='{1}'".format(row['tagCode'], obj.select.text);
            result = deletesql(obj.path, sql)
            if (result == 'true') {
                self.parent.insert_info(self.parent.messages[initial]['common']['successfully_deleted'])
            } else {
                sqlite_message(result, self.parent.messages[initial]['common']['system_hint']);
                $("#modr_xls_config").datagrid('reload');
            }
        },
        // 保存时执行
        onEndEdit: function(index, row, changes) {
            var old_data = $('#modr_xls_config').datagrid('getEditor', { index: index, field: "tagCode" });
            addr_float = parseFloat(row['address']);
            addr_int = parseInt(row['address']);
            status = 'false';
            if (addr_int > 0 && addr_int < 65535) {
                if (['0X (Coil Status)', '1X (Input Status)'].indexOf(row['function']) != -1) {
                    if (row['dataType'] == 'bool' && row['address'].indexOf('.') == -1 && row['sort'] == 'Null') {
                        status = 'true';
                    }
                } else {
                    if (row['dataType'] != 'bool') {
                        if (row['dataType'] == 'bit' && addr_float >= addr_int && addr_float <= addr_int + 0.15 && row['sort'] == 'Null') {
                            var point = row['address'].indexOf('.');
                            if (row['address'].substring(point + 1).length == 2) {
                                status = 'true';
                            }
                        } else if (row['address'].indexOf('.') == -1) {
                            if (['int8h', 'int8l', 'int16', 'uint16'].indexOf(row['dataType']) != -1) {
                                if (row['sort'] == 'Null') {
                                    status = 'true';
                                }
                            } else {
                                if (row['sort'] != 'Null') {
                                    status = 'true';
                                }
                            }
                        }
                    }
                }
            }
            if (row['rate'] > 0) {
                if (status == 'true') {
                    var select = self.parent.$('#template_tree').tree('getSelected');
                    row = create_modbusaddr(row);
                    var obj = get_select();
                    if (!row.isNewRecord) { // 判断是否是更新数据
                        sql = "update Modbus set tagCode='{0}',description=nullif('{1}',''),function='{2}',address='{3}',dataType='{4}',sort='{5}',rate={6},modbusAddress='{7}',objectType='{8}' where deviceCode='{9}' and tagCode='{10}'".format(row['tagCode'], row['description'], row['function'], row['address'], row['dataType'], row['sort'], row['rate'], row['modbusAddress'], row['objectType'], obj.select.text, old_data['oldHtml']);
                    } else {
                        sql = "insert into Modbus values ('{0}','{1}',nullif('{2}',''),'{3}','{4}','{5}','{6}',{7},'{8}','{9}')".format(obj.select.text, row['tagCode'], row['description'], row['function'], row['address'], row['dataType'], row['sort'], row['rate'], row['modbusAddress'], row['objectType'])
                    }
                    result = insertsql(obj.path, sql)
                    if (result == 'true') {
                        self.parent.insert_info(self.parent.messages[initial]['common']['Saved_successfully'])
                        $("#modr_xls_config").datagrid('reload');
                    } else {
                        sqlite_message(result, self.parent.messages[initial]['common']['system_hint']);
                        $("#modr_xls_config").datagrid('reload');
                    }
                } else {
                    $.messager.alert(self.parent.messages[initial]['common']['system_hint'], self.parent.messages[initial]['modbus_master']['match'], "info");
                    $("#modr_xls_config").datagrid('reload');
                }
            } else {
                $.messager.alert(self.parent.messages[initial]['common']['system_hint'], self.parent.messages[initial]['common']['rate0'], "info");
                $("#modr_xls_config").datagrid('reload');
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
                    // ,
                    // formatter: function(value, row, index) {
                    //     return '<span style="font-size:16px">' + value + '</span>'; //改变表格中内容字体的大小
                    // }

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
                    field: 'function',
                    title: self.parent.messages[initial]['modbus_master']['function'],
                    width: 100,
                    align: 'center',
                    editor: {
                        type: 'combobox',
                        options: {
                            panelHeight: 'auto',
                            method: 'get',
                            url: "../static/json/func.json",
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
                    title: self.parent.messages[initial]['modbus_master']['address'],
                    width: 100,
                    align: 'center',
                    editor: {
                        type: 'textbox',
                        options: {
                            required: true,
                            validType: "modbusaddrCheck[0,65535]"
                        }
                    },
                    sortable: true,
                    sorter: function(a, b) {
                        return (parseFloat(a) > parseFloat(b) ? 1 : -1);

                    }
                },
                {
                    field: 'dataType',
                    title: self.parent.messages[initial]['modbus_master']['dataType'],
                    width: 100,
                    align: 'center',
                    editor: {
                        type: 'combobox',
                        options: {
                            panelHeight: 'auto',
                            method: 'get',
                            url: "../static/json/modbustype.json",
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
                }, {
                    field: 'access',
                    title: self.parent.messages[initial]['modbus_master']['access'],
                    width: 100,
                    align: 'center',
                    editor: {
                        type: 'combobox',
                        options: {
                            panelHeight: 'auto',
                            editable: false,
                            valueField: "id",
                            textField: "text",
                            data: access,
                            required: true
                        }
                    }
                },
                {
                    field: 'rate',
                    title: self.parent.messages[initial]['modbus_master']['rate'],
                    width: 100,
                    align: 'center',
                    editor: {
                        type: 'textbox',
                        options: {
                            required: true,
                            validType: "mone"
                        }
                    }
                }
            ]
        ],
        toolbar: [{
                text: self.parent.messages[initial]['common']['add'],
                iconCls: 'icon-add',
                handler: function() {
                    $('#modr_xls_config').edatagrid('saveRow');
                    var obj = get_select();
                    var sql = "select tagCode from Modbus where deviceCode='{0}' and tagCode LIKE'tag%'".format(obj.select.text)
                    value = selectsql(obj.path, sql);
                    tagCode = create_name(value);
                    $('#modr_xls_config').edatagrid('addRow', {
                        row: {
                            tagCode: tagCode,
                            rate: 1.00
                        }
                    });
                }
            }, '-', {
                text: self.parent.messages[initial]['common']['save'],
                iconCls: 'icon-save',
                handler: function() {
                    $('#modr_xls_config').edatagrid('saveRow');
                }
            }, '-', {
                text: self.parent.messages[initial]['common']['redo'],
                iconCls: 'icon-redo',
                handler: function() {
                    $('#modr_xls_config').edatagrid('cancelRow');
                }
            }, '-', {
                text: self.parent.messages[initial]['common']['remove'],
                iconCls: 'icon-remove',
                handler: function() {
                    $("#modr_xls_config").edatagrid('destroyRow');
                }
            }, '-', {
                text: self.parent.messages[initial]['index']['Empty'],
                iconCls: 'icon-empty',
                handler: function() {
                    $.messager.confirm(self.parent.messages[initial]['common']['system_hint'], self.parent.messages[initial]['common']['if_clear_table'], function(r) {
                        if (r) {
                            var obj = get_select();
                            var sql = "delete from Modbus where deviceCode='{0}'".format(obj.select.text);
                            result = cfxApi.deletesql(obj.path, sql);
                            if (result == 'true') {
                                self.parent.insert_info(self.parent.messages[initial]['common']['clear_success']);
                                $("#modr_xls_config").datagrid('reload');
                            } else {
                                sqlite_message(result, self.parent.messages[initial]['common']['system_hint']);
                                $("#modr_xls_config").datagrid('reload');
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
            }, '-', {
                text: self.parent.messages[initial]['common']['Load_template_file'],
                iconCls: 'icon-template',
                handler: function() {
                    var obj = get_select();
                    if (obj.index == 0) {
                        var select = self.parent.$('#tt').tree('getSelected');
                        var sql = "select deviceCode from Template where protocol='Modbus'";
                        content = selectsql('Template/Template', sql);
                        template_list = JSON.parse(content);
                        $("#template_name").combobox({
                            valueField: 'deviceCode',
                            textField: 'deviceCode',
                            data: template_list,
                            panelHeight: 'auto'
                        });
                        if (template_list.length == 0) {
                            $.messager.alert(self.parent.messages[initial]['common']['system_hint'], self.parent.messages[initial]['modbus_master']['no_template'], "info")
                        } else {
                            $("#template_name").combobox('setValue', template_list[0]['deviceCode']);
                            $("#templete_dialog").dialog({
                                closable: false,
                                draggable: false,
                                modal: true,
                                buttons: [{
                                        text: self.parent.messages[initial]['common']['ok'],
                                        iconCls: 'icon-ok',
                                        handler: function() {
                                            var obj = get_select();
                                            template_name = $("#template_name").combobox('getValue');
                                            var sql = "select * from Modbus where deviceCode='{0}'".format(template_name);
                                            content = selectsql('Template/Template', sql);
                                            content_object = JSON.parse(content);
                                            content_object.forEach(function(tag) {
                                                tag['deviceCode'] = obj.select.text
                                            });
                                            result = bulk_operate(content_object);
                                            if (result == "true") {
                                                $("#modr_xls_config").edatagrid('reload');
                                                // self.parent.insert_info('装载模板' + template_name + '成功');
                                                $('#templete_dialog').dialog('close');
                                            } else {
                                                sqlite_message(result, self.parent.messages[initial]['common']['system_hint']);
                                            }
                                        }
                                    },
                                    {
                                        text: self.parent.messages[initial]['common']['cancel'],
                                        iconCls: 'icon-cancel',
                                        handler: function() {
                                            $('#templete_dialog').dialog('close')
                                        }
                                    }
                                ]
                            });
                        }
                    } else {
                        $.messager.alert(self.parent.messages[initial]['common']['system_hint'], self.parent.messages[initial]['modbus_master']['cannot_load'], "info");
                    }
                }
            }, '-', {
                text: self.parent.messages[initial]['common']['Save_as_template_file'],
                iconCls: 'icon-template',
                handler: function() {
                    // values = $("#modr_xls_config").datagrid('getRows');
                    // var blob = new Blob([JSON.stringify(values)], { type: "" });
                    // saveAs(blob, "*.json");
                    $("#templete_save_dialog").dialog({
                        closable: false,
                        draggable: false,
                        modal: true,
                        buttons: [{
                                text: self.parent.messages[initial]['common']['ok'],
                                iconCls: 'icon-ok',
                                handler: function() {
                                    templatesaved = self.parent.messages[initial]['common']['save_template'];
                                    success = self.parent.messages[initial]['common']['success']
                                    var obj = get_select();
                                    template_name = $("#template_save").textbox('getText');
                                    var sql = "select * from Template where deviceCode='{0}'".format(template_name);
                                    content = selectsql('Template/Template', sql);
                                    if (content != '[]') {
                                        already = self.parent.messages[initial]['common']['Has_been_named'];
                                        replace = self.parent.messages[initial]['common']['replace_template'];
                                        $.messager.confirm(self.parent.messages[initial]['common']['system_hint'], already + template_name + replace, function(r) {
                                            if (r) {
                                                sql = "update Template set protocol='Modbus' where deviceCode='{0}'".format(template_name);
                                                status = updatesql('Template/Template', sql);
                                                sql = "delete from Modbus where deviceCode='{0}'".format(template_name);
                                                status = deletesql('Template/Template', sql);
                                                var sql = "select * from Modbus where deviceCode='{0}'".format(obj.select.text);
                                                modbus_content = selectsql(obj.path, sql);
                                                modbus_content_object = JSON.parse(modbus_content);
                                                modbus_content_object.forEach(function(tag) {
                                                    tag['deviceCode'] = template_name
                                                });
                                                result = save_template(modbus_content_object);
                                                if (result == "true") {
                                                    $("#modr_xls_config").edatagrid('reload');
                                                    self.parent.insert_info(templatesaved + template_name + success);
                                                    $('#templete_save_dialog').dialog('close');
                                                    self.parent.load_template();
                                                } else {
                                                    sqlite_message(result, self.parent.messages[initial]['common']['system_hint']);
                                                }
                                            }
                                        });
                                    } else {
                                        sql = "insert into Template values('{0}','Modbus')".format(template_name);
                                        status = insertsql('Template/Template', sql);
                                        var sql = "select * from Modbus where deviceCode='{0}'".format(obj.select.text);
                                        modbus_content = selectsql(obj.path, sql);
                                        modbus_content_object = JSON.parse(modbus_content);
                                        modbus_content_object.forEach(function(tag) {
                                            tag['deviceCode'] = template_name
                                        });
                                        result = save_template(modbus_content_object);
                                        if (result == "true") {
                                            $("#modr_xls_config").edatagrid('reload');
                                            self.parent.insert_info(templatesaved + template_name + success);
                                            $('#templete_save_dialog').dialog('close');
                                            self.parent.load_template();
                                        } else {
                                            sqlite_message(result, self.parent.messages[initial]['common']['system_hint']);
                                        }
                                    }
                                }
                            },
                            {
                                text: self.parent.messages[initial]['common']['cancel'],
                                iconCls: 'icon-cancel',
                                handler: function() {
                                    $('#templete_save_dialog').dialog('close')
                                }
                            }
                        ]
                    });
                }
            }
            //    ,
            //    {
            //    text: '输入框3<input type="file" id="username"/>'
            //}
        ]
    });

});