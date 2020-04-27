namespace dou {
    /**
     * 调用父类 setter 方法, 类似其他语言的 super.setter = xxx; 这样的写法
     * @param currentClass 当前的类
     * @param thisObj 当前的对象
     * @param type 要调用的属性名
     * @param values 传递的参数
     */
    export function superSetter(currentClass: any, thisObj: any, type: string, ...values): any {
        let cla = currentClass.prototype;
        let seters: any;
        if (!currentClass.hasOwnProperty("__sets__")) {
            Object.defineProperty(currentClass, "__sets__", { "value": {} });
        }
        seters = currentClass["__sets__"];
        let setF = seters[type];
        if (setF) {
            return setF.apply(thisObj, values);
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
        setF = Object.getOwnPropertyDescriptor(d, type).set;
        seters[type] = setF;
        setF.apply(thisObj, values);
    }
}
