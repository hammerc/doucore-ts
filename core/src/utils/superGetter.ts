namespace dou {
    /**
     * 调用父类 getter 方法, 类似其他语言的 xxx = super.getter; 这样的写法
     * @param currentClass 当前的类
     * @param thisObj 当前的对象
     * @param type 要调用的属性名
     * @returns 返回的值
     */
    export function superGetter(currentClass: any, thisObj: any, type: string): any {
        let cla = currentClass.prototype;
        let geters: any;
        if (!currentClass.hasOwnProperty("__gets__")) {
            Object.defineProperty(currentClass, "__gets__", { "value": {} });
        }
        geters = currentClass["__gets__"];
        let getF = geters[type];
        if (getF) {
            return getF.call(thisObj);
        }
        let d = Object.getPrototypeOf(cla);
        if (d == null) {
            return;
        }
        while (!d.hasOwnProperty(type)) {
            d = Object.getPrototypeOf(d);
            if (d == null) {
                return;
            }
        }
        getF = Object.getOwnPropertyDescriptor(d, type).get;
        geters[type] = getF;
        return getF.call(thisObj);
    }
}
