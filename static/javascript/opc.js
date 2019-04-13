/**
 * Created by Administrator on 2017/9/14.
 */
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
                $("#tg").localize();
                $("#opc_consider").panel({ title: i18next.t('opc.opc_operational_considerations') })
                $("#opc_title").panel({ title: i18next.t('opc.opc_list') })
                var tree_node = new Array();
                var opc_id = new Array();

                var opc_server = new Array();
                var opc_group = new Array();
                var opc_item = new Array();
                $('#tg').treegrid({
                    onClickRow: function(row) {
                        if (editingId != undefined) {
                            var t = $('#tg');
                            t.treegrid('endEdit', editingId);
                            editingId = undefined;
                            var persons = 0;
                            var rows = t.treegrid('getChildren');
                            for (var i = 0; i < rows.length; i++) {
                                var p = parseInt(rows[i].persons);
                                if (!isNaN(p)) {
                                    persons += p;
                                }
                            }
                        }
                    },
                    onDblClickRow: function(row) {
                        var link = []
                        var a = $('#tg').treegrid('getSelected');
                        var value = a.name
                        if (value != 'root') {

                            var idname = $('#tg').treegrid('getLevel', a.id);
                            link.push(value)
                            if (idname == 3) {
                                var name1 = $('#tg').treegrid('getParent', a.id);
                                link.push(name1.name)
                            }
                            if (idname == 4) {
                                var name1 = $('#tg').treegrid('getParent', a.id);
                                link.push(name1.name)
                                var name2 = $('#tg').treegrid('getParent', name1.id);
                                link.push(name2.name)
                            }
                            $.ajax({
                                type: 'post',
                                url: '/opc/opc_data',
                                data: { 'value': JSON.stringify(link) },
                                success: function(data) {
                                    var have = true
                                    for (key in data) {
                                        opcname = []
                                        opcname[data[key]] = data['value']
                                        if (key == 'server') {
                                            for (a in opc_server) {
                                                if ([data[key]] in opc_server[a]) {
                                                    have = false
                                                }
                                            }
                                            if (have) {
                                                opc_server.push(opcname)
                                            }
                                        } else if (key == 'group') {
                                            for (a in opc_group) {
                                                if ([data[key]] in opc_group[a]) {
                                                    have = false
                                                }
                                            }
                                            if (have) {
                                                opc_group.push(opcname)
                                            }
                                        } else if (key == 'item') {
                                            for (a in opc_item) {
                                                if ([data[key]] in opc_item[a]) {
                                                    have = false
                                                }
                                            }
                                            if (have) {
                                                opc_item.push(opcname)
                                            }
                                        }
                                    }
                                    $.messager.show({
                                        title: '提示',
                                        msg: "加载成功",
                                        timeout: 5000,
                                        showType: 'slide'
                                    });

                                    $('#tg').treegrid('reload');
                                }
                            });
                        };

                    },

                    loadFilter: function(data, parentId) {
                        if (data[0].name == 'undefined') {
                            return data
                        } else {
                            //tree_node = [];
                            var root = new Array();

                            function incrementClosure() {
                                var i = 0;

                                function increment() {
                                    i++;
                                    return i;
                                }
                                return increment;
                            };
                            var get_id = incrementClosure();
                            data.forEach(function(ele) {
                                tree_root = {};
                                tree_root['id'] = get_id();
                                tree_root['name'] = ele['name']; //root

                                tree_leve1 = new Array();
                                tree_root['children'] = tree_leve1;
                                var tree_level2_opc = ele['children'];

                                tree_level2_opc.forEach(function(element) {
                                    tree_leve1_item = {};
                                    tree_leve1_item['id'] = get_id();
                                    tree_leve1_item['name'] = element['name']; //ip
                                    tree_leve1.push(tree_leve1_item);

                                    tree_leve2_item = new Array();
                                    tree_leve1_item['children'] = tree_leve2_item;

                                    // opc_server = [{ '192.168.0.110': ['a', 'b', 'c'] }, { '192.168.0.107': ['1', '2', '3'] }]
                                    for (var w = 0; w < opc_server.length; w++) {

                                        for (server in opc_server[w]) {
                                            if (opc_server.length != 0 && server == tree_leve1_item['name']) {

                                                for (var k = 0; k < opc_server[w][server].length; k++) {

                                                    tree_leve3_item = {}
                                                    tree_leve3_item['id'] = get_id();
                                                    tree_leve3_item['name'] = opc_server[w][server][k]; //opc_server
                                                    tree_leve2_item.push(tree_leve3_item)

                                                    tree_leve4 = new Array();
                                                    tree_leve3_item['children'] = tree_leve4;

                                                    // opc_group = [{ 'b': ['c', 'd'] }]
                                                    for (var e = 0; e < opc_group.length; e++) {
                                                        for (group in opc_group[e]) {
                                                            if (opc_group.length != 0 && group == tree_leve3_item['name']) {
                                                                for (var f = 0; f < opc_group[e][group].length; f++) {
                                                                    tree_leve4_item = {}
                                                                    tree_leve4_item['id'] = get_id();
                                                                    tree_leve4_item['name'] = opc_group[e][group][f]; //opc_server
                                                                    tree_leve4.push(tree_leve4_item)

                                                                    tree_leve5 = new Array();
                                                                    tree_leve4_item['children'] = tree_leve5;


                                                                    // opc_item = [{ 'c': ['e', 'f'] }]
                                                                    for (var t = 0; t < opc_item.length; t++) {
                                                                        for (item in opc_item[t]) {
                                                                            if (opc_item.length != 0 && item == tree_leve4_item['name']) {
                                                                                for (var g = 0; g < opc_item[t][item].length; g++) {
                                                                                    tree_leve5_item = {}
                                                                                    tree_leve5_item['id'] = get_id();
                                                                                    tree_leve5_item['name'] = opc_item[t][item][g]; //opc_server
                                                                                    tree_leve5_item['id_value'] = tree_leve5_item['name'];
                                                                                    tree_leve5.push(tree_leve5_item)

                                                                                    //tree_leve5 = new Array();
                                                                                    //tree_leve4_item['children'] = tree_leve5;
                                                                                };
                                                                            };
                                                                        };
                                                                    };

                                                                };
                                                            };
                                                        };
                                                    };
                                                };
                                            };
                                        };
                                    };
                                });
                                tree_node = [];
                                tree_node.push(tree_root);
                            });
                            return tree_node
                        }
                    },
                    onContextMenu: function(e, row) {
                        var root_parent = $('#tg').treegrid('getParent', row.id);
                        e.preventDefault();
                        if (row.name == 'root') {
                            $('#root_row').menu('show', {
                                left: e.pageX,
                                top: e.pageY
                            });
                        } else if (row.children == null) {
                            $('#item_row').menu('show', {
                                left: e.pageX,
                                top: e.pageY
                            });
                        } else if (root_parent.name == 'root') {
                            $('#children_row').menu('show', {
                                left: e.pageX,
                                top: e.pageY
                            });
                        };
                    },
                    idField: 'id',
                    columns: [
                        [{
                            field: 'name',
                            title: 'OPC',
                            width: 300,
                            editor: {
                                type: 'validatebox',
                                options: {
                                    required: true,
                                    editable: false
                                }
                            }
                        }, {
                            field: 'id_value',
                            title: 'ID',
                            width: 200,
                            align: 'center',
                            editor: {
                                type: 'textbox',
                                options: {
                                    editable: false
                                }
                            }
                        },
                        //    {
                        //    field: '名称',
                        //    title: i18next.t('dlt.name'),
                        //    width: 100,
                        //    align: 'center',
                        //    editor: {
                        //        type: 'textbox'
                        //    }
                        //}
                        ]
                    ]
                });
                $('#savebtn').click(function() {
                    $.ajax({
                        type: 'post',
                        url: '/opc/save',
                        data: { 'value': JSON.stringify(tree_node) },
                        success: function(data) {
                            if (data.status == true) {
                                $.messager.show({
                                    title: i18next.t('total.message'),
                                    msg: i18next.t('total.Saved_successfully'),
                                    timeout: 5000,
                                    showType: 'slide'
                                });
                            } else {
                                $.messager.show({
                                    title: i18next.t('total.Error_message'),
                                    msg: i18next.t('total.Error'),
                                    timeout: 5000,
                                    showType: 'slide'
                                });
                            }

                        }
                    });
                })
            });
        })
});