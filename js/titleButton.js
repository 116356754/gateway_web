//删除Tabs
// function closeTab(menu, type) {
//     var allTabs = $("#tt").tabs('tabs');
//     var allTabtitle = [];
//     $.each(allTabs, function(i, n) {
//         var opt = $(n).panel('options');
//         if (opt.closable)
//             allTabtitle.push(opt.title);
//     });
//     var curTabTitle = $(menu).data("tabTitle");
//     var curTabIndex = $("#tt").tabs("getTabIndex", $("#tt").tabs("getTab", curTabTitle));
//     switch (type) {
//         case 1:
//             $("#tt").tabs("close", curTabIndex);
//             break;
//         case 2:
//             for (var i = 0; i < allTabtitle.length; i++) {
//                 $('#tt').tabs('close', allTabtitle[i]);
//             }
//             break;
//         case 3:
//             for (var i = 0; i < allTabtitle.length; i++) {
//                 if (curTabTitle != allTabtitle[i])
//                     $('#tt').tabs('close', allTabtitle[i]);
//             }
//             $('#tt').tabs('select', curTabTitle);
//             break;
//         case 4:
//             // console.log(curTabIndex);
//             for (var i = curTabIndex + 1; i < allTabtitle.length; i++) {
//                 $('#tt').tabs('close', allTabtitle[i]);
//             }
//             $('#tt').tabs('select', curTabTitle);
//             break;
//         case 5:
//             //console.log(curTabIndex);
//             for (var i = 0; i < curTabIndex; i++) {
//                 $('#tt').tabs('close', allTabtitle[i]);
//             }
//             $('#tt').tabs('select', curTabTitle);
//             break;
//         case 6: //刷新
//             //var currTab = $("#tt").tabs("getTab", curTabTitle);
//             // var iframe = $(currTab.panel('options').content);
//             // console.log(iframe);
//             //$(currTab.panel('options').content).attr('src', 'http://www.baidu.com');

//             // $('#myframe').get(0).contentWindow.location.reload();
//             break;
//     }
// }

$(function() {

    //调试窗口打开快捷键
    $(document).keydown(function(e) {
        if (e.shiftKey && e.ctrlKey && e.which == 73)
            cfxApi.openDevTools();
    });

    //退出程序
    $('#btn-close').bind('click', function() {
        // alert('close');
        $.messager.confirm('退出', '确认退出程序?', function(r) {
            if (r) {
                cfxApi.exit();
            }
        });
    });

    //最小化
    $('#btn-hide').bind('click', function() {
        cfxApi.hide();
    });

    // //关于
    // $('#btn-about').bind('click', function() {
    //     // $("#dlg-about").show();
    //     $('#dlg-about').dialog({
    //         title: '关于',
    //         closed: true,
    //         modal: true,
    //         href: './about.html'
    //     });
    //     $("#dlg-about").dialog('open'); //必须先显示，再弹出
    // });

    //服务器url设置
    // $('#btn-server-url').bind('click', function() {
    //     // $("#dlg-url-set").show();
    //     $('#dlg-url-set').dialog({
    //         title: '折线图阈值设置',
    //         closed: true,
    //         modal: true,
    //         href: './ServerUrlSet.html'
    //     });
    //     $("#dlg-url-set").dialog('open'); //必须先显示，再弹出
    // });


    //注册码输入对话框
    $('#btn-register').bind('click', function() {
        $("#dlg-reg-set").show();
        $('#dlg-reg-set').dialog({
            title: '用户注册',
            closed: false,
            modal: true,
            closable: false,
            href: './register.html'
        });
        $("#dlg-reg-set").dialog('open'); //必须先显示，再弹出
    });

    //检测版本更新
    // $('#btn-update').bind('click', function() {
    //     cfxApi.checkUpdate(getConfig().baseUrl + "update/AutoUpdater.xml");
    // });
    //tab标题监听右键事件，创建右键菜单
    // $('#tt').tabs({
    //     onContextMenu: function(e, title, index) {
    //         // console.log('onContextMenu')
    //         e.preventDefault();
    //         // if (index > 0) {
    //         $('#mm').menu('show', {
    //             left: e.pageX,
    //             top: e.pageY
    //         }).data("tabTitle", title);
    //         // }
    //     }
    // });
    //右键菜单click
    // $("#mm").menu({
    //     onClick: function(item) {
    //         closeTab(this, item.name);
    //     }
    // });
});