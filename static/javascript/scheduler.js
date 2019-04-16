/**
 * Created by Administrator on 2017/9/14.
 */
function scheduler_dialog(type, old_name) {
    $('#scheduler_div').dialog({
        title: self.parent.messages[initial]['index']['scheduler'],
        closable: false,
        draggable: false,
        modal: true,
        buttons: [{
                text: "确定",
                iconCls: 'icon-ok',
                handler: function() {
                    if ($('#scheduler_form').form('validate')) {
                        scheduler_new(type, old_name)
                    }
                }
            },
            {
                text: "取消",
                iconCls: 'icon-cancel',
                handler: function() {
                    $("#scheduler_div").dialog('close');
                }
            }
        ]
    });
    //self.perent.$("#event_check").prop("checked", true);
    $("#scheduler_div").dialog('open'); //必须先显示，再弹出
}

// 获取事件窗口中动态添加的关联点和写入值的数据
function getsub(count, initialTagId, initialValueId) {
    var re = new Array();
    for (var i = 0; i < count; i++) {
        if (document.getElementById(initialTagId + i)) {
            apoint = {};
            apoint['id'] = $('#' + initialTagId + i).textbox('getText');
            // apoint['id'] = document.getElementsByName(initialTagId + i)[0].value;
            apoint['val'] = document.getElementsByName(initialValueId + i)[0].value;
            re.push(apoint);
        }
    }
    return re;
}

// 获取事件窗口的数据
function scheduler_data(type, old_name) {
    var dir = self.parent.$('#text').textbox('getText'); // 选中的文件夹名称
    var select = self.parent.$('#tt').tree('getSelected');
    path = 'Project/' + dir + '/Gateway';
    var enable = $("#scheduler_check").is(":checked");
    if (enable) {
        enable = 1;
    } else {
        enable = 0;
    }
    var name = $('#scheduler_name').textbox('getText');
    var start = $('#start_time').timespinner('getValue');
    var stop = $('#stop_time').timespinner('getValue');
    var wday = "";
    var theday = 0;
    $("#day_div input[type=checkbox]").each(function() {
        if (this.checked) {
            wday += theday + ","
        }
        theday++;
    })
    wday = wday.substring(0, wday.length - 1);
    if (wday == "") {
        $.messager.alert(self.parent.messages[initial]['common']['system_hint'], self.parent.messages[initial]['scheduler']['leastone'], "info")
        return false;
    };
    var sets = getsub(tcount, "start_tag", "start_val");
    if (type == 'add') {
        sql = "insert into scheduler values ('{0}','{1}','{2}','{3}','{4}',nullif('{5}','[]'))".format(name, enable, start, stop, wday, JSON.stringify(sets));
    } else {
        sql = "update scheduler set name='{0}',enable='{1}',start='{2}',stop='{3}',wday='{4}',sets=nullif('{5}','[]') where name='{6}'".format(name, enable, start, stop, wday, JSON.stringify(sets), old_name);
    }
    console.log(sql)
    result = insertsql(path, sql)
    if (result == 'true') {
        self.parent.insert_info(self.parent.messages[initial]['common']['Saved_successfully'])
        return true;
    } else {
        console.log(result)
        if (result.indexOf('NOT NULL') != -1) {
            $.messager.alert(self.parent.messages[initial]['common']['system_hint'], self.parent.messages[initial]['calculate']['not_null'], "info")
        } else if (result.indexOf('UNIQUE') != -1) {
            $.messager.alert(self.parent.messages[initial]['common']['system_hint'], self.parent.messages[initial]['common']['duplicate_name'], "info")
        } else {
            $.messager.alert(self.parent.messages[initial]['common']['system_hint'], result, "info")
        }
    }
    return false;
}

// 添加新计划任务
function scheduler_new(type, old_name) {
    status = scheduler_data(type, old_name);
    if (status == 'true') {
        if (type == 'add') {
            self.parent.insert_info(self.parent.messages[initial]['common']['add_success']);
            $("#scheduler_div").dialog('close');
        } else { // 双击修改
            self.parent.insert_info(self.parent.messages[initial]['common']['edit_success']);
            $("#scheduler_div").dialog('close');
        }
    }
    $("#scheduler_config").datagrid('reload');
}

window.onmessage = function(e) {
    data = JSON.parse(e.data)
    $('#' + button_id).textbox('setText', data[0][0])
}

