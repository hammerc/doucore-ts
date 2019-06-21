namespace dou {
    /**
     * 提供泛型哈希表的支持
     * 如果 key 使用继承 dou.HashObject 的对象, 则使用 hashCode 作为其键值, 否则使用 toString() 的返回作为键值
     * @author wizardc
     */
    export class Dictionary<TKey, TValue> {
        private _map: {[k: string]: TValue};
        private _keyMap: {[k: string]: TKey};
        private _size: number;

        public constructor(map?: {[k: string]: TValue}) {
            this._map = map || {};
            this._keyMap = {};
            this._size = 0;
        }

        public get size(): number {
            return this._size;
        }

        private getKey(key: TKey): string {
            if ((<any>(key)) instanceof HashObject) {
                return (<HashObject>(<any>(key))).hashCode.toString();
            }
            return key.toString();
        }

        public add(key: TKey, value: TValue): void {
            let k = this.getKey(key);
            if (!this._map.hasOwnProperty(k)) {
                ++this._size;
            }
            this._map[k] = value;
            this._keyMap[k] = key;
        }

        public has(key: TKey): boolean {
            let k = this.getKey(key);
            return this._map.hasOwnProperty(k);
        }

        public get(key: TKey): TValue {
            let k = this.getKey(key);
            return this._map[k];
        }

        public forEach(callbackfn: (item: TValue, key: TKey, dictionary: Dictionary<TKey, TValue>) => void, thisArg?: any): void {
            for (let key in this._map) {
                if (this._map.hasOwnProperty(key)) {
                    callbackfn.call(thisArg, this._map[key], this._keyMap[key], this);
                }
            }
        }

        public remove(key: TKey): boolean {
            let k = this.getKey(key);
            if (!this._map.hasOwnProperty(k)) {
                return false;
            }
            delete this._map[k];
            delete this._keyMap[k];
            --this._size;
            return true;
        }

        public clear(): void {
            this._map = {};
            this._keyMap = {};
            this._size = 0;
        }

        public toString(): string {
            let result: string[] = [];
            for (let key in this._map) {
                if (this._map.hasOwnProperty(key)) {
                    result.push(`{key:${this._keyMap[key]}, value:${this._map[key]}}`);
                }
            }
            return "{" + result.join(", ") + "}";
        }

        public keyOf(): {[k: string]: TKey} {
            return this._keyMap;
        }

        public valueOf(): {[k: string]: TValue} {
            return this._map;
        }
    }
}
