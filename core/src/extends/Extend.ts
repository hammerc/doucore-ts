interface Object {
    /**
     * 清除所有属性
     */
    clearAllProperty(): void;
}

interface String {
    /**
     * 根据分割符拆分字符串为数组且元素转换为数字
     */
    splitNum(separator: string, limit?: number): number[];
    splitNum(separator: RegExp, limit?: number): number[];
}

interface ArrayConstructor {
    /**
     * 默认的排序规则
     */
    readonly NORMAL: number;

    /**
     * 排序时字符串不区分大小写
     */
    readonly CASEINSENSITIVE: number;

    /**
     * 降序
     */
    readonly DESCENDING: number;

    /**
     * 返回包含已经排序完毕的索引数组
     */
    readonly RETURNINDEXEDARRAY: number;

    /**
     * 按数字而非字符串排序
     */
    readonly NUMERIC: number;
}

interface Array<T> {
    /**
     * 添加唯一数据
     */
    pushUnique(...args: T[]): number;

    /**
     * 按数组元素的字段进行排序, 支持多字段
     */
    sortOn(fieldNames: string | string[], options?: number | number[]): void | this;

    /**
     * 移除指定元素
     */
    remove(item: T): boolean;

    /**
     * 洗牌, 随机打乱当前数组
     */
    shuffle(): this;
}

interface Date {
    /**
     * 格式化当前日期
     * * 月(M), 日(d), 小时(h), 分(m), 秒(s), 季度(q)可以用 1-2 个占位符, 年(y)可以用 1-4 个占位符, 毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
     */
    format(template: string): string;
}

(function () {
    let f, p;

    p = Object.prototype;
    Object.defineProperties(p, {
        clearAllProperty: {
            value: function () {
                for (let key in this) {
                    delete this[key];
                }
            },
            enumerable: false
        }
    });

    p = String.prototype;
    Object.defineProperties(p, {
        splitNum: {
            value: function (separator: string | RegExp, limit?: number) {
                let arr = this.split(separator, limit);
                for (let i = 0, len = arr.length; i < len; i++) {
                    arr[i] = parseFloat(arr[i]);
                }
                return arr;
            },
            enumerable: false
        },
    });

    f = Array;
    f.NORMAL = 0;
    f.CASEINSENSITIVE = 1;
    f.DESCENDING = 2;
    f.RETURNINDEXEDARRAY = 4;
    f.NUMERIC = 8;

    p = Array.prototype;
    Object.defineProperties(p, {
        pushUnique: {
            value: function (...args: any[]) {
                for (let v of args) {
                    if (this.indexOf(v) == -1) {
                        this[this.length] = v;
                    }
                }
                return this.length;
            },
            enumerable: false
        },
        sortOn: {
            value: function (fieldNames: string | string[], options: number | number[]) {
                let array = this;
                if (!Array.isArray(fieldNames)) {
                    fieldNames = [fieldNames];
                }
                if (!Array.isArray(options)) {
                    options = [options];
                }
                if (fieldNames.length !== options.length) {
                    options = new Array(fieldNames.length).fill(0);
                }
                let returnIndexedArray = options[0] & Array.RETURNINDEXEDARRAY;
                if (returnIndexedArray) {
                    array = Array.from(array);
                }
                let functions = fieldNames.map(function (fieldName, index) {
                    return createComparisonFn(fieldName, options[index]);
                });
                let sorted = array.sort(function (a, b) {
                    return functions.reduce(function (result, fn) {
                        return result || fn(a, b);
                    }, 0);
                });
                return returnIndexedArray ? sorted : undefined;
                function createComparisonFn(fieldName, options) {
                    options = options || 0;
                    let transformations: any = [];
                    if (fieldName) {
                        transformations.push(
                            function () {
                                return this[fieldName];
                            }
                        );
                    }
                    transformations.push(
                        (options & Array.NUMERIC)
                            ? function () {
                                return parseFloat(this);
                            }
                            : function () {
                                return (typeof this === 'string' && this)
                                    || (typeof this === 'number' && '' + this)
                                    || (this && this.toString())
                                    || this;
                            }
                    );
                    if (options & Array.CASEINSENSITIVE) {
                        transformations.push(String.prototype.toLowerCase);
                    }
                    transformations.apply = Array.prototype.reduce.bind(
                        transformations,
                        function (value, transformation) {
                            return transformation.apply(value);
                        }
                    );
                    let AGreaterThanB = (options & Array.DESCENDING) ? -1 : 1;
                    let ALessThanB = -AGreaterThanB;
                    return function (a, b) {
                        a = transformations.apply(a);
                        b = transformations.apply(b);
                        if (a > b || (a != null && b == null)) {
                            return AGreaterThanB;
                        }
                        if (a < b || (a == null && b != null)) {
                            return ALessThanB;
                        }
                        return 0;
                    }
                }
            },
            enumerable: false
        },
        remove: {
            value: function (item: any) {
                let index = this.indexOf(item);
                if (index > -1) {
                    this.splice(index, 1);
                    return true;
                }
                return false;
            },
            enumerable: false
        },
        shuffle: {
            value: function () {
                for (let i = 0, len = this.length; i < len; i++) {
                    let index = Math.round(Math.random() * (len - 1));
                    let t = this[i];
                    this[i] = this[index];
                    this[index] = t;
                }
                return this;
            },
            enumerable: false
        }
    });

    p = Date.prototype;
    Object.defineProperties(p, {
        format: {
            value: function (template: string) {
                let map = {
                    "M+": this.getMonth() + 1,
                    "d+": this.getDate(),
                    "h+": this.getHours(),
                    "m+": this.getMinutes(),
                    "s+": this.getSeconds(),
                    "q+": Math.floor((this.getMonth() + 3) / 3),
                    "S": this.getMilliseconds()
                };
                if (/(y+)/.test(template)) {
                    template = template.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
                }
                for (let k in map) {
                    if (new RegExp("(" + k + ")").test(template)) {
                        template = template.replace(RegExp.$1, (RegExp.$1.length == 1) ? (map[k]) : (("00" + map[k]).substr(("" + map[k]).length)));
                    }
                }
                return template;
            },
            enumerable: false
        },
    });

})();
