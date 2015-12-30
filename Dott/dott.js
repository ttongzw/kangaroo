/**
 * 一些小函数
 */
define(function() {
    var DOC = document;
    /**
     * setInterval构造
     * @param {function} fun     执行函数
     * @param {number} time    setInterval的时间
     * @param {boolean} execute 是否立即执行
     */
    var InterVal = function(fun, time, execute) {
        this.fun = fun;
        this.time = time;
        this.id = this.timer = setInterval(fun, time);
        execute && this.fun();
    };
    InterVal.prototype = {
        start: function() {
            !!this.timer && this.stop();
            this.timer = setInterval(this.fun, this.time);
        },
        stop: function() {
            clearInterval(this.timer);
        }
    };
    var protoString = Object.prototype.toString;


    /**
     * Cookie操作，可以检测浏览器是否支持cookie；设置、获取、删除cookie
     * @class Cookie
     * @static
     * @author qianghu
     */

    var Cookie = {

        /**
         * 是否支持Cookie
         */
        isEnabled: false,

        /**
         * 设置Cookie
         * @static
         * @param {string} name 要设置的Cookie名称
         * @param {string} value 要设置的Cookie值
         * @param {number} expire 过期时间，单位是小时
         * @param {string} domain 域，默认为本域
         */
        set: function(name, value, expire, domain) {
            var expires = '';
            if (0 !== expire) {
                var t = new Date();
                t.setTime(t.getTime() + (expire || 24) * 3600000);
                expires = ';expires=' + t.toGMTString();
            }
            var s = escape(name) + '=' + escape(value) + expires + ';path=/' + (domain ? (';domain=' + domain) : '');
            DOC.cookie = s;
        },

        /**
         * 读取指定的Cookie
         * @static
         * @param {string} name 要获取的Cookie名称
         * @return {?string} 对应的Cookie值，如果不存在，返回null
         */
        get: function(name) {
            var arrCookie = DOC.cookie.split(';'),
                arrS;
            for (var i = 0; i < arrCookie.length; i++) {
                arrS = arrCookie[i].split('=');
                if (arrS[0].trim() == name) {
                    return unescape(arrS[1]);
                }
            }
            return null;
        },

        /**
         * 删除指定的Cookie
         * @static
         * @param {string} name 要删除的Cookie名称
         */
        remove: function(name) {
            Cookie.set(name, '', -1000);
        },

        /**
         * 测试浏览器是否支持Cookie，
         * 如果浏览器支持Cookie，Cookie.isEnabled的值为TRUE，不支持Cookie.isEnabled的值为FALSE
         * @static
         * @private
         */
        test: function() {
            var testKey = '_c_t_';
            Cookie.set(testKey, '1');
            Cookie.isEnabled = ('1' === Cookie.get(testKey));
            Cookie.remove(testKey);
        }
    };

    var Util = {
        isObject: function(obj) {
            return protoString.call(obj) == "[object Object]";
        },
        isArray: function(obj) {
            return protoString.call(obj) == "[object Array]";
        },
        isNumber: function(obj) {
            return protoString.call(obj) == "[object Number]";
        },
        isString: function(obj) {
            return protoString.call(obj) == "[object String]";
        },
        isFunction: function(obj) {
            return protoString.call(obj) == "[object Function]";
        },
        extend: function(child, parent, deep) {
            for (var i in parent) {
                if (deep && (Util.isObject(parent[i]) || Util.isArray(parent[i]))) {
                    if (Util.isObject(parent[i]) && !Util.isObject(child[i])) {
                        child[i] = {};
                    } else if (Util.isArray(parent[i]) && !Util.isArray(child[i])) {
                        child[i] = [];
                    }
                    Util.extend(child[i], parent[i], deep);
                } else if (parent[i] !== undefined) {
                    child[i] = parent[i];
                }
            }
        }
    }

    return {
        isObject: Util.isObject,
        isArray: Util.isArray,
        isNumber: Util.isNumber,
        isString: Util.isString,
        isFunction: Util.isFunction,
        extend: Util.extend,
        /**
         * 将查询串转换为对象形式
         * @param  {string} queryString
         * @return {object}    查询串对象
         */
        getQueryData: function(queryString) {
            queryString = queryString || location.search;
            /* 去掉字符串前面的"?"，并把&amp;转换为& */
            queryString = queryString.replace(/^\?+/, '').replace(/&amp;/, '&');
            var querys = queryString.split('&'),
                i = querys.length,
                _URLParms = {},
                item;

            while (i--) {
                item = querys[i].split('=');
                if (item[0]) {
                    var value = item[1] || '';
                    try {
                        value = decodeURIComponent(value);
                    } catch (e) {
                        value = unescape(value);
                    }
                    _URLParms[decodeURIComponent(item[0])] = value;
                }
            }
            return _URLParms;
        },
        /**
         * 千位分隔符
         * @param  {number} num 
         * @return {string} 分割后的字符，如1234567->'1,234,567'
         */
        splitThousand: function(num) {
            var str = (num + "").split('.')[0],
                arr = str.split('').reverse(),
                newarr = [];
            while (arr.length > 0) {
                newarr = newarr.concat(arr.splice(0, 3));
                newarr.push(',');
            }
            return newarr.reverse().join('').replace(/^,|,$/g, '') || '';
        },
        /**
         * 转换日期为年月日6位数，并根据分隔符分割，默认不分割
         * @param  {Date} date 
         * @param  {string} splitStr  默认不分割
         * @return {string}      返回分割后的字符串
         */
        dateJoin: function(date, splitStr) {
            if (Util.isNumber(date))
                date = new Date(date);
            var arr = [];
            arr.push(date.getFullYear());
            arr.push(date.getMonth() + 1);
            arr.push(date.getDate());
            for (var i = 1; i < 3; i++) {
                ("" + arr[i]).length < 2 && (arr[i] = ("0" + arr[i]));
            }
            return arr.join(splitStr || "");
        },
        /**
         * 将对象字符串解析为对象
         * @param  {string } str  要解析的字符串
         * 类似于  "a=123&b=4546&c=123"
         * @param  {string} split1 大分隔符,默认为&
         * @return        
         */
        parseStrToObj: function(str, split1) {
            !split1 && (split1 = "&");
            var arr = str.split(split1);
            var obj = {};
            var temp = "";
            for (var i = 0, j = arr.length; i < j; i++) {
                temp = arr[i].split("=");
                obj[temp[0]] = temp[1];
            }
            return obj;
        },
        /**
         * 将对象解析为对象字符串
         * @param  {object } obj  要解析的对象
         * @param  {string} split1 大分隔符,默认为&
         * @return        
         */
        parseObjToStr: function(obj, split1) {
            !split1 && (split1 = "&");
            var arr = [];
            for (var i in obj) {
                arr.push(i + "=" + obj[i]);
            }
            return arr.join(split1);
        },
        /**
         * 将今天转换为yyyy-MM-dd
         * @param  {string }  日期连接字符串，默认为-
         * @return {string}  转换后的字符串
         */
        formatToday: function(joinStr) {
            if (typeof joinStr == 'undefined') joinStr = "-";
            var d = new Date();
            var month = d.getMonth() + 1;
            var day = d.getDate();
            var output = d.getFullYear() + joinStr +
                (month < 10 ? '0' : '') + month + joinStr +
                (day < 10 ? '0' : '') + day;
            return output;
        },
        /**
         * 获取cookie
         * @param  {string }   cookie的名字
         */
        getCookie: Cookie.get,
        /**
         * 设置Cookie
         * @param {string} name 要设置的Cookie名称
         * @param {string} value 要设置的Cookie值
         * @param {number} expire 过期时间，单位是小时
         * @param {string} domain 域，默认为本域
         */
        setCookie: Cookie.set,
        /**
         * 删除指定的Cookie
         * @param {string} name 要删除的Cookie名称
         */
        removeCookie: Cookie.remove,
        /**
         * setInterval构造
         */
        InterVal: InterVal
    }
});