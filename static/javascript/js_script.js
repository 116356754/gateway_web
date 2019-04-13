/**
 * Created by Administrator on 2017/9/14.
 */
function js_dialog(type, index, old_name) {
    var ele = self.parent.document.getElementById("js_preview");
    ele.value = "";
    self.parent.$('#runtype').combobox('setValue', "start");
    self.parent.$('#js_add').dialog({
        closable: false,
        draggable: false,
        modal: true,
        buttons: [{
                text: "确定",
                iconCls: 'icon-ok',
                handler: function() {
                    js_new(type, index, old_name)
                }
            },
            {
                text: "取消",
                iconCls: 'icon-cancel',
                handler: function() {
                    self.parent.$("#js_add").dialog('close');
                }
            }
        ]
    });
    //self.perent.$("#event_check").prop("checked", true);
    self.parent.$("#js_add").dialog('open'); //必须先显示，再弹出
}

// 获取事件窗口的数据
function event_data(type, old_name) {
    var dir = self.parent.$('#text').textbox('getText'); // 选中的文件夹名称
    var select = self.parent.$('#tt').tree('getSelected');
    path = 'Project/' + dir + '/Gateway';
    var enable = self.parent.$("#js_check").is(":checked");
    if (enable) {
        enable = 1;
    } else {
        enable = 0;
    }
    var name = self.parent.$('#js_name').textbox('getText');
    var runtype = self.parent.$('#runtype').combobox('getValue');
    var param = "";
    if (runtype == 'timer') {
        param = self.parent.$("#jscycle").numberbox("getValue");
    } else if (runtype == 'cron') {
        param = self.parent.$('#jstime').timespinner('getValue');
    }
    var ele = self.parent.document.getElementById("js_preview");
    script = ele.value;


    if (type == 'add') {
        sql = 'insert into js values ("{0}","{1}","{2}",nullif("{3}",""),"{4}")'.format(name, enable, runtype, param, script);
    } else {
        sql = 'update js set name="{0}",enable="{1}",runType="{2}",param=nullif("{3}",""),script="{4}" where name="{5}"'.format(name, enable, runtype, param, script, old_name);
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
function js_new(type, index, old_name) {
    status = event_data(type, old_name);
    if (status == 'true') {
        if (type == 'add') {
            self.parent.insert_info('添加成功');
            self.parent.$("#js_add").dialog('close');
        } else { // 双击修改
            self.parent.insert_info('修改成功');
            self.parent.$("#js_add").dialog('close');
        }
    }
    $("#js_script_config").datagrid('reload');
}

window.onmessage = function(e) {
    data = JSON.parse(e.data)
}

$(function() {

    $("#js_script_config").edatagrid({
        url: '../static/json/treegrid_data1.json',
        fitColumns: true,
        striped: true,
        rownumbers: true,
        loadFilter: function(data, parentId) {
            var dir = self.parent.$('#text').textbox('getText'); // 选中的文件夹名称
            var select = self.parent.$('#tt').tree('getSelected');
            path = 'Project/' + dir + '/Gateway';
            content = JSON.parse(selectsql(path, "select * from js"));
            content.forEach(function(tag) {
                if (tag['enable']) {
                    tag['enable'] = "启用"
                } else {
                    tag['enable'] = "不启用"
                };
                if (tag['runType'] == 'start') {
                    tag['runType'] = "开机启动"
                } else if (tag['runType'] == 'cron') {
                    tag['runType'] = "定时"
                } else if (tag['runType'] == 'timer') {
                    tag['runType'] = "循环"
                };
            })
            return content;
        },
        onDestroy: function(index, data) {
            var dir = self.parent.$('#text').textbox('getText'); // 选中的文件夹名称
            var select = self.parent.$('#tt').tree('getSelected');
            sql = "delete from js where name='{0}'".format(data['name']);
            result = deletesql('Project/' + dir + '/Gateway', sql)
            if (result == 'true') {
                self.parent.insert_info(self.parent.messages[initial]['common']['successfully_deleted'])
            } else {
                sqlite_message(result, self.parent.messages[initial]['common']['system_hint']);
                $("#js_script_config").datagrid('reload');
            }
        },
        // 禁用编辑
        //onBeginEdit: function(index, row) {
        //    $("#js_script_config").datagrid('cancelEdit', index);
        //},
        //保存后执行
        onDblClickRow: function(index, row) {
            data = $("#js_script_config").datagrid('getSelected');
            js_dialog('modify', index, data.name);
            if (data.enable == "启用") {
                self.parent.$("#js_check").prop("checked", true);
            } else {
                self.parent.$("#js_check").prop("checked", false);
            }
            self.parent.$('#js_name').textbox('setText', data.name);
            if (data.runType == '开机启动') {
                self.parent.$('#runtype').combobox('setValue', "start");
                self.parent.document.getElementById("jstime_div").style.display = 'none';
                self.parent.document.getElementById("jscycle_div").style.display = 'none';
            } else if (data.runType == '循环') {
                self.parent.$('#runtype').combobox('setValue', "timer");
                self.parent.document.getElementById("jstime_div").style.display = 'none';
                self.parent.document.getElementById("jscycle_div").style.display = '';
                self.parent.$('#jscycle').numberbox('setValue', data.param);
            } else if (data.runType == '定时') {
                self.parent.$('#runtype').combobox('setValue', "cron");
                self.parent.document.getElementById("jstime_div").style.display = '';
                self.parent.document.getElementById("jscycle_div").style.display = 'none';
                self.parent.$('#jstime').timespinner('setValue', data.param);
            }
            var ele = self.parent.document.getElementById("js_preview");
            ele.value = data.script;

            $("#js_script_config").datagrid('cancelEdit', index);
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
                    field: 'runType',
                    title: '执行方式',
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
                js_dialog('add', 0, 'null')
            }
        }, '-', {
            text: self.parent.messages[initial]['common']['remove'],
            iconCls: 'icon-remove',
            handler: function() {
                $("#js_script_config").edatagrid('destroyRow');
            }
        }, '-', {
            text: self.parent.messages[initial]['index']['Empty'],
            iconCls: 'icon-empty',
            handler: function() {
                $.messager.confirm(self.parent.messages[initial]['common']['system_hint'], self.parent.messages[initial]['common']['if_clear_table'], function(r) {
                    if (r) {
                        var dir = self.parent.$('#text').textbox('getText'); // 选中的文件夹名称
                        var select = self.parent.$('#tt').tree('getSelected');
                        sql = "DELETE FROM js";
                        result = truncatesql('Project/' + dir + '/Gateway', sql, 'VACUUM');
                        if (result == 'true') {
                            self.parent.insert_info(self.parent.messages[initial]['common']['clear_success']);
                            $("#js_script_config").datagrid('reload');
                        } else {
                            sqlite_message(result, self.parent.messages[initial]['common']['system_hint']);
                            $("#js_script_config").datagrid('reload');
                        }
                    }
                });

            }
        }]
    });

});