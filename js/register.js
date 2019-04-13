$(function() {
    if (false == cfxApi.register('')) {
        $('#dlg-reg-set').show(); // open a window  
        $('#dlg-reg-set').dialog({
            title: '用户注册',
            closed: false,
            modal: true,
            closable: false,
            href: './register.html'
        });
    } else
        sessionStorage['register'] = true;
});