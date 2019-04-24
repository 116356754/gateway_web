/**
 * Created by Administrator on 2018/1/4.
 */
net_path = cfxApi.getCurrentDirectory() + '/yaffs2/net.conf';
net2_path = cfxApi.getCurrentDirectory() + '/yaffs2/net2.conf';
resolv_path = cfxApi.getCurrentDirectory() + '/etc/resolv.conf';
log_path = cfxApi.getCurrentDirectory() + '\\log\\';

project_path = cfxApi.getCurrentDirectory() + '\\Project\\';
//upload_tree_path = '../../../web/static/json';
upload_tree_path = 'web/static/json';

//js文件中用到的treegrid_data1.json的地址
function get_treepath(dir) {
    var treepath_array = new Array();
    if (dir != '') {
        treepath_array.push('Project/' + dir + '/treegrid_data1.json');
        treepath_array.push('../../collector/bin/Release/Project/' + dir + '/treegrid_data1.json');
        // treepath_array.push('../../Project/' + dir + '/treegrid_data1.json');

        treepath_array.push('Project/' + dir + '/server_task.json');
        treepath_array.push('Project/' + dir + '/feature.json')
    } else {
        treepath_array.push('../../../web/static/json/treegrid_data1.json');
        treepath_array.push('../static/json/treegrid_data1.json')
    }
    return treepath_array
}

// 获取cfxApi运行路径
function getCurrentDirectory() {
    return cfxApi.getCurrentDirectory();
}

// 打开网页
function openurl(url) {
    cfxApi.shellOpen(url);
}

// 打开帮助文档
function openchm() {
    if (initial == 'zh-CN') {
        cfxApi.openchm('LMGateway帮助文档');
    } else {
        cfxApi.openchm('LMGateway Help Document');
    }
}

// baseurl地址
function get_baseurl() {
    bURL = cfxApi.getBaseUrl();
    var w = bURL.indexOf('baseUrl');
    value = bURL.slice(w + 10, -2);
    return value
}

// 设置baseurl地址
function setBaseUrl(url) {
    cfxApi.setBaseUrl(url);
}

// 停止搜索
function stop_search() {
    cfxApi.stopSearch()
}

// 同步读取文件
function readFileSync(path) {
    return cfxApi.readFileSync(path);
}

// 同步读取二进制文件
function readbinFileSync(path) {
    return cfxApi.readbinFileSync(path);
}

// 复制文件
function copyfile(path1, path2) {
    var status = cfxApi.copyFile(path1, path2);
    return status;
}

//读ini文件
function read_iniFile(path) {
    return cfxApi.readIniFileSync(path);
}

//写本地ini文件:Key-value
function write_kvFile(path, section, key, value) {
    var status = cfxApi.writeKVIniFileSync(path, section, key, value);
    return status;
}

//写本地ini文件:Section
function write_sectionFile(path, module_name, content) {
    var status = cfxApi.writeSecIniFileSync(path, module_name, content);
    return status;
}

// 写文件
function wirte_localfile(path, content) {
    cfxApi.writeFile(path, content, function(status) {
        // alert(status);
        return status
    });
}

// modbus_slave获取所有id
function slave_filter(data, module_name) {
    collect_module = ['modbus_master'];
    value = new Array();
    for (var a = 0; a < collect_module.length; a++) {
        for (var i = 0; i < data[collect_module[a]].length; i++) {
            module_value = {}
            module_value['id'] = data[collect_module[a]][i]['id']
            value.push(module_value)
        }
    }
    return value
}

// 获取驱动名称、通道名称和设备名称的数组
function get_tree() {
    var select = self.parent.$("#tt").tree('getSelected');
    var select_1 = self.parent.$("#tt").tree('getParent', select.target);
    var select_2 = self.parent.$("#tt").tree('getParent', select_1.target);
    var tree_array = new Array();
    tree_array.push(select.text);
    tree_array.push(select_1.text);
    tree_array.push(select_2.text);
    return tree_array;
}

