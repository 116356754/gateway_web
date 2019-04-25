// 验证是否选择了罗米云
function mqtt_check(used, path, mqtt_object) {
    if (!used) {
        $.messager.alert(self.parent.messages[initial]['common']['system_hint'], self.parent.messages[initial]['http']['mqtt_enable'].format(self.parent.luomiyun_name), "info");
    } else {
        $.messager.confirm(self.parent.messages[initial]['common']['system_hint'], self.parent.messages[initial]['index']['upload_to_yun'].format(mqtt_object['base']['ip']), function(r) {
            if (r) {
                // http://192.168.0.72:8080/bem/uploadFile
                var url = '';
                // if (mqtt_object['ip'] == '47.99.189.9') {
                //     url = "http://47.99.189.9:80/bem/uploadFile" // 云端为80端口
                // } else {
                url = "http://" + mqtt_object['base']['ip'] + ":80/ssc/uploadFile"
                    // }
                result = cfxApi.upload_to_yun(url, path, mqtt_object['base']['clientid']);
                if (result == '上传成功') {
                    self.parent.insert_info(self.parent.messages[initial]['index']['upload_success']);
                } else {
                    $.messager.alert(self.parent.messages[initial]['common']['system_hint'], result, "info");
                    self.parent.insert_info(self.parent.messages[initial]['index']['upload_fail']);
                }
            }
        })
    }
}


// 点击“上传云端”按钮
function upload_cloud() {
    var dir = self.parent.$('#text').textbox('getText'); // 选中的文件夹名称
    if (dir != '') {
        var root = self.parent.$('#tt').tree('getRoot');
        if (root != null && root['children'] && root['children'][0]) {
            content = selectsql('Project/' + dir + '/Gateway', "select used,config from iot where name='LUOMIYUN'");
            content_object = JSON.parse(content);
            mqtt_object = JSON.parse(content_object[0]['config']);
            used = JSON.parse(content_object[0]['used']);
            mqtt_check(used, getCurrentDirectory() + '/Project/' + dir + '/Gateway.db', mqtt_object);
        } else {
            $.messager.alert(self.parent.messages[initial]['common']['system_hint'], self.parent.messages[initial]['index']['please_new_gwdevice'], "info");
        }
    } else {
        $.messager.alert(self.parent.messages[initial]['common']['system_hint'], self.parent.messages[initial]['index']['please_openpro'], "info")
    }
}