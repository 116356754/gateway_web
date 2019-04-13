var client = null;

//连接服务器并注册连接成功处理事件  
function onConnect() {
    console.log("onConnected");
    s = "{time:" + new Date().Format("yyyy-MM-dd hh:mm:ss") + ", onConnected()}";
    console.log(s);
    topic = 'abcd';
    client.subscribe(topic);

    message = new Paho.MQTT.Message("aaaaa");
    message.destinationName = "/abc";
    client.send(message);
}

//注册消息接收处理事件  
function onConnectionLost(responseObject) {
    console.log(responseObject);
    s = "{time:" + new Date().Format("yyyy-MM-dd hh:mm:ss") + ", onConnectionLost()}";
    console.log(s);
    if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost:" + responseObject.errorMessage);
        console.log("连接已断开");
    }
}

function onMessageArrived(message) {
    s = "{time:" + new Date().Format("yyyy-MM-dd hh:mm:ss") + ", onMessageArrived()}";
    console.log(s);
    console.log("收到消息:" + message.payloadString);
}

function send() {
    var s = 'sss';
    if (s) {
        s = "{time:" + new Date().Format("yyyy-MM-dd hh:mm:ss") + ", content:" + (s) + ", from: web console}";
        message = new Paho.MQTT.Message(s);
        message.destinationName = topic;
        client.send(message);
        document.getElementById("msg").value = "";
    }
}

var count = 0;

function start(dir, topic) {
    window.tester = window.setTimeout(function() {
        if (client.isConnected) {
            // 读取数据库文件返回数组
            s = readbinFileSync(getCurrentDirectory() + '/Project/' + dir + '/' + filegw_text + '.db')
            console.log(s)
            console.log(s.length)
            console.log(topic)
            a = [1, 2, 3, 4, 5]
            message = new Paho.MQTT.Message(JSON.stringify(s));
            message.destinationName = topic;
            client.send(message);
            // client.disconnect();
        }
    }, 1000);
}

function stop() {
    window.clearInterval(window.tester);
}

