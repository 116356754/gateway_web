function program_reboot(ip) {
    $.ajax({
        type: 'post',
        url: 'http://' + ip + '/program_reboot',
        data: "true",
        timeout: 5000,
        success: function(data) {
            if (data) {
                insert_info(messages[initial]['index']['reboot_success'])
            } else {
                insert_info("Reboot fail:" + data)
            }
        },
        error: function() {
            $.messager.alert(messages[initial]['common']['system_hint'], messages[initial]['index']['connectip_fail'].format(ip), "info");
        }
    });
}

// 添加设备成功之后向相应的tree中添加
function add_tree(bURL) {
    var dialog_title = $('#dlg-url-set').dialog('options').title;
    iplist = new Array();
    if (dialog_title == messages[initial]['index']['add_device']) {
        var root = $('#gw_tree').tree('getRoot');
        root['children'].forEach(function(ip) {
            iplist.push(ip.text)
        });
        if (iplist.indexOf(bURL) == -1) {
            $('#gw_tree').tree('append', {
                parent: root.target,
                data: [{
                    iconCls: 'icon-device',
                    text: bURL
                }]
            });
        } else {
            $.messager.alert(messages[initial]['common']['system_hint'], messages[initial]['gwonline']['ipaddr_already'], "info");
        }
    } else if (dialog_title == messages[initial]['index']['gw_connect']) {
        var root = $('#download_gw_tree').tree('getRoot');
        root['children'].forEach(function(ip) {
            iplist.push(ip.text)
        });
        if (iplist.indexOf(bURL) == -1) {
            $('#download_gw_tree').tree('append', {
                parent: root.target,
                data: [{
                    iconCls: 'icon-device',
                    text: bURL
                }]
            });
        } else {
            $.messager.alert(messages[initial]['common']['system_hint'], messages[initial]['gwonline']['ipaddr_already'], "info");
        }
    }
}

// ip和http的验证
function ip_check() {
    bURL = document.getElementById('gw_ip').value;
    var re = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/; //正则表达式
    if (re.test(bURL)) {
        if (RegExp.$1 < 256 && RegExp.$2 < 256 && RegExp.$3 < 256 && RegExp.$4 < 256) {
            setBaseUrl(bURL);
            //http验证
            $.ajax({
                type: 'get',
                url: 'http://' + bURL + '/get_version',
                timeout: 2000,
                error: function(data) {
                    $.messager.alert(messages[initial]['common']['system_hint'], messages[initial]['gwonline']['gw_connect_fail'], "info")
                },
                success: function(data) {
                    insert_info(messages[initial]['gwonline']['gw_connect_success']);
                    add_tree(bURL);

                    $("#dlg-url-set").dialog('close');
                }
            });
        }
    }
}