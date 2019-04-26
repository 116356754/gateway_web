// default
var oemData = {
    "zh-CN": {
        "gw_type": [{ "text": "MODBUS网关", "id": "MODBUS Gateway", "selected": true },
            { "text": "BACNET网关", "id": "BACNET Gateway" },
            { "text": "MQTT网关", "id": "MQTT Gateway" },
            { "text": "IoT网关", "id": "IoT Gateway" },
            { "text": "OPC UA网关", "id": "OPC UA Gateway" },
            { "text": "全功能网关", "id": "All Function Gateway" }
        ],
        "gw_version": {
            "MODBUS Gateway": [{ 'text': 'LM Gateway201-M', "selected": true }, { 'text': 'LM Gateway202-M' },
                { 'text': 'LM Gateway414-M' }
            ],
            "BACNET Gateway": [{ 'text': 'LM Gateway201-B', "selected": true }, { 'text': 'LM Gateway202-B' },
                { 'text': 'LM Gateway414-B' }
            ],
            "OPC UA Gateway": [{ 'text': 'LM Gateway201-OPC UA', "selected": true }, { 'text': 'LM Gateway202-OPC UA' },
                { 'text': 'LM Gateway414-OPC UA' }
            ],
            "MQTT Gateway": [{ 'text': 'LM Gateway201-MQTT', "selected": true }, { 'text': 'LM Gateway202-MQTT' },
                { 'text': 'LM Gateway203-MQTT' },
                { 'text': 'LM Gateway401-MQTT' }, { 'text': 'LM Gateway402-MQTT' },
                { 'text': 'LM Gateway412-MQTT' }, { 'text': 'LM Gateway414-MQTT' }
            ],
            "IoT Gateway": [{ 'text': 'LM Gateway201-IoT', "selected": true }, { 'text': 'LM Gateway202-IoT' },
                { 'text': 'LM Gateway203-IoT' }, { 'text': 'LM Gateway414-IoT' }
            ],
            "All Function Gateway": [{ 'text': 'LM Gateway201-A', "selected": true }, { 'text': 'LM Gateway202-A' },
                { 'text': 'LM Gateway414-A' }
            ]
        },
        "slave": {
            "MODBUS Gateway": ["modbus_slave"],
            "BACNET Gateway": ["BACnet_Service"],
            "OPC UA Gateway": ["OPC_UA"],
            "MQTT Gateway": ["mqtt", "luomiyun"],
            "IoT Gateway": ["modbus_slave", "mqtt", "luomiyun"],
            "All Function Gateway": ["modbus_slave", "BACnet_Service", "OPC_UA", "mqtt", "luomiyun"]
        },
        "companyName": "黄山罗米测控技术有限公司",
    },
    "en-US": {
        "gw_type": [{ "text": "MODBUS Gateway", "id": "MODBUS Gateway", "selected": true },
            { "text": "BACNET Gateway", "id": "BACNET Gateway" },
            { "text": "MQTT Gateway", "id": "MQTT Gateway" },
            { "text": "IoT Gateway", "id": "IoT Gateway" },
            { "text": "OPC UA Gateway", "id": "OPC UA Gateway" },
            { "text": "All Function Gateway", "id": "All Function Gateway" }
        ],
        "gw_version": {
            "MODBUS Gateway": [{ 'text': 'LM Gateway201-M', "selected": true }, { 'text': 'LM Gateway202-M' },
                { 'text': 'LM Gateway414-M' }
            ],
            "BACNET Gateway": [{ 'text': 'LM Gateway201-B', "selected": true }, { 'text': 'LM Gateway202-B' },
                { 'text': 'LM Gateway414-B' }
            ],
            "OPC UA Gateway": [{ 'text': 'LM Gateway201-OPC UA', "selected": true }, { 'text': 'LM Gateway202-OPC UA' },
                { 'text': 'LM Gateway414-OPC UA' }
            ],
            "MQTT Gateway": [{ 'text': 'LM Gateway201-MQTT', "selected": true }, { 'text': 'LM Gateway202-MQTT' },
                { 'text': 'LM Gateway203-MQTT' },
                { 'text': 'LM Gateway401-MQTT' }, { 'text': 'LM Gateway402-MQTT' },
                { 'text': 'LM Gateway412-MQTT' }, { 'text': 'LM Gateway414-MQTT' }
            ],
            "IoT Gateway": [{ 'text': 'LM Gateway201-IoT', "selected": true }, { 'text': 'LM Gateway202-IoT' },
                { 'text': 'LM Gateway203-IoT' }, { 'text': 'LM Gateway414-IoT' }
            ],
            "All Function Gateway": [{ 'text': 'LM Gateway201-A', "selected": true }, { 'text': 'LM Gateway202-A' },
                { 'text': 'LM Gateway414-A' }
            ]
        },
        "slave": {
            "MODBUS Gateway": ["modbus_slave"],
            "BACNET Gateway": ["BACnet_Service"],
            "OPC UA Gateway": ["OPC_UA"],
            "MQTT Gateway": ["mqtt", "luomiyun"],
            "IoT Gateway": ["modbus_slave", "mqtt", "luomiyun"],
            "All Function Gateway": ["modbus_slave", "BACnet_Service", "OPC_UA", "mqtt", "luomiyun"]
        },
        "companyName": "Huangshan Luomi Measurement and Control Technology Co., Ltd.",
    },
    "companyUrl": "http://www.lmgateway.com",
    "logo": "../static/images/1.jpg",
    "201": "201",
    "202": "202",
    "203": "203",
    "401": "401",
    "402": "402",
    "412": "412",
    "414": "414",
    "-M": "-M",
    "-MQTT": "-MQTT",
    "-IoT": "-IoT",
    "-B": "-B",
    "-OPC UA": "-OPC UA",
    "-A": "-A"
}
var help_oem = false
var upload_oem = false // 为true时隐藏帮助按钮和上传云端按钮
var luomiyun_name = "IoTDDC"
var mqtt_default = { "used": false, "base": { "ip": "192.168.1.10", "port": 1883, "keep_alive": 60, "timeout": 60, "clean_session": false, "username": "", "password": "", "clientid": "gw1" }, "ssl": null, "topics": { "realtime": { "topicList": [{ "topic": "lm/gw/status/gw1", "freq": 10 }], "qos": 0, "retain": false }, "history": { "topic": "lm/gw/history/gw1", "qos": 0, "retain": false }, "ctrlResponse": { "topic": "lm/gw/ctrlResponse/gw1", "qos": 0, "retain": false }, "ctrlRequest": { "topic": "lm/gw/ctrlRequest/gw1", "qos": 0 }, "inquire": { "topic": "lm/gw/inquire/gw1", "qos": 0 }, "inquireResponse": { "topic": "lm/gw/inquireResponse/gw1", "qos": 0, "retain": false }, "reboot": { "topic": "lm/gw/reboot/gw1", "qos": 0 }, "lastwill": { "enable": false, "topic": "lm/gw/lastwill/gw1", "qos": 0, "retain": false, "message": "" } }, "mode": { "filter": ["statusGood"], "format": "default", "timeformat": "2006-01-02 15:04:05", "write": "default" } }

