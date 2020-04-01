namespace dou {
    /**
     * 事件发送器
     * @author wizardc
     */
    export class EventDispatcher implements IEventDispatcher {
        private _eventMap: { [type: string]: Recyclable<EventBin>[] };
        private _eventTarget: any;

        public constructor(target?: any) {
            this._eventMap = {};
            this._eventTarget = target;
        }

        public on(type: string, listener: Function, thisObj?: any): void {
            this.addEventListener(type, listener, thisObj, false);
        }

        public once(type: string, listener: Function, thisObj?: any): void {
            this.addEventListener(type, listener, thisObj, true);
        }

        protected addEventListener(type: string, listener: Function, thisObj: any, once: boolean): boolean {
            let map = this._eventMap;
            if (!map.hasOwnProperty(type)) {
                map[type] = [];
            }
            let list = map[type];
            for (let i = 0, len = list.length; i < len; i++) {
                let bin = list[i];
                if (bin.listener == listener && bin.thisObj == thisObj) {
                    return false;
                }
            }
            let eventBin = recyclable(EventBin);
            eventBin.listener = listener;
            eventBin.thisObj = thisObj;
            eventBin.once = once;
            list.push(eventBin);
            return true;
        }

        public has(type: string): boolean {
            return this._eventMap.hasOwnProperty(type) && this._eventMap[type].length > 0;
        }

        public dispatch(event: Event): boolean {
            event.$setTarget(this._eventTarget || this);
            return this.$notify(event);
        }

        public $notify(event: Event): boolean {
            let map = this._eventMap;
            if (!map.hasOwnProperty(event.type)) {
                return true;
            }
            let list = map[event.type];
            if (list.length == 0) {
                return true;
            }
            let currentIndex = 0;
            for (var i = 0, len = list.length; i < len; i++) {
                let bin = list[i];
                if (bin) {
                    let listener = bin.listener;
                    let thisObj = bin.thisObj;
                    if (bin.once) {
                        bin.recycle();
                        list[i] = null;
                    } else {
                        if (currentIndex != i) {
                            list[currentIndex] = bin;
                            list[i] = null;
                        }
                        currentIndex++;
                    }
                    listener.call(thisObj, event);
                }
            }
            if (currentIndex != i) {
                length = list.length;
                while (i < length) {
                    list[currentIndex++] = list[i++];
                }
                list.length = currentIndex;
            }
            event.$setTarget(null);
            return !event.$isDefaultPrevented();
        }

        public off(type: string, listener: Function, thisObj?: any): void {
            let map = this._eventMap;
            if (map.hasOwnProperty(type)) {
                let list = map[type];
                for (let i = 0, len = list.length; i < len; i++) {
                    let info = list[i];
                    if (info && info.listener == listener && info.thisObj == thisObj) {
                        info.recycle();
                        list[i] = null;
                        break;
                    }
                }
            }
        }
    }

    class EventBin implements ICacheable {
        public listener: Function;
        public thisObj: any;
        public once: boolean;

        public onRecycle(): void {
            this.listener = this.thisObj = this.once = null;
        }
    }
}
