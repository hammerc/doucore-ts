namespace dou {
    /**
     * 事件发送器
     * @author wizardc
     */
    export class EventDispatcher extends HashObject implements IEventDispatcher {
        private $map: { [type: string]: Recyclable<EventBin>[] };

        public constructor() {
            super();
            this.$map = {};
        }

        public on(type: string, listener: Function, thisObj?: any): void {
            this.$addEvent(type, listener, thisObj, false);
        }

        public once(type: string, listener: Function, thisObj?: any): void {
            this.$addEvent(type, listener, thisObj, true);
        }

        private $addEvent(type: string, listener: Function, thisObj: any, once: boolean): boolean {
            let map = this.$map;
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
            return this.$map.hasOwnProperty(type) && this.$map[type].length > 0;
        }

        public dispatchEvent(event: Event): boolean {
            let map = this.$map;
            if (!map.hasOwnProperty(event.type)) {
                return true;
            }
            let list = map[event.type];
            if (list.length == 0) {
                return true;
            }
            event.setTarget(this);
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
            event.setTarget(null);
            return !event.isDefaultPrevented;
        }

        public dispatch(type: string, data?: any, cancelable?: boolean): boolean {
            let event = recyclable(Event);
            event.init(type, data, cancelable);
            let result = this.dispatchEvent(event);
            event.recycle();
            return result;
        }

        public off(type: string, listener: Function, thisObj?: any): void {
            let map = this.$map;
            if (map.hasOwnProperty(type)) {
                let list = map[event.type];
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
