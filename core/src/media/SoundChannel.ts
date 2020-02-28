namespace dou {
    /**
     * 声音通道
     * @author wizardc
     */
    export interface SoundChannel extends IEventDispatcher {
        /**
         * 音量范围, [0-1]
         */
        volume: number;

        /**
         * 当播放声音时, 表示声音文件中当前播放的位置, 以秒为单位
         */
        readonly position: number;

        /**
         * 停止在该声道中播放声音
         */
        stop(): void;
    }
}
