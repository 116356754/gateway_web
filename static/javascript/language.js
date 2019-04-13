function getCookie(cookie_name) {
    var allcookies = document.cookie;
    var cookie_pos = allcookies.indexOf(cookie_name); //索引的长度

    // 如果找到了索引，就代表cookie存在，
    // 反之，就说明不存在。
    if (cookie_pos != -1) {
        // 把cookie_pos放在值的开始，只要给值加1即可。
        cookie_pos += cookie_name.length + 1; //这里容易出问题，所以请大家参考的时候自己好好研究一下
        var cookie_end = allcookies.indexOf(";", cookie_pos);

        if (cookie_end == -1) {
            cookie_end = allcookies.length;
        }

        var value = unescape(allcookies.substring(cookie_pos, cookie_end)); //这里就可以得到你想要的cookie的值了。。。
    }
    return value;
}

function set_language(system) {
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

                $("#i18n_data").localize();
                $("#i18n_data").dialog({
                    title: i18next.t('system.' + system),
                    closable: false,
                    draggable: false,
                    shadow: false,
                    buttons: [{
                        text: i18next.t('total.save'),
                        iconCls: 'icon-ok',
                        handler: function() {
                            doSave();
                        }
                    }]
                });
                //$("#aaa").dialog('setTitle', i18next.t('login.username'));
            });
        })
};