// 读取和修改tree中设备的task参数
function get_task(data, tree_array, type, value) {
    for (var a = 0; a < data.length; a++) {
        if (data[a].text == tree_array[2]) {
            for (var b = 0; b < data[a].children.length; b++) {
                if (data[a].children[b].text == tree_array[1]) {
                    for (var c = 0; c < data[a].children[b].children.length; c++) {
                        if (data[a].children[b].children[c].text == tree_array[0]) {
                            if (type == 'read') {
                                return data[a].children[b].children[c].task;
                            } else if (type == 'write') {
                                data[a].children[b].children[c].task = value;
                                return data;
                            }
                        }
                    }
                }
            }
        }
    }
    return null;
}

/* ================ 深拷贝 ================ */
function deepClone(initalObj) {
    var obj = {};
    obj = JSON.parse(JSON.stringify(initalObj));

    return obj;
}

String.prototype.format = function(args) {
    var result = this;
    if (arguments.length > 0) {
        if (arguments.length == 1 && typeof(args) == "object") {
            for (var key in args) {
                if (args[key] != undefined) {
                    var reg = new RegExp("({" + key + "})", "g");
                    result = result.replace(reg, args[key]);
                }
            }
        } else {
            for (var i = 0; i < arguments.length; i++) {
                if (arguments[i] != undefined) {
                    var reg = new RegExp("({)" + i + "(})", "g");
                    result = result.replace(reg, arguments[i]);
                }
            }
        }
    }
    return result;
};

function get_select() {
    var tab = self.parent.$('#pro_device').tabs('getSelected');
    var index = self.parent.$('#pro_device').tabs('getTabIndex', tab);
    if (index == 2) {
        var select = self.parent.$('#template_tree').tree('getSelected');
        path = 'Template/Template';
        return { 'path': path, 'select': select, 'index': index };
    } else if (index == 0) {
        var select = self.parent.$('#tt').tree('getSelected');
        var dir = self.parent.$('#text').textbox('getText'); // 选中的文件夹名称
        path = 'Project/' + dir + '/Gateway';
        return { 'path': path, 'select': select, 'index': index };
    }
}


function sqlite_message(result, title) {
    if (result.indexOf('NOT NULL') != -1) {
        $.messager.alert(title, 'Excel中“名称”、“对象索引号”和“单位”不能为空！', "info")
    } else if (result.indexOf('UNIQUE') != -1) {
        $.messager.alert(title, '名称重复！', "info")
    } else {
        $.messager.alert(title, result, "info")
    }
}

// 采集页面中点击添加按钮是自动生成名称
function create_name(value) {
    content = JSON.parse(value);
    for (var k = content.length; k > 0; k--) {
        last_name = content[k - 1].tagCode;
        if (!isNaN(last_name.slice(3))) {
            name = 'tag' + (parseInt(last_name.slice(3)) + 1).toString();
            if (name.length < 7) {
                for (var i = name.length; i < 7; i++) {
                    name = 'tag0' + name.slice(3)
                }
            }
            return name;
        }
    }
    return 'tag0001';
}

// 新建通道时自动生成名称
function add_channel_name(value) {
    content = JSON.parse(value);
    for (var k = content.length; k > 0; k--) {
        last_name = content[k - 1].text;
        if (!isNaN(last_name.slice(8))) {
            name = 'Channel_' + (parseInt(last_name.slice(8)) + 1).toString();
            return name;
        }
    }
    return 'Channel_1';
}

// 新建设备时自动生成名称
function add_device_name(value) {
    content = JSON.parse(value);
    for (var k = content.length; k > 0; k--) {
        last_name = content[k - 1].text;
        if (!isNaN(last_name.slice(7))) {
            name = 'Device_' + (parseInt(last_name.slice(7)) + 1).toString();
            return name;
        }
    }
    return 'Device_1';
}

// sqlite 创建数据库
function createsql(path) {
    return cfxApi.createsql(path);
}

// sqlite insert
function insertsql(path, sql) {
    status = cfxApi.insertsql(path, sql);
    return status;
}

