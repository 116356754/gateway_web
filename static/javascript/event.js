/**
 * Created by Administrator on 2017/9/14.
 */
function event_dialog(type, index, old_name) {
    self.parent.$('#event_add').dialog({
        closable: false,
        draggable: false,
        modal: true,
        buttons: [{
                text: "确定",
                iconCls: 'icon-ok',
                handler: function() {
                    //set_describe(); // 显示下方描述语句
                    if (self.parent.$('#event_form').form('validate')) {
                        event_new(type, index, old_name)
                    }
                }
            },
            {
                text: "取消",
                iconCls: 'icon-cancel',
                handler: function() {
                    self.parent.$("#event_add").dialog('close');
                }
            }
        ]
    });
    //self.perent.$("#event_check").prop("checked", true);
    self.parent.$("#event_add").dialog('open'); //必须先显示，再弹出
}

// 设置描述
function set_describe() {
    describe = '事件名称：' + row['名称'] + '<br><br>';
    describe += '当' + row['关联点名称'] + '的值大于' + row['最大值'] + '或小于' + row['最小值'] + '时，触发此事件.<br>';
    describe += '触发间隔为 ' + row['间隔时间'] + 's.<br><br>'
    describe += '当事件触发时,<br>';
    if (row['事件触发'] == '写入值') {
        describe += '向id为' + row['触发写入点名称'] + '的点中写入值' + row['触发写入值'] + '.<br><br>';
    } else {
        describe += row['事件触发'] + '<br>';
    }
    describe += '当事件解除时,<br>';
    if (row['事件解除'] == '写入值') {
        describe += '向id为' + row['触发写入点名称'] + '的点中写入值' + row['触发写入值'] + '.<br><br>';
    } else {
        describe += row['事件解除'] + '<br>';
    }
    self.parent.$('#describe').html(describe)
}

// 获取事件窗口中动态添加的关联点和写入值的数据
function getsub(count, initialTagId, initialValueId) {
    var re = new Array();
    for (var i = 0; i < count; i++) {
        if (self.parent.document.getElementById(initialTagId + i)) {
            apoint = {};
            apoint['id'] = self.parent.$('#' + initialTagId + i).textbox('getText');
            // apoint['id'] = self.parent.document.getElementsByName(initialTagId + i)[0].value;
            apoint['val'] = self.parent.document.getElementsByName(initialValueId + i)[0].value;
            re.push(apoint);
        }
    }
    return re;
}

// 获取事件窗口的数据
function event_data(type, old_name) {
    var dir = self.parent.$('#text').textbox('getText'); // 选中的文件夹名称
    path = 'Project/' + dir + '/Gateway';
    var enable = self.parent.$("#event_check").is(":checked");
    if (enable) {
        enable = 1;
    } else {
        enable = 0;
    }
    var name = self.parent.$('#event_name').textbox('getText');
    var range = self.parent.$('#event_class').combobox('getValue');
    if (range == "点值超出范围") {
        range = 1
    } else {
        range = 0
    }
    var interval = self.parent.$('#event_interval').textbox('getText');
    var delay = self.parent.$('#delay').textbox('getText');
    var tag = self.parent.$('#event_piontname').textbox('getText');
    var high = self.parent.$('#event_max').textbox('getText');
    var low = self.parent.$('#event_min').textbox('getText');
    if (parseInt(low) > parseInt(high)) {
        self.parent.$.messager.alert(self.parent.messages[initial]['common']['system_hint'], "不允许最小值大于最大值", "info")
        return false;
    }
    var trigger_action = self.parent.$('#trigger_action').combobox('getValue');
    var trigger = [];
    if (trigger_action == '写入值') {
        trigger = getsub(self.parent.tcount, "tp", "tv")
    }
    var release_action = self.parent.$('#release_action').combobox('getValue');
    var clear = [];
    if (release_action == '写入值') {
        clear = getsub(self.parent.rcount, "rp", "rv")
    }
    if (type == 'add') {
        sql = "insert into alarm values ('{0}','{1}','{2}','{3}','{4}',nullif('{5}',''),'{6}','{7}',nullif('{8}','[]'),nullif('{9}','[]'))".format(name, enable, range, interval, delay, tag, low, high, JSON.stringify(trigger), JSON.stringify(clear));
    } else {
        sql = "update alarm set name='{0}',enable='{1}',range='{2}',interval='{3}',delay='{4}',tag=nullif('{5}',''),low='{6}',high='{7}',trigger=nullif('{8}','[]'),clear=nullif('{9}','[]') where name='{10}'".format(name, enable, range, interval, delay, tag, low, high, JSON.stringify(trigger), JSON.stringify(clear), old_name);
    }
    console.log(sql)
    result = insertsql(path, sql)
    if (result == 'true') {
        self.parent.insert_info(self.parent.messages[initial]['common']['Saved_successfully'])
        return true;
    } else {
        console.log(result)
        if (result.indexOf('NOT NULL') != -1) {
            self.parent.$.messager.alert(self.parent.messages[initial]['common']['system_hint'], self.parent.messages[initial]['calculate']['not_null'], "info")
        } else if (result.indexOf('UNIQUE') != -1) {
            self.parent.$.messager.alert(self.parent.messages[initial]['common']['system_hint'], self.parent.messages[initial]['common']['duplicate_name'], "info")
        } else {
            self.parent.$.messager.alert(self.parent.messages[initial]['common']['system_hint'], result, "info")
        }
    }
    return false;
}

