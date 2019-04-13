//日期的一些公共方法
var DateUtil = {
    /**
     * 日期对象转换为指定格式的字符串
     * @param formatStr 日期格式,yyyy-MM-dd HH:mm:ss等,如果为空则默认为yyyy-MM-dd HH:mm:ss
     * @param date Date日期对象,如果为空，则默认当前时间
     * @returns {*|string}
     */
    dateToStr: function(formatStr, date) {
        if (typeof arguments[0] == 'undefined') {
            formatStr = "yyyy-MM-dd HH:mm:ss";
            date = new Date();
        } else {
            if (typeof arguments[0] == 'string') {
                formatStr = arguments[0];
            } else {
                formatStr = "yyyy-MM-dd HH:mm:ss";
                date = arguments[0];
            }
        }
        if (typeof arguments[1] == 'undefined') {
            date = new Date();
        } else {
            if (typeof arguments[1] == 'string') {
                formatStr = arguments[1];
            } else {
                date = arguments[1];
            }
        }
        var str = formatStr;
        var Week = ['日', '一', '二', '三', '四', '五', '六'];
        str = str.replace(/yyyy|YYYY/, date.getFullYear());
        str = str.replace(/yy|YY/, (date.getYear() % 100) > 9 ? (date.getYear() % 100).toString() : '0' + (date.getYear() % 100));
        str = str.replace(/MM/, date.getMonth() > 8 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1));
        str = str.replace(/M/g, date.getMonth());
        str = str.replace(/w|W/g, Week[date.getDay()]);

        str = str.replace(/dd|DD/, date.getDate() > 9 ? date.getDate().toString() : '0' + date.getDate());
        str = str.replace(/d|D/g, date.getDate());

        str = str.replace(/hh|HH/, date.getHours() > 9 ? date.getHours().toString() : '0' + date.getHours());
        str = str.replace(/h|H/g, date.getHours());
        str = str.replace(/mm/, date.getMinutes() > 9 ? date.getMinutes().toString() : '0' + date.getMinutes());
        str = str.replace(/m/g, date.getMinutes());

        str = str.replace(/ss|SS/, date.getSeconds() > 9 ? date.getSeconds().toString() : '0' + date.getSeconds());
        str = str.replace(/s|S/g, date.getSeconds());

        return str;
    },
    /**
     * 字符串时间转换为日期时间
     * @param dateStr 格式为yyyy-MM-dd HH:mm:ss，必须按年月日时分秒的顺序，中间分隔符不限制
     */
    strToDate: function(dateStr) {
        var data = dateStr;
        var reCat = /(\d{1,4})/gm;
        var t = data.match(reCat);
        t[1] = t[1] - 1;
        eval('var d = new Date(' + t.join(',') + ');');
        return d;
    },
    /**
     * 获取当前日期字符串，格式为yyyy-MM-dd
     * @returns {*|string}
     */
    getNowDateStr: function() {
        var date = new Date();
        var dateStr = this.dateToStr("yyyy-MM-dd", date);
        return dateStr;
    },
    /**
     * 获取当前时间字符串，格式为yyyy-MM-dd HH:mm:ss
     * @returns {*|string}
     */
    getNowTimeStr: function() {
        var date = new Date();
        var dateStr = this.dateToStr("yyyy-MM-dd HH:mm:ss", date);
        return dateStr;
    },
    /**
     * 指定日期是星期几
     * @param date Date日期对象,如果为空，则默认当前时间
     */
    getWeek: function(date) {
        date = arguments[0] || new Date();
        var a = ['日', '一', '二', '三', '四', '五', '六'];
        var week = a[date.getDay()];
        return week;
    },
    /**
     * 增加年数(返回Date类型日期)
     * @param date 字符串类型日期或者Date类型日期
     * @param addYears
     * @returns {Date}
     */
    addYear: function(date, addYears) {
        var a = new Date();
        if (typeof date == "string") {
            a = new Date(Date.parse(date.replace(/-/g, "/")));
        } else {
            a = date;
        }
        a.setFullYear(a.getFullYear() + addYears);
        return a;
    },
    /**
     * 增加月数(返回Date类型日期)
     * @param date 字符串类型日期或者Date类型日期
     * @param addMonths
     * @returns {Date}
     */
    addMonth: function(date, addMonths) {
        var a = new Date();
        if (typeof date == "string") {
            a = new Date(Date.parse(date.replace(/-/g, "/")));
        } else {
            a = date;
        }
        a.setMonth(a.getMonth() + addMonths);
        return a;
    },
    /**
     * 增加天数(返回Date类型日期)
     * @param date 字符串类型日期或者Date类型日期
     * @param addDays
     * @returns {Date}
     */
    addDay: function(date, addDays) {
        var a = new Date();
        if (typeof date == "string") {
            a = new Date(Date.parse(date.replace(/-/g, "/")));
        } else {
            a = date;
        }
        a.setDate(a.getDate() + addDays);
        return a;
    }
};