//惟则
// var oemData = {
//     "en-US": {
//         "gw_type": [{ "text": "MODBUS Gateway", "selected": true }],
//         "gw_version": {
//             "MODBUS Gateway": [{ 'text': 'WiGT Gateway414-M', "selected": true }]
//         },
//         "slave": {
//             "MODBUS Gateway": ["modbus_slave"]
//         }
//     },
//     "companyName": "Wonthe Information Technologies (Shanghai) Co.,Ltd",
//     "companyUrl": "http://www.baidu.com",
//     "logo": "../static/images/2.png",
//     "201": "201",
//     "202": "202",
//     "203": "203",
//     "401": "401",
//     "402": "402",
//     "412": "412",
//     "414": "414",
//     "-M": "-M",
//     "-MQTT": "-MQTT",
//     "-B": "-B",
//     "-OPC UA": "-OPC UA",
//     "-A": "-A"
// }
// var help_oem = false
// var upload_oem = false // 为true时隐藏帮助按钮和上传云端按钮
// var mqtt_default = { "used": false, "base": { "ip": "192.168.1.10", "port": 1883, "keep_alive": 60, "timeout": 60, "clean_session": false, "username": "", "password": "", "clientid": "gw1" }, "ssl": null, "topics": { "realtime": { "topicList": [{ "topic": "lm/gw/status/gw1", "freq": 10 }], "qos": 0, "retain": false }, "history": { "topic": "lm/gw/history/gw1", "qos": 0, "retain": false }, "ctrlResponse": { "topic": "lm/gw/ctrlResponse/gw1", "qos": 0, "retain": false }, "ctrlRequest": { "topic": "lm/gw/ctrlRequest/gw1", "qos": 0 }, "inquire": { "topic": "lm/gw/inquire/gw1", "qos": 0 }, "inquireResponse": { "topic": "lm/gw/inquireResponse/gw1", "qos": 0, "retain": false }, "reboot": { "topic": "lm/gw/reboot/gw1", "qos": 0 }, "lastwill": { "enable": false, "topic": "lm/gw/lastwill/gw1", "qos": 0, "retain": false, "message": "" } }, "mode": { "filter": ["statusGood"], "format": "default", "timeformat": "2006-01-02 15:04:05", "write": "default" } }