// sqlite select
function selectsql(path, sql) {
    status = cfxApi.selectsql(path, sql);
    return status;
}

// sqlite delete
function deletesql(path, sql) {
    status = cfxApi.deletesql(path, sql);
    return status;
}

// sqlite update
function updatesql(path, sql) {
    status = cfxApi.updatesql(path, sql);
    return status;
}

// sqlite 批量插入
function bulk_insert(path, content) {
    result = cfxApi.bulk_insert(path, content);
    return result;
}

//sqlite 清空表
function truncatesql(path, sql, arg) {
    status = cfxApi.truncatesql(path, sql, arg);
    return status;
}

// jsontoexcel
function jsontoexcel(json, name) {
    cfxApi.jsontoexcel(json, name)
}

// 获取文件夹下的文件信息
function scanDir(path) {
    content = cfxApi.scanDir(path);
    return content;
}

// 获取文件夹下文件夹的名称数组
function scanPro(path) {
    return cfxApi.scanPro(path);
}

// 删除文件
function deletefile(path) {
    return cfxApi.deletefile(path);
}

// 列出文件夹下的文件名
function scanFile(path) {
    return cfxApi.scanFile(path);
}

// 删除文件夹
function deletedir(path) {
    return cfxApi.deletedir(path);
}

// 新建文件夹
function createdir(path) {
    return cfxApi.createdir(path);
}

// 修改文件名称
function moveFile(name1, name2) {
    cfxApi.moveFile(name1, name2);
}

function foo(callback) {
    // cfxApi.message_monitor("192.168.1.230", function(ip) {
    //     callback(ip);
    // });


    cfxApi.startSearch(function(ip) {
        callback(ip);
        // $('#gw_tree').tree('append', {
        //     parent: root.target,
        //     data: [{
        //         iconCls: 'icon-device',
        //         text: ip
        //     }]
        // });
    });
}

function websocket_connect(ele) {
    ws = new WebSocket('ws://192.168.1.230:8080');
    ws.onopen = function() {
        console.log("客户端已连接");
    }
    ws.onmessage = function(evt) {
        ele.value += evt.data;
    }
    ws.onclose = function() {
        console.log("客户端已断开连接");
    };
    ws.onerror = function(evt) {
        ele.innerHTML += "<li>" + evt.data + "</li>";
    };
}


// 扩展easyui dialog动态添加按钮
$.extend($.fn.dialog.methods, {
    bindButtonEvents: function(jq, param) {
        return jq.each(function() {
            var dialog = $(this);
            dialog.parent().on('click', '.dialog-button a', function(e) {
                var text = $(this).linkbutton('options').text;
                var method = param[text];
                if (method) { method(); }
            });
        });
    }
});



// 显示easyui dialog
function display_dialog(module_id, title) {
    $('#' + module_id).dialog({
        title: title,
        closed: false,
        draggable: true,
        modal: true
    });
    $('#' + module_id).dialog('open'); //必须先显示，再弹出
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

// 获取id为tt的tree的父节点
function get_tt_parents(parent_number) {
    var selected = $('#tt').tree('getSelected');
    if (parent_number == 1) {
        return $('#tt').tree('getParent', selected.target);
    } else if (parent_number == 2) {
        parent1 = $('#tt').tree('getParent', selected.target);
        return $('#tt').tree('getParent', parent1.target);
    } else if (parent_number == 3) {
        parent1 = $('#tt').tree('getParent', selected.target);
        parent2 = $('#tt').tree('getParent', parent1.target);
        return $('#tt').tree('getParent', parent2.target);
    } else if (parent_number == 4) {
        parent1 = $('#tt').tree('getParent', selected.target);
        parent2 = $('#tt').tree('getParent', parent1.target);
        parent3 = $('#tt').tree('getParent', parent2.target);
        return $('#tt').tree('getParent', parent3.target);
    }
}

// 判断字符串是否是json
function isJsonString(str) {
    try {
        if (typeof JSON.parse(str) == "object") {
            return true;
        }
    } catch (e) {}
    return false;
}