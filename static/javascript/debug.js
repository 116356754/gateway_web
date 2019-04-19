var ws = null;
var gwip = get_baseurl();

setInterval(function() //开启循环：每2分钟检测一次系统日志高度是否达到50000
    {
        log_height = $('#log-container').get(0).scrollHeight;
        if (log_height > 50000) {
            $("#log-container").empty();
        }
    }, 120000);

function main_debug() { // 调试页面的第一个选项卡，在点击“调试模式”的按钮和选中“调试”选项卡的时候会触发
    if (ws) {
        ws.close();
        ws = null;
    }
    change_htcomhex();
    // 指定websocket路径,此地址建议根据用js动态获取
    ws = new WebSocket('ws://' + gwip + '/ws?processType=collect');
    ws.onmessage = function(event) {
        if (showmessage) { // 是否只显示报文
            if (event.data.search("Tx") != -1 || event.data.search("Rx") != -1) {
                $("#log-container").append(event.data + '<br>').css("color", "#aaa");
            }
        } else {
            $("#log-container").append(event.data + '<br>').css("color", "#aaa");
        }

        // 接收服务端的实时日志并添加到HTML页面中（error显示红色）
        // $("#log-container").append(event.data + '<br>').css("color", "#aaa");
        // if (event.data.search("ERROR") != -1) {
        //     $("#log-container").append(event.data + '<br>').css("color", "#AA0000");
        // } else {
        //     $("#log-container").append(event.data + '<br>').css("color", "#aaa");
        // }
        // 是否滚动
        if (checked) {
            // 滚动条滚动到最低部
            $("#log-container").scrollTop($('#log-container').get(0).scrollHeight - $("#log-container").height());
        }
    };
    ws.onclose = function() {
        console.log("collect客户端已断开连接");
        // ws = null;
    };
    ws.onerror = function(evt) {
        console.log(evt.data);
    };
}

$(document).ready(function() {
    $.ajax({
        type: 'get',
        url: 'http://' + gwip + '/get_version',
        timeout: 5000,
        success: function(data) {
            $("#Serial_testport").combobox({
                valueField: 'text',
                textField: 'text',
                data: [{ "text": "com1", "selected": true }, { "text": "com2" }, { "text": "com3" }, { "text": "com4" }],
                panelHeight: 'auto'
            });
        },
        error: function() {
            $.messager.alert(self.parent.messages[initial]['common']['system_hint'], self.parent.messages[initial]['index']['connectip_fail'].format(gwip), "info");
        }
    });

    $("#ip_label").html($("#ip_label").html() + gwip);
    main_debug();

    $('#linux_contocol').tabs({
        onSelect: function(title, index) {
            if (title == self.parent.messages[initial]['index']['debug']) {
                main_debug();
            }
        }
    });
});

function send_order() {
    if (ws) {
        ws.close();
        ws = null;
    }
    change_htcomhex();
    // 指定websocket路径,此地址建议根据用js动态获取
    ip = $("#order").textbox("getValue");
    ws = new WebSocket('ws://' + gwip + '/ws?processType=ping&ip=' + ip);
    ws.onmessage = function(event) {
        $("#ping_callback").append(event.data + '<br>').css("color", "#aaa");
    };
    ws.onclose = function() {
        console.log("ping客户端已断开连接");
        // ws = null;
    };
    ws.onerror = function(evt) {
        console.log(evt.data);
    };
}

function clear_order() {
    $('#order').textbox('clear');
}

// 使用ws启动htcomhex，等待输入报文
function start_htcomhex() {
    if (ws) {
        ws.close();
        ws = null;
    }
    if ($("#open_serial").linkbutton('options').disabled == false) {
        com = $('#Serial_testport').combobox('getValue');
        baud = $('#Serial_test_baud').combobox('getValue');
        parity = $('#Serial_test_parity').combobox('getValue');
        ws = new WebSocket('ws://' + gwip + '/ws?processType=htcomhex&com=' + com + '&baud=' + baud + '&parity=' + parity);
        ws.onmessage = function(event) {
            $("#htcomhex_callback").append(event.data + '<br>').css("color", "#aaa");
        };
        ws.onclose = function() {
            console.log("htcomhex客户端已断开连接");
            // ws = null;
        };
        ws.onerror = function(evt) {
            console.log(evt.data);
        };
        $('#message_button').linkbutton('enable');
        $('#change_button').linkbutton('enable');
        $('#open_serial').linkbutton('disable');
    }
}

// 用指定的串口打开htcomhex
function change_htcomhex() {
    if ($("#change_button").linkbutton('options').disabled == false) {
        if (ws) {
            ws.close();
            // ws = null;
        }
        $('#change_button').linkbutton('disable');
        $('#message_button').linkbutton('disable');
        $('#open_serial').linkbutton('enable');
    }
}

// 串口测试发送报文
function send_message() {
    if ($("#message_button").linkbutton('options').disabled == false) {
        message = $('#message').combobox('getText');
        if (message != '') {
            console.log(message)
            ws.send(message + '\n');
            // ws.onmessage = function(evt) {
            //     if (evt['data'].indexOf('Rx') != -1 || evt['data'].indexOf('Tx') != -1) {
            //         console.log(evt['data'])
            //     }
            // }
            // ws.onclose = function() {
            //     console.log("客户端已断开连接");
            // };
            // ws.onerror = function(evt) {
            //     console.log(evt.data);
            // };
        } else {
            $.messager.alert(self.parent.self.parent.messages[initial]['common']['system_hint'], self.parent.self.parent.messages[initial]['gwonline']['enter_message'], "info")
        }

    }
}

function clear_message() {
    $('#message').textbox('clear');
}