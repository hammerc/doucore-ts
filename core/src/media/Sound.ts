namespace dou {
    /**
     * 声音
     * @author wizardc
     */
    export class Sound implements IEventDispatcher {
        private _impl: impl.ISound;

        public constructor() {
            this._impl = new impl.soundImpl(this);
        }

        /**
         * 当前声音的长度, 以秒为单位
         */
        public get length(): number {
            return this._impl.length;
        }

        /**
         * 启动从指定 URL 加载外部音频文件
         */
        public load(url: string): void {
            this._impl.load(url);
        }

        /**
         * 生成一个新的 SoundChannel 对象来播放该声音
         * @param startTime 开始播放的时间, 以秒为单位
         * @param loops 循环次数, 0 表示循环播放
         */
        public play(startTime?: number, loops?: number): SoundChannel {
            return this._impl.play(startTime, loops);
        }

        /**
         * 关闭该流
         */
        public close(): void {
            return this._impl.close();
        }

        public on(type: string, listener: Function, thisObj?: any): void {
            this._impl.on(type, listener, thisObj);
        }

        public once(type: string, listener: Function, thisObj?: any): void {
            this._impl.once(type, listener, thisObj);
        }

        public has(type: string): boolean {
            return this._impl.has(type);
        }

        public dispatch(event: Event): boolean {
            return this._impl.dispatch(event);
        }

        public off(type: string, listener: Function, thisObj?: any): void {
            this._impl.off(type, listener, thisObj);
        }
    }
}
