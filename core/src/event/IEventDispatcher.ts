namespace dou {
    /**
     * 事件发送器接口
     * @author wizardc
     */
    export interface IEventDispatcher {
        on(type: string, listener: Function, thisObj?: any): void;
        once(type: string, listener: Function, thisObj?: any): void;
        has(type: string): boolean;
        dispatchEvent(event: Event): boolean;
        dispatch(type: string, data?: any, cancelable?: boolean): boolean;
        off(type: string, listener: Function, thisObj?: any): void;
    }
}