Date.prototype.Format = function(fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[
            k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

// 点击“上传云端”按钮
// function upload_cloud() {
//     // $("#db_file").click();
//     var hostname = '47.99.189.9',
//         // var hostname = '192.168.0.120',
//         port = 8090,
//         clientId = 'admin/admin',
//         timeout = 5,
//         keepAlive = 100,
//         cleanSession = false,
//         ssl = false,
//         userName = 'admin',
//         password = 'admin',
//         topic = 'lm/tool/config/';
//     client = new Paho.MQTT.Client(hostname, port, clientId);
//     //建立客户端实例  
//     var options = {
//         invocationContext: {
//             host: hostname,
//             port: port,
//             path: client.path,
//             clientId: clientId
//         },
//         timeout: timeout,
//         keepAliveInterval: keepAlive,
//         cleanSession: cleanSession,
//         useSSL: ssl,
//         userName: userName,
//         password: password,
//         onSuccess: onConnect,
//         onFailure: function(e) {
//             console.log(e);
//             s = "{time:" + new Date().Format("yyyy-MM-dd hh:mm:ss") + ", onFailure()}";
//             console.log(s);
//         }
//     };
//     client.connect(options);

//     client.onConnectionLost = onConnectionLost;

//     //注册连接断开处理事件  
//     client.onMessageArrived = onMessageArrived;

//     var dir = $('#text').textbox('getText'); // 选中的文件夹名称
//     if (dir != '') {
//         var root = $('#tt').tree('getRoot');
//         if (root['children'] && root['children'][0]['text']) {
//             filegw_text = root['children'][0]['text'];
//             content = selectsql('Project/' + dir + '/' + filegw_text, "select conf from feature where protocol='mqtt'");
//             content_object = JSON.parse(content);
//             mqtt_object = JSON.parse(content_object[0]['conf']);
//             console.log(mqtt_object['clientid'])
//             start(dir, 'lm/tool/config/' + mqtt_object['clientid']);
//         } else {
//             $.messager.alert(messages[initial]['common']['system_hint'], messages[initial]['index']['please_new_gwdevice'], "info");
//         }
//     } else {
//         $.messager.alert(messages[initial]['common']['system_hint'], messages[initial]['index']['please_openpro'], "info")
//     }
// }

function send_file() {
    var fileObj = document.getElementById("db_file").files[0]; // js 获取文件对象
    if (document.getElementById("db_file").value.slice(-3) == '.db') {
        var url = "http://192.168.0.66/dbUpload"; // 接收上传文件的后台地址

        var form = new FormData(); // FormData 对象
        form.append("file", fileObj); // 文件对象

        xhr = new XMLHttpRequest(); // XMLHttpRequest 对象
        xhr.open("post", url, true); //post方式，url为服务器请求地址，true 该参数规定请求是否异步处理。
        xhr.onload = uploadComplete; //请求完成
        xhr.onerror = uploadFailed; //请求失败

        xhr.upload.onprogress = progressFunction; //【上传进度调用方法实现】
        xhr.upload.onloadstart = function() { //上传开始执行方法
            ot = new Date().getTime(); //设置上传开始时间
            oloaded = 0; //设置上传开始时，以上传的文件大小为0
        };

        xhr.send(form); //开始上传，发送form数据
    } else {
        $.messager.alert(messages[initial]['common']['system_hint'], '请选择工程文件', "info")
    }
}

//上传成功响应
function uploadComplete(evt) {
    //服务断接收完文件返回的结果

    var data = JSON.parse(evt.target.responseText);
    if (data.success) {
        alert("上传成功！");
    } else {
        alert("上传失败！");
    }

}

//上传失败
function uploadFailed(evt) {
    alert("上传失败！");
}
//取消上传
function cancleUploadFile() {
    xhr.abort();
}

//上传进度实现方法，上传过程中会频繁调用该方法
function progressFunction(evt) {
    var progressBar = document.getElementById("progressBar");
    var percentageDiv = document.getElementById("percentage");
    // event.total是需要传输的总字节，event.loaded是已经传输的字节。如果event.lengthComputable不为真，则event.total等于0
    if (evt.lengthComputable) { //
        progressBar.max = evt.total;
        progressBar.value = evt.loaded;
        percentageDiv.innerHTML = Math.round(evt.loaded / evt.total * 100) + "%";
    }
    var time = document.getElementById("time");
    var nt = new Date().getTime(); //获取当前时间
    var pertime = (nt - ot) / 1000; //计算出上次调用该方法时到现在的时间差，单位为s
    ot = new Date().getTime(); //重新赋值时间，用于下次计算
    var perload = evt.loaded - oloaded; //计算该分段上传的文件大小，单位b
    oloaded = evt.loaded; //重新赋值已上传文件大小，用以下次计算
    //上传速度计算
    var speed = perload / pertime; //单位b/s
    var bspeed = speed;
    var units = 'b/s'; //单位名称
    if (speed / 1024 > 1) {
        speed = speed / 1024;
        units = 'k/s';
    }
    if (speed / 1024 > 1) {
        speed = speed / 1024;
        units = 'M/s';
    }
    speed = speed.toFixed(1);
    //剩余时间
    var resttime = ((evt.total - evt.loaded) / bspeed).toFixed(1);
    time.innerHTML = '，速度：' + speed + units + '，剩余时间：' + resttime + 's';
    if (bspeed == 0) time.innerHTML = '上传已取消';
}

// 点击“上传云端”按钮
function mqtt_cloud() {
    var dir = $('#text').textbox('getText'); // 选中的文件夹名称
    if (dir != '') {
        var root = $('#tt').tree('getRoot');
        if (root['children'] && root['children'][0]['text']) {
            filegw_text = root['children'][0]['text'];
            content = selectsql('Project/' + dir + '/' + filegw_text, "select conf from feature where protocol='mqtt'");
            content_object = JSON.parse(content);
            mqtt_object = JSON.parse(content_object[0]['conf']);
            send_file();
        } else {
            $.messager.alert(messages[initial]['common']['system_hint'], messages[initial]['index']['please_new_gwdevice'], "info");
        }
    } else {
        $.messager.alert(messages[initial]['common']['system_hint'], messages[initial]['index']['please_openpro'], "info")
    }
}