// 生成excel的json数据
function creat_json_excel(dir, file_text) {
    excel_content = {};
    path = 'Project/' + dir + '/' + file_text;
    sql = "select text,protocol from Device";
    device_list = JSON.parse(selectsql(path, sql));
    device_list.forEach(function(device) {
        console.log(device)
        sql = "select * from '{0}' where deviceCode='{1}'".format(device['protocol'], device['text']);
        excel_content[device['text']] = JSON.parse(selectsql(path, sql));
    });
    json = JSON.stringify(excel_content)
    jsontoexcel(json, 'config.xls')

}




// 导出到Excel
function excel_save() {
    var dir = $('#text').textbox('getText'); // 选中的文件夹名称
    if (dir == '') {
        $.messager.alert(messages[initial]['common']['system_hint'], messages[initial]['index']['please_openpro'], "info")
    } else {
        $('#file_gw_tree').tree('reload');
        $('#download_gw').dialog({
            title: messages[initial]['index']['Download_project'],
            closable: false,
            draggable: false,
            modal: true,
            buttons: [{
                text: messages[initial]['common']['ok'],
                iconCls: 'icon-download',
                handler: function() {
                    file = $('#file_gw_tree').tree('getSelected');
                    if (file == null) {
                        $.messager.alert(messages[initial]['common']['system_hint'], messages[initial]['index']['select_gwdevice'], "info")
                    } else {
                        creat_json_excel(dir, file.text);
                        $("#download_gw").dialog('close');
                    }
                }
            }, {
                text: messages[initial]['common']['cancel'],
                iconCls: 'icon-cancel',
                handler: function() {
                    $("#download_gw").dialog('close');
                }
            }]
        });
        window.setTimeout('add_filegw()', 100)
    }
}