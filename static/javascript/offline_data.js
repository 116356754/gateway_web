/**
 * Created by Administrator on 2017/9/14.
 */
var protocol = '';
var aisle = '';
var calculate = '';
//获取tree节点的等级
var easyui_tree_options = {
    length: 0, //层数
    getLevel: function(treeObj, node) { //treeObj为tree的dom对象，node为选中的节点
        while (node != null) {
            node = $(treeObj).tree('getParent', node.target);
            easyui_tree_options.length++;
        }
        var length1 = easyui_tree_options.length;
        easyui_tree_options.length = 0; //重置层数
        return length1;
    }
};

$(function() {

});

function ajax_id() {
    value = get_baseurl();
    $.ajax({
        type: 'get',
        url: 'http://' + value + '/get_storage_id',
        timeout: 5000,
        success: function(data) {
            ids = JSON.parse(data);
            tag_data = [{ 'text': 'root', 'children': [] }];
            ids.forEach(function(id) {
                tag_data[0]['children'].push({ 'text': id })
            });
            $('#tag_tree').tree({
                data: tag_data,
                checkbox: true
            });
            $('#tag_dialog').dialog({
                title: '选择点',
                closable: true,
                draggable: false,
                modal: true,
                buttons: [{
                        text: "确定",
                        iconCls: 'icon-new-project',
                        handler: function() {
                            datas = $('#tag_tree').tree('getChecked', 'checked');
                            datas.forEach(function(data) {
                                var level = easyui_tree_options.getLevel('#tag_tree', data);
                                if (level == 2) {
                                    var ele = document.getElementById("id_list");
                                    if (ele.value == '') {
                                        ele.value = data.text;
                                    } else {
                                        ele.value = ele.value + '\n' + data.text;
                                    }
                                }
                            });
                            $("#tag_dialog").dialog('close');
                        }
                    },
                    {
                        text: "取消",
                        iconCls: 'icon-cancel',
                        handler: function() {
                            $("#tag_dialog").dialog('close');
                        }
                    }
                ]
            });
            $("#tag_dialog").dialog('open'); //必须先显示，再弹出
        },
        error: function() {
            $.messager.alert(self.parent.messages[initial]['common']['system_hint'], self.parent.messages[initial]['index']['connectip_fail'].format(value), "info");
        }
    });
}

function data_ajax(type) {
    value = get_baseurl();
    var date = $('#time1').datetimebox('getValue');
    $.ajax({
        type: 'get',
        url: 'http://' + value + '/API/V1/history',
        data: { "timestamp": date },
        timeout: 5000,
        success: function(data) {
            if (data == '参数错误') {
                $.messager.alert(self.parent.messages[initial]['common']['system_hint'], self.parent.messages[initial]['offline_data']['error'], "info")
            } else if (data == '[]') {
                $.messager.alert(self.parent.messages[initial]['common']['system_hint'], self.parent.messages[initial]['offline_data']['no_storage'].format(date), "info")
            } else {
                data = JSON.parse(data);
                data.forEach(function(tag) {
                    tag['id'] = tag['deviceCode'] + '_' + tag['tagCode'];
                    var time = new Date(tag['timestamp'] * 1000);
                    tag['timestamp'] = DateUtil.dateToStr("yyyy-MM-dd HH:mm:ss", time)
                })
                app.values = data;
            }
        },
        error: function() {
            $.messager.alert(self.parent.messages[initial]['common']['system_hint'], self.parent.messages[initial]['index']['connectip_fail'].format(value), "info");
        }
    });
};

function download_sqlite() {
    fileName = cfxApi.download_cycledata('storage');
    console.log(fileName)
    if (fileName != 'cancel') {
        cfxApi.downloadFileFtp('/home/web', 'cycle_data.db', fileName, function(status) {
            console.log(status)
        })
    }
}