namespace dou {
    /**
     * IO 错误事件类
     * @author wizardc
     */
    export class IOErrorEvent extends Event {
        public static IO_ERROR: string = "ioError";

        public static dispatch(target: IEventDispatcher, type: string, msg: string, cancelable?: boolean): boolean {
            let event = recyclable(IOErrorEvent);
            event.initEvent(type, msg, cancelable);
            let result = target.dispatchEvent(event);
            event.recycle();
            return result;
        }

        private _msg: string;

        public get msg(): string {
            return this._msg;
        }

        public initEvent(type: string, msg: string, cancelable?: boolean): void {
            this.init(type, null, cancelable);
            this._msg = msg;
        }

        public onRecycle(): void {
            super.onRecycle();
            this._msg = null;
        }
    }
}
