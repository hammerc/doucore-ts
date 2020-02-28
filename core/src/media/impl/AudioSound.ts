namespace dou.impl {
    /**
     * 声音
     * * Audio 标签实现
     * @author wizardc
     */
    export class AudioSound extends EventDispatcher implements ISound {
        private static _audios: { [key: string]: HTMLAudioElement[] } = {};
        private static _clearAudios: { [key: string]: boolean } = {};

        public static pop(url: string): HTMLAudioElement {
            let array = AudioSound._audios[url];
            if (array && array.length > 0) {
                return array.pop();
            }
            return null;
        }

        public static recycle(url: string, audio: HTMLAudioElement): void {
            if (AudioSound._clearAudios[url]) {
                return;
            }
            let array = AudioSound._audios[url];
            if (AudioSound._audios[url] == null) {
                array = AudioSound._audios[url] = [];
            }
            array.push(audio);
        }

        public static clear(url: string): void {
            AudioSound._clearAudios[url] = true;
            let array = AudioSound._audios[url];
            if (array) {
                array.length = 0;
            }
        }

        private _url: string;
        private _originAudio: HTMLAudioElement;
        private _loaded: boolean;

        public constructor(target: any) {
            super(target);
        }

        public get length(): number {
            if (this._originAudio) {
                return this._originAudio.duration;
            }
            throw new Error("Sound not loaded.");
        }

        public load(url: string): void {
            this._url = url;
            let audio = new Audio(url);
            audio.addEventListener("canplaythrough", onAudioLoaded);
            audio.addEventListener("error", onAudioError);
            let ua = navigator.userAgent.toLowerCase();
            if (ua.indexOf("firefox") >= 0) {
                audio.autoplay = !0;
                audio.muted = true;
            }
            audio.load();
            this._originAudio = audio;
            if (AudioSound._clearAudios[this._url]) {
                delete AudioSound._clearAudios[this._url];
            }
            let self = this;
            function onAudioLoaded(): void {
                AudioSound.recycle(self._url, audio);
                removeListeners();
                if (ua.indexOf("firefox") >= 0) {
                    audio.pause();
                    audio.muted = false;
                }
                self._loaded = true;
                dispatcher.event(self, Event.COMPLETE);
            }
            function onAudioError(): void {
                removeListeners();
                dispatcher.ioError(self, IOErrorEvent.IO_ERROR, `Audio Error: ${self._url}`);
            }
            function removeListeners(): void {
                audio.removeEventListener("canplaythrough", onAudioLoaded);
                audio.removeEventListener("error", onAudioError);
            }
        }

        public play(startTime?: number, loops?: number): AudioSoundChannel {
            if (!this._loaded) {
                console.error("In the absence of sound is not allowed to play after loading.");
                return;
            }
            let audio = AudioSound.pop(this._url);
            if (!audio) {
                audio = <HTMLAudioElement>this._originAudio.cloneNode();
            }
            audio.autoplay = true;
            let channel = new AudioSoundChannel(audio);
            channel.url = this._url;
            channel.loops = loops;
            channel.startTime = startTime;
            channel.play();
            return channel;
        }

        public close() {
            if (this._loaded && this._originAudio) {
                this._originAudio.src = "";
            }
            if (this._originAudio) {
                this._originAudio = null;
            }
            AudioSound.clear(this._url);
            this._loaded = false;
        }
    }
}
