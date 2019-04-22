/**
 * Created by Administrator on 2017/9/14.
 */
function table_export() {
    // var value = $("#alarm_xls_config").edatagrid('getRows');
    var obj = get_select();
    var sql = "select * from CJ188 where deviceCode='{0}'".format(obj.select.text);
    content = selectsql(obj.path, sql);
    value = JSON.parse(content);
    if (value.length == 0) {
        value = [{ 'tagCode': '', 'description': '', 'vendorCode': '', 'dataItem': '', 'rate': '' }]
    }
    json = JSON.stringify({ 'CJ188': value })
    jsontoexcel(json, 'CJ188_config.xls')
}

var content = [];

function data_ajax() {
    content = [];
    start_time = $('#start_time').datetimebox('getValue');
    stop_time = $('#stop_time').datetimebox('getValue');
    var tab = self.parent.$('#pro_device').tabs('getSelected');
    var index = self.parent.$('#pro_device').tabs('getTabIndex', tab);
    if (index == 0) {
        var dir = self.parent.$('#text').textbox('getText'); // 选中的文件夹名称
        if (dir != "") {
            path = 'Project/' + dir + '/alarm';
            var sql = "select * from AEHistory where timestamp>'{0}' and timestamp<'{1}'".format(start_time, stop_time);
            a = selectsql(path, sql);
            content = JSON.parse(a);
            content.forEach(function(tag) {
                if (tag["type"] == "AlarmEvent") {
                    tag["type"] = self.parent.messages[initial]['select_alarm']['trigger']
                } else if (tag["type"] == "AlarmRecover") {
                    tag["type"] = self.parent.messages[initial]['select_alarm']['Release']
                }
            })
        } else {
            $.messager.alert(self.parent.messages[initial]['common']['system_hint'], self.parent.messages[initial]['index']['please_openpro'], "info")
        }
    } else if (index == 1) {
        gwip = get_baseurl();
        $.ajax({
            type: 'get',
            url: 'http://' + gwip + '/alarmInquire',
            data: { 'startTime': start_time, 'stopTime': stop_time },
            timeout: 5000,
            async: false,
            success: function(data) {
                if (data) {
                    data.forEach(function(tag) {
                        if (tag["type"] == "AlarmEvent") {
                            tag["type"] = self.parent.messages[initial]['select_alarm']['trigger']
                        } else if (tag["type"] == "AlarmRecover") {
                            tag["type"] = self.parent.messages[initial]['select_alarm']['Release']
                        }
                    })
                    content = data;
                }
            }
        })
    }
    if (JSON.stringify(content) == '[]') {
        $.messager.alert(self.parent.messages[initial]['common']['system_hint'], self.parent.messages[initial]['select_alarm']['no_alarm'].format(start_time, stop_time), "info")
    }
    $("#alarm_xls_config").datagrid('reload');
}

$(function() {
    var q = 0;
    $("#alarm_xls_config").edatagrid({
        url: '../static/json/treegrid_data1.json',
        fitColumns: true,
        striped: true,
        rownumbers: true,
        loadFilter: function(data, parentId) {
            return content;
        },
        onDblClickRow: function(index, row) {
            $("#alarm_xls_config").datagrid('cancelEdit', index); // 取消编辑
        },
        onDestroy: function(index, row) {
            var obj = get_select();
            var sql = "delete from CJ188 where tagCode='{0}' and deviceCode='{1}'".format(row['tagCode'], obj.select.text);
            result = deletesql(obj.path, sql)
            if (result == 'true') {
                self.parent.insert_info(self.parent.messages[initial]['common']['successfully_deleted'])
            } else {
                sqlite_message(result, self.parent.messages[initial]['common']['system_hint']);
                $("#alarm_xls_config").datagrid('reload');
            }
        },
        idField: 'tagCode',
        columns: [
            [{
                    field: 'event',
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
                    field: 'content',
                    title: self.parent.messages[initial]['common']['description'],
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
                    field: 'type',
                    title: self.parent.messages[initial]['select_alarm']['trigger/Release'],
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
                    field: 'tag',
                    title: self.parent.messages[initial]['select_alarm']['Trigger_point'],
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
                    field: 'value',
                    title: self.parent.messages[initial]['select_alarm']['Trigger_point_val'],
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
                            required: true
                        }
                    }
                },
                {
                    field: 'status',
                    title: self.parent.messages[initial]['select_alarm']['Trigger_point_status'],
                    width: 100,
                    align: 'center',
                    editor: {
                        type: 'textbox',
                        options: {
                            required: true,
                            validType: "mone"
                        }
                    }
                },
                {
                    field: 'timestamp',
                    title: self.parent.messages[initial]['select_alarm']['trigger_time'],
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
        ]
    });

});