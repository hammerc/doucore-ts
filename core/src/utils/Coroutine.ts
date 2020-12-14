namespace dou {
    /**
     * 协程
     * @author wizardc
     */
    export namespace Coroutine {
        let _coroutineID: number = 0;
        let _coroutineList: Recyclable<CoroutineInfo>[] = [];

        /**
         * 启动一个协程
         * @returns 该协程的 id, -1 表示该协程启动即执行结束
         */
        export function start(method: Function, thisObj?: any, ...args: any[]): number {
            let generator = (<GeneratorFunction>method).call(thisObj, ...args);
            let result = generator.next();
            if (result.done) {
                return -1;
            }
            (<any>generator).__id = _coroutineID;
            let info = recyclable(CoroutineInfo);
            info.id = _coroutineID;
            info.generator = generator;
            _coroutineList.push(info);
            return _coroutineID++;
        }

        /**
         * 判断指定协程是否还在执行中
         */
        export function exist(id: number): boolean {
            for (let info of _coroutineList) {
                if (info.id == id) {
                    return true;
                }
            }
            return false;
        }

        /**
         * 恢复协程
         */
        export function resume(generator: Generator): number {
            let id = (<any>generator).__id;
            if (exist(id)) {
                return id;
            }
            (<any>generator).__id = _coroutineID;
            let info = recyclable(CoroutineInfo);
            info.id = _coroutineID;
            info.generator = generator;
            _coroutineList.push(info);
            return _coroutineID++;
        }

        /**
         * 移除协程
         */
        export function remove(id: number): Generator {
            for (let i = 0, len = _coroutineList.length; i < len; i++) {
                let info = _coroutineList[i];
                if (info.id == id) {
                    _coroutineList[i] = null;
                    let generator = info.generator;
                    info.recycle();
                    return generator;
                }
            }
            return null;
        }

        export function $update(): void {
            let list = _coroutineList;
            if (list.length == 0) {
                return;
            }
            let currentIndex = 0;
            for (var i = 0, len = list.length; i < len; i++) {
                let info = list[i];
                if (info) {
                    let result = info.generator.next();
                    if (result.done) {
                        info.recycle();
                        list[i] = null;
                    }
                    else {
                        if (currentIndex != i) {
                            list[currentIndex] = info;
                            list[i] = null;
                        }
                        currentIndex++;
                    }
                }
            }
            if (currentIndex != i) {
                length = list.length;
                while (i < length) {
                    list[currentIndex++] = list[i++];
                }
                list.length = currentIndex;
            }
        }
    }

    class CoroutineInfo implements ICacheable {
        public id: number;
        public generator: Generator;

        public onRecycle(): void {
            this.id = this.generator = null;
        }
    }
}
