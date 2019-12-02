namespace dou {
    export type Creator<T> = { new(): T };

    /**
     * 对象池
     * @author wizardc
     */
    export class ObjectPool<T> {
        private _creator: Creator<T>;
        private _maxCount: number;
        private _list: T[];
        private _map: Map<T, boolean>;

        public constructor(creator: Creator<T>, maxCount: number = 50) {
            this._creator = creator;
            this._maxCount = maxCount;
            this._list = [];
            this._map = new Map();
        }

        public get size(): number {
            return this._list.length;
        }

        public join(obj: T): void {
            if (typeof (<any>obj).onRecycle === "function") {
                (<any>obj).onRecycle();
            }
            if (this._list.length < this._maxCount) {
                if (!this._map.has(obj)) {
                    this._map.set(obj, true);
                    this._list.push(obj);
                }
            }
        }

        public take(): T {
            let obj: T;
            if (this._list.length == 0) {
                obj = new (<any>this._creator)();
            } else {
                obj = this._list.pop();
                this._map.delete(obj);
                if (typeof (<any>obj).onReuse === "function") {
                    (<any>obj).onReuse();
                }
            }
            return obj;
        }

        public clear(): void {
            this._list.length = 0;
            this._map.clear();
        }
    }
}
