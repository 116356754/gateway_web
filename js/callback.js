function showDownloadTip(title, content) {
    console.log(content)
    content = '<a href="javascript:void(0)" onclick="openurl(\'' + content + '\')">' + content + '</a>';
    console.log(content.length);
    var width = content.length + 180;
    $.messager.show({
        title: title,
        msg: content,
        width: width + 'px',
        timeout: 5000,
        showType: 'slide'
    });
}

function showTip(title, content) {
    var width = content.length + 250;
    $.messager.show({
        title: title,
        msg: content,
        timeout: 5000,
        width: width + 'px',
        showType: 'slide'
    });
}

function showUpdateConfirm(title, msg) {
    $.messager.confirm(title, msg, function(r) {
        if (r) {
            cfxApi.updateNow();
        }
    });
}

function udpLoging(msg) {
    console.log(msg);
}
// $.getJSON('../js/config.json').done(function(config) {});