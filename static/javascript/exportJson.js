function get_tag(path, device_name, protocol) {
    tvalue = [];
    sql = "select * from '{0}' where deviceCode='{1}'".format(protocol, device_name);
    tag_value = selectsql(path, sql);
    tag_object = JSON.parse(tag_value);
    return tag_object;
}

function get_device(path, channel_name) {
    dvalue = [];
    sql = "select * from Device where channelName='{0}'".format(channel_name);
    device_value = selectsql(path, sql);
    device_object = JSON.parse(device_value);
    device_object.forEach(function(device) {
        device_data = {};
        device_data['protocolConf'] = device['protocolConf'];
        device_data['slaveID'] = device['slaveID'];
        device_data['deviceCode'] = device['text'];
        device_data['device'] = get_tag(path, device['text'], device['protocol'])
        dvalue.push(device_data);
    })
    return dvalue;
}

function get_server(path) {
    server_value = {};
    sql = "select * from feature";
    feature_value = selectsql(path, sql);
    feature_object = JSON.parse(feature_value);
    feature_object.forEach(function(feature) {
        server_value[feature['protocol']] = {};
        if (feature['protocol'] == 'modbus_slave') {
            feature_protocol = 'Modbus_Service'
            server_value[feature['protocol']]['com'] = JSON.parse(feature['com']);
        } else {
            feature_protocol = feature['protocol']
            server_value[feature['protocol']]['com'] = feature['com'];
        }
        server_value[feature['protocol']]['config'] = JSON.parse(feature['conf']);
        sql = "select * from '{0}'".format(feature_protocol);
        protocol_value = selectsql(path, sql);
        server_value[feature['protocol']]['task'] = JSON.parse(protocol_value);
    });
    return server_value;
}

function get_calculate(path) {
    sql = "select * from calculate";
    calculate_value = selectsql(path, sql);
    return JSON.parse(calculate_value);
}

function get_user(path) {
    sql = "select * from user_point";
    user_value = selectsql(path, sql);
    return JSON.parse(user_value);
}

function get_gwsetting(path) {
    sql = "select * from Gw";
    gw_value = selectsql(path, sql);
    gw_object = JSON.parse(gw_value);
    gw_object.forEach(function(gw) {
        gw['conf'] = JSON.parse(gw['conf']);
    })
    return gw_object[0];
}

// 导出设备文件成json
function export_json() {
    var dir = $('#text').textbox('getText'); // 选中的文件夹名称
    value = { "gateway": [], "operate": "config" };
    var select = $('#tt').tree('getSelected');
    value['server'] = get_server('Project/' + dir + '/' + select.text);
    value['calculate'] = get_calculate('Project/' + dir + '/' + select.text);
    value['user'] = get_user('Project/' + dir + '/' + select.text);
    value['gwsetting'] = get_gwsetting('Project/' + dir + '/' + select.text);
    sql = "select * from Channel";
    channel_value = selectsql('Project/' + dir + '/' + select.text, sql);
    channel_object = JSON.parse(channel_value);
    channel_object.forEach(function(channel) {
        channel_array = {};
        channel_conf = JSON.parse(channel['conf']);
        channel_array['commInterface'] = channel['com'];
        channel_array['channelCode'] = channel['text'];
        channel_array['watchTime'] = parseInt(channel['watchTime']);
        channel_array['retryCount'] = parseInt(channel['retryCount']);
        channel_array['readCount'] = parseInt(channel['readCount']);
        channel_array['writeCount'] = parseInt(channel['writeCount']);
        if (channel_conf[0] == messages[initial]['index_tree']['serialport']) {
            channel_array['comConfig'] = channel_conf.slice(2, 6).join(',');
            channel_array['protocolName'] = channel_conf[9];
            channel_array['comTimeout'] = channel_conf[6];
            channel_array['comInterval'] = channel_conf[7];
            channel_array['pollInterval'] = channel_conf[8];
        } else {
            channel_array['protocolName'] = channel_conf[4];
            channel_array['pollInterval'] = channel_conf[3];
        }
        if (['ModbusTCPClient', 'ModbusRTUClient', 'ModbusRTU_over_TCP'].indexOf(channel_array['protocolName']) != -1) {
            channel_array['continuousAddress'] = channel['continuousAddress'] === "false" ? false : true;
        }
        channel_array['channel'] = get_device('Project/' + dir + '/' + select.text, channel.text);
        value['gateway'].push(channel_array)
    })


    var blob = new Blob([JSON.stringify(value)], { type: "" });
    saveAs(blob, "config.json");
}