function file_download(file_name, dir) { // FTP下载配置文件
    ip = get_baseurl();
    cfxApi.uploadFileFtp('/home/', 'lm.db', getCurrentDirectory() + '\\Project\\' + dir + '\\Gateway.db', function(status) {
        if (status) {
            cfxApi.uploadFolderFtp('/home/mqtt/ssl', 'mqtt/ssl/', function(status) {
                if (status) {
                    cfxApi.uploadFolderFtp('/home/mqtt/realtime', 'mqtt/realtime/', function(status) {
                        if (status) {
                            cfxApi.uploadFolderFtp('/home/mqtt/write', 'mqtt/write/', function(status) {
                                if (status) {
                                    determine_database_complate();
                                } else {
                                    insert_info(messages[initial]['index']['download_fail'])
                                }
                            });
                        } else {
                            insert_info(messages[initial]['index']['download_fail'])
                        }
                    });
                } else {
                    insert_info(messages[initial]['index']['download_fail'])
                }
            });
        } else {
            insert_info(messages[initial]['index']['download_fail'])
        }
    })
}

function determine_database_complate() { // 通过http接口验证下载的数据库是否完整
    $.ajax({
        type: 'get',
        url: 'http://' + ip + '/db_verificat',
        timeout: 5000,
        success: function(data) {
            if (data) {
                insert_info(messages[initial]['index']['download_success']);
                program_reboot(ip);
            } else {
                insert_info(messages[initial]['index']['download_fail']);
            }
        },
        error: function() {
            $.messager.alert(messages[initial]['common']['system_hint'], messages[initial]['index']['connectip_fail'].format(ip), "info");
        }
    });
}

var cycle = 1;
// 下载工程时网关密码、版本验证
function download_valid_passwd(file_name, dir) {
    value = get_baseurl();
    $.ajax({
        type: 'get',
        url: 'http://' + value + '/get_version',
        timeout: 2000,
        success: function(data) {
            tool_version = document.getElementById("version").innerHTML;
            passwd = $('#enter_passwd').textbox('getValue');
            if (data.password == passwd) {
                n = (tool_version.split('.')).length - 1;
                if (n == 3) { // 每个版本修改之后出一个小版本，也可以下载到大版本网关中
                    tool_version = tool_version.substring(0, tool_version.lastIndexOf('.'))
                }
                if ('Version ' + data.Version == tool_version) { // 软件版本
                    root = $('#tt').tree('getRoot');
                    var gwVersion = '';
                    root['children'].forEach(function(gwDevice) {
                        if (gwDevice.text == file_name) {
                            gwVersion = gwDevice.version
                        }
                    })
                    if (data.Model == gwVersion) { // 硬件版本
                        file_download(file_name, dir)
                    } else {
                        $.messager.alert(messages[initial]['common']['system_hint'], messages[initial]['index']['hardware_different'].format(gwVersion, data.Model), "info");
                        insert_info(messages[initial]['index']['download_fail'])
                    }
                } else {
                    $.messager.alert(messages[initial]['common']['system_hint'], messages[initial]['index']['software_different'].format(tool_version, data.Version), "info");
                    insert_info(messages[initial]['index']['download_fail'])
                }
            } else {
                $.messager.alert(messages[initial]['common']['system_hint'], messages[initial]['index']['error_passwd'], "info");
                insert_info(messages[initial]['index']['download_fail'])
            }
        },
        error: function(data) {
            $.messager.alert(messages[initial]['common']['system_hint'], messages[initial]['index']['connectip_fail'].format(value), "info");
            if (cycle == 3) {
                cycle = 1;
                file_download(file_name, dir);
            } else {
                cycle += 1;
            }
        }
    });
}

function enter_password(file_name, dir) {
    $('#enter_passwd').textbox('setValue', '');
    display_dialog('enter_passwd_dialog', messages[initial]['index']['verify_password']);
    $('#enter_passwd_dialog').dialog({
        buttons: [{
                text: messages[initial]['common']['ok'],
                iconCls: 'icon-ok',
                handler: function() {
                    $('#enter_passwd_dialog').dialog('close');
                    download_valid_passwd(file_name, dir)
                }
            },
            {
                text: messages[initial]['common']['cancel'],
                iconCls: 'icon-cancel',
                handler: function() {
                    $('#enter_passwd_dialog').dialog('close')
                }
            }
        ]
    });
}


// 显示选择需要下载的工程的对话框
function download_project_to_gw(dir) {
    $('#download_gw_tree').tree('reload');
    $('#download_gw_search').dialog({
        title: messages[initial]['index']['Download_project'],
        closable: false,
        draggable: false,
        modal: true,
        buttons: [{
            text: messages[initial]['index']['add_device'],
            iconCls: 'icon-set',
            handler: function() {
                display_dialog('dlg-url-set', messages[initial]['index']['gw_connect']);
                bURL = get_baseurl(); // 网关地址
                $('#gw_ip').textbox({
                    value: bURL
                });
            }
        }, {
            text: messages[initial]['index']['download'],
            iconCls: 'icon-download',
            handler: function() {
                var root = $('#tt').tree('getRoot');
                if (root['children'] && root['children'][0]['text']) {
                    filegw_text = root['children'][0]['text'];
                    value = get_baseurl();
                    $.messager.confirm(messages[initial]['common']['system_hint'], messages[initial]['index']['download_to_gw'].format(value), function(r) {
                        if (r) {
                            enter_password(filegw_text, dir);
                            $("#download_gw_search").dialog('close');
                            stop_search();
                        }
                    })
                } else {
                    $.messager.alert(messages[initial]['common']['system_hint'], messages[initial]['index']['please_new_gwdevice'], "info");
                }
            }
        }, {
            text: messages[initial]['common']['cancel'],
            iconCls: 'icon-cancel',
            handler: function() {
                $("#download_gw_search").dialog('close');
                stop_search();
            }
        }]
    });
    $("#download_gw_search").dialog('open');
    stop_search(); // 停止搜索
    document.getElementById("download_search_label").style.display = ''; // 显示正在搜索网关标签
    window.setTimeout('add_gw()', 500)
}

// 点击页面中“下载工程”按钮
function download_project() {
    var dir = $('#text').textbox('getText'); // 选中的文件夹名称
    if (dir == '') {
        $.messager.alert(messages[initial]['common']['system_hint'], messages[initial]['index']['please_openpro'], "info")
    } else {
        download_project_to_gw(dir);
    }
}