$(function() {
    var q = 0;
    $("#scheduler_config").edatagrid({
        url: '../static/json/treegrid_data1.json',
        fitColumns: true,
        striped: true,
        rownumbers: true,
        loadFilter: function(data, parentId) {
            var dir = self.parent.$('#text').textbox('getText'); // 选中的文件夹名称
            path = 'Project/' + dir + '/Gateway';
            content = JSON.parse(selectsql(path, "select * from scheduler"));
            content.forEach(function(tag) {
                if (tag['enable']) {
                    tag['enable'] = self.parent.messages[initial]['common']['enable']
                } else {
                    tag['enable'] = self.parent.messages[initial]['common']['disable']
                }
            })
            return content;
        },
        onDestroy: function(index, data) {
            var dir = self.parent.$('#text').textbox('getText'); // 选中的文件夹名称
            sql = "delete from scheduler where name='{0}'".format(data['name']);
            result = deletesql('Project/' + dir + '/Gateway', sql)
            if (result == 'true') {
                self.parent.insert_info(self.parent.messages[initial]['common']['successfully_deleted'])
            } else {
                sqlite_message(result, self.parent.messages[initial]['common']['system_hint']);
                $("#scheduler_config").datagrid('reload');
            }
        },
        // 禁用编辑
        //onBeginEdit: function(index, row) {
        //    $("#scheduler_config").datagrid('cancelEdit', index);
        //},
        //保存后执行
        onDblClickRow: function(index, row) {
            $("#start_table").empty();
            data = $("#scheduler_config").datagrid('getSelected');
            scheduler_dialog('modify', data.name);
            if (data.enable == self.parent.messages[initial]['common']['enable']) {
                $("#scheduler_check").prop("checked", true);
            } else {
                $("#scheduler_check").prop("checked", false);
            }
            $('#scheduler_name').textbox('setText', data.name)
            $('#start_time').timespinner('setValue', data.start);
            $('#stop_time').timespinner('setValue', data.stop);
            wday_object = data['wday'].split(",");
            day_id = { "0": "sunday", "1": "monday", "2": "tuesday", "3": "wednesday", "4": "thursday", "5": "friday", "6": "saturday" }
            Object.keys(day_id).forEach(function(day) {
                $("#" + day_id[day]).prop("checked", false);
            })
            wday_object.forEach(function(day) {
                $("#" + day_id[day]).prop("checked", true);
            })
            if (data.sets) {
                sets_object = JSON.parse(data.sets);
                sets_object.forEach(function(tag) {
                    start_additem("start_table");
                    $('#start_tag' + (tcount - 1)).textbox('setValue', tag.id);
                    $('#start_val' + (tcount - 1)).textbox('setValue', tag.val);
                });
            }
            $("#scheduler_config").datagrid('cancelEdit', index);
        },
        idField: 'id',
        columns: [
            [{
                    field: 'enable',
                    title: self.parent.messages[initial]['mqtt']['used'],
                    width: 100,
                    align: 'center',
                    editor: {
                        type: 'checkbox',
                        options: {
                            on: "true",
                            off: "false"
                        }
                    }
                },
                {
                    field: 'name',
                    title: self.parent.messages[initial]['common']['name'],
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
                    field: 'start',
                    title: self.parent.messages[initial]['offline_data']['Start_time'],
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
                    field: 'stop',
                    title: self.parent.messages[initial]['offline_data']['Stop_time'],
                    width: 100,
                    align: 'center',
                    editor: {
                        type: 'combobox',
                        options: { required: true }
                    }
                }
            ]
        ],
        toolbar: [{
            text: self.parent.messages[initial]['common']['add'],
            iconCls: 'icon-add',
            handler: function() {
                $("#start_table").empty();
                scheduler_dialog('add', 'null')
            }
        }, '-', {
            text: self.parent.messages[initial]['common']['remove'],
            iconCls: 'icon-remove',
            handler: function() {
                $("#scheduler_config").edatagrid('destroyRow');
            }
        }, '-', {
            text: self.parent.messages[initial]['index']['Empty'],
            iconCls: 'icon-empty',
            handler: function() {
                $.messager.confirm(self.parent.messages[initial]['common']['system_hint'], self.parent.messages[initial]['common']['if_clear_table'], function(r) {
                    if (r) {
                        var dir = self.parent.$('#text').textbox('getText'); // 选中的文件夹名称
                        sql = "DELETE FROM scheduler";
                        result = truncatesql('Project/' + dir + '/Gateway', sql, 'VACUUM');
                        if (result == 'true') {
                            self.parent.insert_info(self.parent.messages[initial]['common']['clear_success']);
                            $("#scheduler_config").datagrid('reload');
                        } else {
                            sqlite_message(result, self.parent.messages[initial]['common']['system_hint']);
                            $("#scheduler_config").datagrid('reload');
                        }
                    }
                });

            }
        }]
    });

});