// 南京安可讯
// var oemData = {
//     "zh-CN": {
//         "gw_type": [{ "text": "MODBUS网关", "selected": true }, { "text": "MQTT网关" }, { "text": "OPC UA网关" }],
//         "gw_version": {
//             "MODBUS网关": [{ 'text': 'ARG-MB101-MODBUS', "selected": true }, { 'text': 'ARG-MB102-MODBUS' },
//                 { 'text': 'ARG-MB401-MODBUS' }
//             ],
//             "OPC UA网关": [{ 'text': 'ARG-MB101-OPCUA', "selected": true }, { 'text': 'ARG-MB102-OPCUA' },
//                 { 'text': 'ARG-MB401-OPCUA' }
//             ],
//             "MQTT网关": [{ 'text': 'ARG-MB101-MQTT', "selected": true }, { 'text': 'ARG-MB102-MQTT' },
//                 { 'text': 'ARG-MB103-MQTT' }, { 'text': 'ARG-MB401-MQTT' }
//             ]
//         },
//         "slave": {
//             "MODBUS网关": ["modbus_slave"],
//             "OPC UA网关": ["OPC_UA"],
//             "MQTT网关": ["mqtt", "luomiyun"]
//         },
//         "companyName": "南京安可讯物联科技有限公司",
//     },
//     "companyUrl": "http://arglink.com/",
//     "logo": "../static/images/1.jpg",
//     "201": "101",
//     "202": "102",
//     "203": "103",
//     "414": "401",
//     "-M": "-MODBUS",
//     "-MQTT": "-MQTT",
//     "-OPC UA": "-OPCUA"
// }
// var help_oem = true
// var upload_oem = false // 为true时隐藏帮助按钮和上传云端按钮
// var luomiyun_name = "ARGLINK Cloud"
// var mqtt_default = { "used": false, "base": { "ip": "192.168.1.10", "port": 1883, "keep_alive": 60, "timeout": 60, "clean_session": false, "username": "", "password": "", "clientid": "gw1" }, "ssl": null, "topics": { "realtime": { "topicList": [{ "topic": "arglink/gw/status/gw1", "freq": 10 }], "qos": 0, "retain": false }, "history": { "topic": "arglink/gw/history/gw1", "qos": 0, "retain": false }, "ctrlResponse": { "topic": "arglink/gw/ctrlResponse/gw1", "qos": 0, "retain": false }, "ctrlRequest": { "topic": "arglink/gw/ctrlRequest/gw1", "qos": 0 }, "inquire": { "topic": "arglink/gw/inquire/gw1", "qos": 0 }, "inquireResponse": { "topic": "arglink/gw/inquireResponse/gw1", "qos": 0, "retain": false }, "reboot": { "topic": "arglink/gw/reboot/gw1", "qos": 0 }, "lastwill": { "enable": false, "topic": "arglink/gw/lastwill/gw1", "qos": 0, "retain": false, "message": "" } }, "mode": { "filter": ["statusGood"], "format": "default", "timeformat": "2006-01-02 15:04:05", "write": "default" } }