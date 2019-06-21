namespace dou {
    /**
     * 进度事件类
     * @author wizardc
     */
    export class ProgressEvent extends Event {
        public static PROGRESS: string = "progress";

        public static dispatch(target: IEventDispatcher, type: string, loaded: number, total: number, cancelable?: boolean): boolean {
            let event = recyclable(ProgressEvent);
            event.initEvent(type, loaded, total, cancelable);
            let result = target.dispatchEvent(event);
            event.recycle();
            return result;
        }

        private _loaded: number;
        private _total: number;

        public get loaded(): number {
            return this._loaded;
        }

        public get total(): number {
            return this._total;
        }

        public initEvent(type: string, loaded: number, total: number, cancelable?: boolean): void {
            this.init(type, null, cancelable);
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
