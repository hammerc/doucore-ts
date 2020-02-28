namespace dispatcher {
    /**
     * 抛出 IO 错误事件
     */
    export function ioError(target: dou.IEventDispatcher, type: string, msg: string, cancelable?: boolean): boolean {
        let event = dou.recyclable(dou.IOErrorEvent);
        event.$initIOErrorEvent(type, msg, cancelable);
        let result = target.dispatchEvent(event);
        event.recycle();
        return result;
    }
}

namespace dou {
    /**
     * IO 错误事件类
     * @author wizardc
     */
    export class IOErrorEvent extends Event {
        public static IO_ERROR: string = "ioError";

        private _msg: string;

        public get msg(): string {
            return this._msg;
        }

        public $initIOErrorEvent(type: string, msg: string, cancelable?: boolean): void {
            this.$initEvent(type, null, cancelable);
            this._msg = msg;
        }

        public onRecycle(): void {
            super.onRecycle();
            this._msg = null;
        }
    }
}
