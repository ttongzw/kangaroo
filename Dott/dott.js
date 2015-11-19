/**
 * 一些小函数
 */
define(function() {
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
    return {
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
        },
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
            if (isNumber(date))
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
         * setInterval构造
         */
        InterVal: InterVal
    }
});