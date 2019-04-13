/**
 * Created by Administrator on 2017/9/14.
 */
var protocol = '';
var aisle = '';
var calculate = '';
var system = '';
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

function set_tree(list_data) {
    $('#list').tree({
        data: list_data,
        onClick: function(row) {
                var level = easyui_tree_options.getLevel(this, row);
                data_ajax(row, level)
            }
            //,
            //onContextMenu: function (e, row) {
            //    var level = easyui_tree_options.getLevel(this, row);
            //    if (level == 3) {
            //        $('#aisle_log').menu('show', {
            //            left: e.pageX,
            //            top: e.pageY
            //        });
            //    }
            //}
    })
}

$(function() {
    value = get_baseurl();
    $.ajax({
        type: 'get',
        url: 'http://' + value + '/get_config',
        timeout: 5000,
        success: function(data) {
            data['channel'].forEach(function(channel) {
                channel['children'] = [];
                channel['iconCls'] = 'icon-channel';
            });
            data['device'].forEach(function(device) {
                data['channel'].forEach(function(channel) {
                    if (channel['channelName'] == device['channelName']) {
                        device['iconCls'] = 'icon-meter';
                        device['text'] = device['deviceName'];
                        channel['children'].push(device);
                        channel['text'] = channel['channelName'] + '(' + channel['aisle'] + ')'
                        return false;
                    }
                })
            })

            list_data = [{ "text": self.parent.messages[initial]['real_data']['whole'], "iconCls": "icon-new-device", "children": [] }];

            list_data[0]['children'] = data['channel']
            list_data[0]['children'].push({ "text": 'calculate', 'iconCls': 'icon-calculation-point' })
            list_data[0]['children'].push({ "text": 'user', 'iconCls': 'icon-user-point' })
            list_data[0]['children'].push({ "text": 'system', 'iconCls': 'icon-system-point' })
            set_tree(list_data);
            page_data = new Array();
            for (var tag in data['data']['val']) {
                tree_leve1_item = data['data']['val'][tag];
                if (tree_leve1_item['timestamp']) {
                    var time = new Date(tree_leve1_item['timestamp'] * 1000);
                    tree_leve1_item['timestamp'] = DateUtil.dateToStr("yyyy-MM-dd HH:mm:ss", time);
                }
                if (tree_leve1_item['status'] == 'Error') {
                    tree_leve1_item['val'] = null
                }
                page_data.push(tree_leve1_item)
            }
            app.values = page_data;
            app.orderType = 2;

        },
        error: function() {
            $.messager.alert(self.parent.messages[initial]['common']['system_hint'], self.parent.messages[initial]['index']['connectip_fail'].format(value), "info");
        }
    });
    setInterval('app.greet()', 10000);

    // $("#history_data").edatagrid({
    //     url: '../static/json/treegrid_data1.json',
    //     fitColumns: true,
    //     striped: true,
    //     pagination: true,
    //     rownumbers: true,
    //     loadFilter: function(data, parentId) {
    //         console.log(data)
    //         return data
    //     },
    //     idField: 'id',
    //     columns: [
    //         [{
    //                 field: 'id',
    //                 title: self.parent.messages[initial]['common']['name'],
    //                 width: 100,
    //                 align: 'center',
    //                 editor: {
    //                     type: 'textbox',
    //                     options: {
    //                         required: true,
    //                         editable: false
    //                     }
    //                 }
    //             },
    //             {
    //                 field: 'val',
    //                 title: 'value',
    //                 width: 100,
    //                 align: 'center',
    //                 editor: {
    //                     type: 'textbox',
    //                     options: {
    //                         required: true,
    //                         editable: false
    //                     }
    //                 }
    //             }, {
    //                 field: 'status',
    //                 title: 'status',
    //                 width: 100,
    //                 align: 'center',
    //                 editor: {
    //                     type: 'textbox',
    //                     options: {
    //                         required: true,
    //                         editable: false
    //                     }
    //                 }
    //             }, {
    //                 field: 'timestamp',
    //                 title: 'timestamp',
    //                 width: 100,
    //                 align: 'center',
    //                 editor: {
    //                     type: 'textbox',
    //                     options: {
    //                         required: true,
    //                         editable: false
    //                     }
    //                 }
    //             }
    //         ]
    //     ]
    // });
});

function check(children) {
    var Rename = new Array();
    for (var i = 0; i < children.length; i++) {
        Rename.push(children[i].text)
    }
    return Rename;
}

function get_real_db_func(deviceName, status) { // status为true是则为选中的是通道
    value = get_baseurl();
    $.ajax({
        type: 'get',
        url: 'http://' + value + '/get_real_db',
        data: { 'deviceName': deviceName, 'channel': status },
        timeout: 5000,
        success: function(data) {
            deviceData = data['val']
            page_data = new Array();
            for (var tag in deviceData) {
                tree_leve1_item = deviceData[tag];
                if (tree_leve1_item['timestamp']) {
                    var time = new Date(tree_leve1_item['timestamp'] * 1000);
                    tree_leve1_item['timestamp'] = DateUtil.dateToStr("yyyy-MM-dd HH:mm:ss", time);
                }
                if (tree_leve1_item['status'] == 'Error') {
                    tree_leve1_item['val'] = null
                }
                page_data.push(tree_leve1_item)
            }
            app.values = page_data;
            app.orderType = 2;
        }
    })
}

function data_ajax(select, level) {
    value = get_baseurl();
    if (level == 1) {
        get_real_db_func("", false);
    } else if (level == 2) {
        if (select['iconCls'] == 'icon-channel') { // 通道子节点
            device_array = new Array();
            select['children'].forEach(function(device) {
                device_array.push(device['text'])
            })
            get_real_db_func(JSON.stringify(device_array), true);
        } else { // 计算点、用户点、系统点
            get_real_db_func(select['text'], false);
        }
    } else if (level == 3) { // 设备子节点
        get_real_db_func(select['text'], false);
    }
}