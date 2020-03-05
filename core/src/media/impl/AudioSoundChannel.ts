namespace dou.impl {
    /**
     * 声音通道
     * * Audio 标签实现
     * @author wizardc
     */
    export class AudioSoundChannel extends EventDispatcher {
        public url: string;
        public loops: number;
        public startTime: number = 0;

        private _audio: HTMLAudioElement;
        private _isStopped: boolean = false;
        private _volume: number = 1;

        private _canPlay = () => {
            this._audio.removeEventListener("canplay", this._canPlay);
            try {
                this._audio.currentTime = this.startTime;
            }
            catch (e) {
            }
            finally {
                this._audio.play();
            }
        };

        private _onPlayEnd = () => {
            if (this.loops == 1) {
                this.stop();
                this.dispatchEvent(Event.SOUND_COMPLETE);
                return;
            }
            if (this.loops > 0) {
                this.loops--;
            }
            this.play();
        };

        public constructor(audio: HTMLAudioElement) {
            super();
            this._audio = audio;
            audio.addEventListener("ended", this._onPlayEnd);
        }

        public set volume(value: number) {
            if (this._isStopped) {
                console.error("Sound has stopped, please recall Sound.play () to play the sound.");
                return;
            }
            this._volume = value;
            if (!this._audio) {
                return;
            }
            this._audio.volume = value;
        }
        public get volume(): number {
            return this._volume;
        }

        public get position(): number {
            if (!this._audio) {
                return 0;
            }
            return this._audio.currentTime;
        }

        public play(): void {
            if (this._isStopped) {
                console.error("Sound has stopped, please recall Sound.play () to play the sound.");
                return;
            }
            try {
                this._audio.volume = this._volume;
                this._audio.currentTime = this.startTime;
            }
            catch (error) {
                this._audio.addEventListener("canplay", this._canPlay);
                return;
            }
            this._audio.play();
        }

        public stop() {
            if (!this._audio) {
                return;
            }
            this._isStopped = true;
            let audio = this._audio;
            audio.removeEventListener("ended", this._onPlayEnd);
            audio.removeEventListener("canplay", this._canPlay);
            audio.volume = 0;
            this._volume = 0;
            this._audio = null;
            let url = this.url;
            // 延迟一定时间再停止, 规避 chrome 报错
            window.setTimeout(() => {
                audio.pause();
                AudioSound.recycle(url, audio);
            }, 200);
        }
    }
}
