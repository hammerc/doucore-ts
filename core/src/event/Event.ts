namespace dou {
    /**
     * 事件类
     * @author wizardc
     */
    export class Event implements ICacheable {
        public static OPEN: string = "open";
        public static CHANGE: string = "change";
        public static COMPLETE: string = "complete";
        public static MESSAGE: string = "message";
        public static CLOSE: string = "close";

        private _type: string;
        private _data: any;
        private _cancelable: boolean;
        private _isDefaultPrevented: boolean = false;

        private _target: IEventDispatcher;

        public init(type: string, data?: any, cancelable?: boolean): void {
            this._type = type;
            this._data = data;
            this._cancelable = cancelable;
        }

        public get type(): string {
            return this._type;
        }

        public get data(): any {
            return this._data;
        }

        public get cancelable(): boolean {
            return this._cancelable;
        }

        public get target(): IEventDispatcher {
            return this._target;
        }

        public setTarget(target: IEventDispatcher): void {
            this._target = target;
        }

        /**
         * 如果可以取消事件的默认行为, 则取消该行为
         */
        public preventDefault(): void {
            if (this._cancelable) {
                this._isDefaultPrevented = true;
            }
        }

        public isDefaultPrevented(): boolean {
            return this._isDefaultPrevented;
        }

        public onRecycle(): void {
            this._type = null;
            this._data = null;
            this._cancelable = null;
            this._isDefaultPrevented = false;
            this._target = null;
        }
    }
}
