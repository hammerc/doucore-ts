namespace dou {
    /**
     * 心跳计时器基类
     * 请使用 requestAnimationFrame 来调用 update 方法, 或者保证每 1/60 秒调用 update 方法 1 次
     * @author wizardc
     */
    export abstract class TickerBase {
        public static $startTime: number = 0;

        protected _frameRateList: number[];

        protected _frameRate: number;
        protected _frameCount: number;
        protected _lastCount: number;

        protected _immediateUpdate: boolean = false;

        protected _lastTimeStamp: number = 0;

        protected _paused: boolean = false;

        public constructor() {
            TickerBase.$startTime = Date.now();
            this._frameRateList = [60, 30, 20, 15, 12, 10, 6, 5, 4, 3, 2, 1];
            this.frameRate = 60;
        }

        /**
         * 设置帧率
         * 注意: 只能设置为可以被 60 整除的帧率, 包括 60, 30, 20, 15, 12, 10, 6, 5, 4, 3, 2, 1
         */
        public set frameRate(value: number) {
            this.setFrameRate(value);
            this._frameCount = 60 / this._frameRate;
            this._lastCount = 0;
        }
        public get frameRate(): number {
            return this._frameRate;
        }

        /**
         * 是否暂停
         */
        public get paused(): boolean {
            return this._paused;
        }

        protected setFrameRate(value: number): void {
            value = +value || 0;
            for (let i = 0, len = this._frameRateList.length; i < len; i++) {
                let frameRate = this._frameRateList[i];
                if (value >= frameRate) {
                    this._frameRate = frameRate;
                    return;
                }
            }
            this._frameRate = 1;
        }

        /**
         * 请求立即刷新
         */
        public requestImmediateUpdate(): void {
            this._immediateUpdate = true;
        }

        /**
         * 暂停计时器
         */
        public pause(): void {
            this._paused = true;
        }

        /**
         * 恢复计时器
         */
        public resume(): void {
            this._paused = false;
        }

        /**
         * 执行一次更新逻辑
         */
        public update(): void {
            if (this._paused) {
                return;
            }
            let immediateUpdate = this._immediateUpdate;
            this._immediateUpdate = false;
            let frameComplete = false;
            this._lastCount++;
            if (this._lastCount >= this._frameCount) {
                this._lastCount = 0;
                frameComplete = true;
            }
            if (immediateUpdate || frameComplete) {
                let now = getTimer();
                let interval = now - this._lastTimeStamp;
                this._lastTimeStamp = now;
                this.updateLogic(interval);
            }
        }

        protected abstract updateLogic(passedTime: number): void;
    }
}
