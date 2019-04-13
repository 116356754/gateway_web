/* ================ 深拷贝 ================ */
function deepClone(initalObj) {
    var obj = {};
    obj = JSON.parse(JSON.stringify(initalObj));

    return obj;
}

function tag_dialog(server_type, point) {
    if (server_type == 'modbus_slave') {
        $("#tag_type").combobox({
            url: "../static/json/tag_type.json",
            valueField: 'text',
            textField: 'text',
            method: "GET",
            panelHeight: 'auto'
        });
        $("#modbustype").combobox({
            url: "../static/json/modslave.json",
            valueField: 'text',
            textField: 'text',
            method: "GET",
            panelHeight: 'auto'
        });
        $("#modbussort").combobox({
            url: "../static/json/modbussort.json",
            valueField: 'text',
            textField: 'text',
            method: "GET",
            panelHeight: 'auto'
        });
        $('#tag_type+.combo').show(); // 显示combobox
        $('#modbustype+.combo').show();
        $('#modbussort+.combo').show();
    } else {
        $('#tag_type+.combo').hide(); // 隐藏combobox
        $('#modbustype+.combo').hide();
        $('#modbussort+.combo').hide();
    }
    $('#tag_dialog').dialog({
        title: messages[initial]['tag_tree']['select_point'],
        closable: true,
        draggable: false,
        modal: true,
        buttons: [{
                text: messages[initial]['common']['ok'],
                iconCls: 'icon-ok',
                handler: function() {
                    tag_save(server_type, point)
                }
            },
            {
                text: messages[initial]['common']['cancel'],
                iconCls: 'icon-cancel',
                handler: function() {
                    $("#tag_dialog").dialog('close');
                }
            }
        ]
    });
    $("#tag_dialog").dialog('open'); //必须先显示，再弹出
}

// 在框体中显示可以勾选的tag点
function display_tag(server_type, point, AIBI) { // point为单个textbox的id
    var dir = $('#text').textbox('getText'); // 选中的文件夹名称
    var root = $('#tt').tree('getRoot');
    deep = deepClone(root['children'][0]['children'][0]['children']); // 深拷贝
    tag_data = tag_json(dir, deep, AIBI);
    $('#tag_tree').tree({
        data: tag_data,
        checkbox: true
    });
    tag_dialog(server_type, point)
}

//获取tree节点的等级
var easyui_tree_options = {
    length: 0, //层数
    getLevel: function(treeObj, node) { //treeObj为tree的dom对象，node为选中的节点
        while (node != null) {
            node = $(treeObj).tree('getParent', node.target)
            easyui_tree_options.length++;
        }
        var length1 = easyui_tree_options.length;
        easyui_tree_options.length = 0; //重置层数
        return length1;
    }
}

function tag_save(server_type, point) {
    data = $('#tag_tree').tree('getChecked', 'checked');
    var tag_data = [];
    data.forEach(function(item) {
        var level = easyui_tree_options.getLevel($('#tag_tree'), item);
        if (!item.children && level == 4) {
            var parent1 = $('#tag_tree').tree('getParent', item.target);
            var parent2 = $('#tag_tree').tree('getParent', parent1.target);
            var parent3 = $('#tag_tree').tree('getParent', parent2.target);
            tag_data.push([parent1.text + '.' + item.text, parent1.text, item.text, item.description, item.objectType])
        } else if (level == 2) {
            var parent1 = $('#tag_tree').tree('getParent', item.target);
            Non_collection_point = [messages[initial]['index']['calculate'], messages[initial]['index']['system'], messages[initial]['index']['user']];
            if (Non_collection_point.indexOf(parent1.text) != -1) {
                tag_data.push([item.deviceCode + '.' + item.text, item.deviceCode, item.text, item.description, item.objectType])
            }
        }
    });
    if (point) {
        $('#' + point).textbox('setValue', tag_data[0][0]); // 设置单个textbox的值
    }
    var win = document.getElementById(server_type).contentWindow;
    win.postMessage(JSON.stringify(tag_data), "*"); // postMessage
    $("#tag_dialog").dialog('close');
}

function tag_json(dir, tree_json, AIBI) {
    if (!AIBI) {
        delete tree_json[2];
        delete tree_json[3];
    }
    tree_json.forEach(function(level1) {
        if (level1['children']) {
            level1['children'].forEach(function(level2) {
                if (level2['children']) {
                    level2['children'].forEach(function(level3) {
                        protocol = level2['category'];
                        if (AIBI) {
                            sql = "select tagCode,description,objectType from {0} where deviceCode='{1}'".format(protocol, level3.text);
                        } else {
                            sql = "select tagCode,description,objectType from {0} where deviceCode='{1}' and objectType!='AI' and objectType!='BI'".format(protocol, level3.text);
                        }
                        result = selectsql('Project/' + dir + '/Gateway', sql);
                        result_object = JSON.parse(result);
                        level3['children'] = []
                        result_object.forEach(function(tag) {
                            tag['text'] = tag['tagCode'];
                            level3['children'].push(tag)
                        })
                    })
                }
            })
        } else if (level1['text'] == messages[initial]['index']['user']) {
            sql = "select deviceCode,tagCode,description,objectType from user_point";
            result = selectsql('Project/' + dir + '/Gateway', sql);
            result_object = JSON.parse(result);
            level1['children'] = []
            result_object.forEach(function(tag) {
                tag['text'] = tag['tagCode']
                level1['children'].push(tag)
            })
        } else if (level1['text'] == messages[initial]['index']['calculate']) {
            sql = "select deviceCode,tagCode,description,objectType from calculate";
            result = selectsql('Project/' + dir + '/Gateway', sql);
            result_object = JSON.parse(result);
            level1['children'] = []
            result_object.forEach(function(tag) {
                tag['text'] = tag['tagCode']
                level1['children'].push(tag)
            })
        } else if (level1['text'] == messages[initial]['index']['system']) {
            sql = "select deviceCode,tagCode,description,objectType from system_point";
            result = selectsql('Project/' + dir + '/Gateway', sql);
            result_object = JSON.parse(result);
            level1['children'] = []
            result_object.forEach(function(tag) {
                tag['text'] = tag['tagCode']
                level1['children'].push(tag)
            });
            sql = "select tagCode,description,objectType from DEVICE_STATUS_VIEW";
            result = selectsql('Project/' + dir + '/Gateway', sql);
            result_object = JSON.parse(result);
            result_object.forEach(function(tag) {
                tag['deviceCode'] = 'system';
                tag['text'] = tag['tagCode'];
                level1['children'].push(tag)
            });
        }
    });
    return tree_json
        //wirte_localfile('Project/' + dir + '/tag.json', JSON.stringify(tree_json))
}