// 添加新事件
function event_new(type, index, old_name) {
    status = event_data(type, old_name);
    if (status == 'true') {
        if (type == 'add') {
            self.parent.insert_info('添加成功');
            self.parent.$("#event_add").dialog('close');
        } else { // 双击修改
            self.parent.insert_info('修改成功');
            self.parent.$("#event_add").dialog('close');
        }
    }
    $("#event_config").datagrid('reload');
}

window.onmessage = function(e) {
    data = JSON.parse(e.data)
}

$(function() {
    var q = 0;
    $("#event_config").edatagrid({
        url: '../static/json/treegrid_data1.json',
        fitColumns: true,
        striped: true,
        rownumbers: true,
        loadFilter: function(data, parentId) {
            var dir = self.parent.$('#text').textbox('getText'); // 选中的文件夹名称
            path = 'Project/' + dir + '/Gateway';
            content = JSON.parse(selectsql(path, "select * from alarm"));
            content.forEach(function(tag) {
                if (tag['enable']) {
                    tag['enable'] = "启用"
                } else {
                    tag['enable'] = "不启用"
                };
                if (tag['range']) {
                    tag['range'] = "点值超出范围"
                } else {
                    tag['range'] = "质量不为Good"
                };
            })
            return content;
        },
        onDestroy: function(index, data) {
            var dir = self.parent.$('#text').textbox('getText'); // 选中的文件夹名称
            sql = "delete from alarm where name='{0}'".format(data['name']);
            result = deletesql('Project/' + dir + '/Gateway', sql)
            if (result == 'true') {
                self.parent.insert_info(self.parent.messages[initial]['common']['successfully_deleted'])
            } else {
                sqlite_message(result, self.parent.messages[initial]['common']['system_hint']);
                $("#event_config").datagrid('reload');
            }
        },
        // 禁用编辑
        //onBeginEdit: function(index, row) {
        //    $("#event_config").datagrid('cancelEdit', index);
        //},
        //保存后执行
        onDblClickRow: function(index, row) {
            self.parent.$("#tb").empty();
            self.parent.$("#rb").empty();
            data = $("#event_config").datagrid('getSelected');
            event_dialog('modify', index, data.name);
            if (data.enable == "启用") {
                self.parent.$("#event_check").prop("checked", true);
            } else {
                self.parent.$("#event_check").prop("checked", false);
            }
            self.parent.$('#event_name').textbox('setText', data.name)
            self.parent.$('#event_class').combobox('setValue', data.range)
            self.parent.$('#event_interval').textbox('setText', data.interval)
            self.parent.$('#event_piontname').textbox('setText', data.tag)
            self.parent.$('#event_max').textbox('setText', data.high)
            self.parent.$('#event_min').textbox('setText', data.low)
            self.parent.$('#event_jitter').textbox('setText', data.delay)
            if (data.trigger) {
                self.parent.$('#trigger_action').combobox('setValue', "写入值");
                trigger_object = JSON.parse(data.trigger);
                trigger_object.forEach(function(tag) {
                    self.parent.tadditem("tb");
                    console.log(self.parent.tcount)
                    self.parent.$('#tp' + (self.parent.tcount - 1)).textbox('setValue', tag.id);
                    self.parent.$('#tv' + (self.parent.tcount - 1)).textbox('setValue', tag.val);
                });
            } else {
                self.parent.$('#trigger_action').combobox('setValue', "不响应");
            }
            if (data.clear) {
                self.parent.$('#release_action').combobox('setValue', "写入值");
                clear_object = JSON.parse(data.clear);
                clear_object.forEach(function(tag) {
                    self.parent.radditem("rb");
                    self.parent.$('#rp' + (self.parent.rcount - 1)).textbox('setValue', tag.id);
                    self.parent.$('#rv' + (self.parent.rcount - 1)).textbox('setValue', tag.val);
                });
            } else {
                self.parent.$('#release_action').combobox('setValue', "不响应");
            }
            // self.parent.$('#trigger_action').combobox('setValue', data.事件触发)
            // self.parent.$('#trigger_pointname').textbox('setText', data.触发写入点名称)
            // self.parent.$('#trigger_value').textbox('setText', data.触发写入值)
            // self.parent.$('#release_action').combobox('setValue', data.事件解除)
            // self.parent.$('#release_pointname').textbox('setText', data.解除写入点名称)
            // self.parent.$('#release_value').textbox('setText', data.解除写入值)
            $("#event_config").datagrid('cancelEdit', index);
        },
        idField: 'id',
        columns: [
            [{
                    field: 'enable',
                    title: '启用',
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
                    title: '名称',
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
                    field: 'range',
                    title: '事件种类',
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
                self.parent.$("#tb").empty();
                self.parent.$("#rb").empty();
                event_dialog('add', 0, 'null')
            }
        }, '-', {
            text: self.parent.messages[initial]['common']['remove'],
            iconCls: 'icon-remove',
            handler: function() {
                $("#event_config").edatagrid('destroyRow');
            }
        }, '-', {
            text: self.parent.messages[initial]['index']['Empty'],
            iconCls: 'icon-empty',
            handler: function() {
                $.messager.confirm(self.parent.messages[initial]['common']['system_hint'], self.parent.messages[initial]['common']['if_clear_table'], function(r) {
                    if (r) {
                        var dir = self.parent.$('#text').textbox('getText'); // 选中的文件夹名称
                        sql = "DELETE FROM alarm";
                        result = truncatesql('Project/' + dir + '/Gateway', sql, 'VACUUM');
                        if (result == 'true') {
                            self.parent.insert_info(self.parent.messages[initial]['common']['clear_success']);
                            $("#event_config").datagrid('reload');
                        } else {
                            sqlite_message(result, self.parent.messages[initial]['common']['system_hint']);
                            $("#event_config").datagrid('reload');
                        }
                    }
                });

            }
        }]
    });

});