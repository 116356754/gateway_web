/**
 * Created by Administrator on 2017/9/14.
 */
function downFile(url) {
    try {
        var elemIF = document.createElement('iframe');
        elemIF.src = url;
        elemIF.style.display = "none";
        document.body.appendChild(elemIF);
    } catch (e) {}
}

$(function() {
    language = getCookie("i18next")
    console.log(language)
    i18next
        .use(i18nextXHRBackend)
        .use(i18nextBrowserLanguageDetector)
        .init({
            lng: language,
            debug: true,
            backend: {
                loadPath: "/static/locales/{{lng}}/translation.json" // 加载资源的路径
            },
            detection: {
                caches: ['localStorage', 'cookie'],
                excludeCacheFor: ['cimode'], // languages to not persist (cookie, localStorage)

                // optional expire and domain for set cookie
                cookieMinutes: 30 * 24 * 60
            }
        }, function(err, t) {
            // init set content
            jqueryI18next.init(i18next, $);
            i18next.changeLanguage(language, function() {
                //$("#master_title").panel({ title: i18next.t('modbus_master.modbus_acquisition_table') })

                $("#modr_xls_config").edatagrid({
                    url: '/weight_modbus/get',
                    saveUrl: '/weight_modbus/save',
                    updateUrl: '/weight_modbus/update',
                    destroyUrl: '/weight_modbus/destroy',
                    fitColumns: true,
                    striped: true,
                    rownumbers: true,
                    onError: function(index, data) {
                        $.messager.show({
                            title: i18next.t('total.Error_message'),
                            msg: data.msg,
                            timeout: 5000,
                            showType: 'slide'
                        });
                    },
                    onSuccess: function(index, data) {
                        if (data.status == true) {
                            $.messager.show({
                                title: i18next.t('total.message'),
                                msg: i18next.t('total.Saved_successfully'),
                                timeout: 5000,
                                showType: 'slide'
                            });
                            //$("#modr_xls_config").edatagrid('reload');
                        } else {
                            $.messager.show({
                                title: '错误',
                                msg: data.msg,
                                timeout: 5000,
                                showType: 'slide'
                            });
                            $("#modr_xls_config").edatagrid('reload');
                        }
                    },
                    onDestroy: function(index, data) {
                        $.messager.show({
                            title: i18next.t('total.message'),
                            msg: i18next.t('total.Deleted_successfully'),
                            timeout: 5000,
                            showType: 'slide'
                        });
                        $("#modr_xls_config").edatagrid('reload');
                    },
                    //保存后执行
                    onAfterEdit: function(rowIndex, rowData, changs) {
                        //console.log(rowData)
                    },
                    idField: 'id',
                    columns: [
                        [{
                                field: 'id',
                                title: 'ID',
                                width: 100,
                                align: 'center',
                                editor: {
                                    type: 'textbox',
                                    options: {
                                        required: true,
                                        validType: "maxLength[15]"
                                    }
                                }
                            },
                            {
                                field: '串口',
                                title: '串口',
                                width: 100,
                                align: 'center',
                                editor: {
                                    type: 'combobox',
                                    options: {
                                        panelHeight: 'auto',
                                        method: 'get',
                                        url: Flask.url_for("static", { "filename": "json/serialport.json" }),
                                        editable: false,
                                        valueField: "text",
                                        textField: "text",
                                        required: true
                                    }
                                }
                            }, {
                                field: 'Modbus从站ID',
                                title: 'Modbus从站ID',
                                width: 100,
                                align: 'center',
                                editor: {
                                    type: 'numberbox',
                                    options: { required: true }
                                }
                            },
                            {
                                field: 'Modbus寄存器地址',
                                title: 'Modbus寄存器地址',
                                width: 100,
                                align: 'center',
                                editor: {
                                    type: 'validatebox',
                                    options: {
                                        required: true,
                                        validType: "eqLength[6]"
                                    }
                                }
                            },
                            {
                                field: '采集数据类型',
                                title: '采集数据类型',
                                width: 100,
                                align: 'center',
                                editor: {
                                    type: 'combobox',
                                    options: {
                                        panelHeight: 'auto',
                                        method: 'get',
                                        url: Flask.url_for("static", { "filename": "json/modbustype.json" }),
                                        editable: false,
                                        valueField: "text",
                                        textField: "text",
                                        required: true
                                    }
                                }
                            },
                            {
                                field: '延时时间',
                                title: '延时时间',
                                width: 100,
                                align: 'center',
                                editor: {
                                    type: 'numberbox',
                                    options: {
                                        required: true
                                    }
                                }
                            },
                            {
                                field: '放大倍数',
                                title: '放大倍数',
                                width: 100,
                                align: 'center',
                                editor: {
                                    type: 'textbox',
                                    options: {
                                        required: true
                                    }
                                }
                            },
                        ]
                    ],
                    toolbar: [{
                            text: i18next.t('total.Add_to'),
                            iconCls: 'icon-add',
                            handler: function() {
                                var row = $('#modr_xls_config').edatagrid('getRows').length;
                                if (row) {
                                    var keyvalue = $('#modr_xls_config').edatagrid('getData').rows[row - 1].key;
                                    keydata = keyvalue + 1
                                } else { keydata = 1 }
                                $('#modr_xls_config').edatagrid('addRow', {
                                    //index:0,#首行
                                    row: {
                                        key: keydata,
                                        '放大倍数': 1,
                                    }
                                });
                            }
                        }, '-', {
                            text: i18next.t('total.save'),
                            iconCls: 'icon-save',
                            handler: function() {
                                $('#modr_xls_config').edatagrid('saveRow');
                            }
                        }, '-', {
                            text: i18next.t('total.Undo'),
                            iconCls: 'icon-redo',
                            handler: function() {
                                $('#modr_xls_config').edatagrid('cancelRow');
                            }
                        }, '-', {
                            text: i18next.t('total.delete'),
                            iconCls: 'icon-remove',
                            handler: function() {
                                $("#modr_xls_config").edatagrid('destroyRow');
                            }
                        }, '-', {
                            text: i18next.t('total.Refresh'),
                            iconCls: 'icon-reload',
                            handler: function() {
                                $("#modr_xls_config").edatagrid('reload');
                            }
                        }
                        //, '-', {
                        //    text: i18next.t('total.Import_meter_configuration'),
                        //    iconCls: 'icon-excel',
                        //    handler: function() {
                        //        $("#mrx").dialog()
                        //    }
                        //}
                        //, '-', {
                        // text: '导出配置',
                        // iconCls: 'icon-excel',
                        // handler: function() {
                        // downFile('/modbus/modexcelexport')
                        // }
                        // }
                    ]
                });

            });
        })



});