namespace dispatcher {
    /**
     * 抛出进度事件
     */
    export function progress(target: dou.IEventDispatcher, type: string, loaded: number, total: number, cancelable?: boolean): boolean {
        let event = dou.recyclable(dou.ProgressEvent);
        event.$initProgressEvent(type, loaded, total, cancelable);
        let result = target.dispatchEvent(event);
        event.recycle();
        return result;
    }
}

namespace dou {
    /**
     * 进度事件类
     * @author wizardc
     */
    export class ProgressEvent extends Event {
        public static PROGRESS: string = "progress";

        private _loaded: number;
        private _total: number;

        public get loaded(): number {
            return this._loaded;
        }

        public get total(): number {
            return this._total;
        }

        public $initProgressEvent(type: string, loaded: number, total: number, cancelable?: boolean): void {
            this.$initEvent(type, null, cancelable);
            this._loaded = loaded;
            this._total = total;
        }

        public onRecycle(): void {
            super.onRecycle();
            this._loaded = null;
            this._total = null;
        }
    }
}
