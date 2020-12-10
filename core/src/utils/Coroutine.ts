namespace dou {
    /**
     * 协程
     * @author wizardc
     */
    export namespace Coroutine {
        let _coroutineID: number = 0;
        let _coroutineMap: { [key: number]: CoroutineInfo } = {};

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
            _coroutineMap[_coroutineID] = {
                id: _coroutineID,
                generator,
                removed: false
            };
            return _coroutineID++;
        }

        /**
         * 判断指定协程是否还在执行中
         */
        export function exist(id: number): boolean {
            if (_coroutineMap.hasOwnProperty(id)) {
                return !_coroutineMap[id].removed;
            }
            return false;
        }

        /**
         * 恢复协程
         */
        export function resume(generator: Generator): number {
            let id = (<any>generator).__id;
            if (_coroutineMap.hasOwnProperty(id)) {
                _coroutineMap[id].removed = false;
                return id;
            }
            (<any>generator).__id = _coroutineID;
            _coroutineMap[_coroutineID] = {
                id: _coroutineID,
                generator,
                removed: false
            };
            return _coroutineID++;
        }

        /**
         * 移除协程
         */
        export function remove(id: number): Generator {
            if (!_coroutineMap.hasOwnProperty(id)) {
                return null;
            }
            _coroutineMap[id].removed = true;
            return _coroutineMap[id].generator;
        }

        export function $update(): void {
            let map = _coroutineMap;
            _coroutineMap = {};
            for (let id in map) {
                let info = map[id];
                if (!info.removed) {
                    let result = info.generator.next();
                    if (result.done) {
                        continue;
                    }
                }
                if (!info.removed) {
                    _coroutineMap[info.id] = info;
                }
            }
        }
    }

    interface CoroutineInfo {
        id: number;
        generator: Generator;
        removed: boolean;
    }
}
