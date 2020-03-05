namespace dou.impl {
    /**
     * 声音
     * * Audio API 实现
     * @author wizardc
     */
    export class AudioAPISound extends EventDispatcher implements ISound {
        private _url: string;
        private _loaded: boolean = false;
        private _audioBuffer: AudioBuffer;

        public constructor(target: any) {
            super(target);
        }

        public get length(): number {
            if (this._audioBuffer) {
                return this._audioBuffer.duration;
            }
            throw new Error("sound not loaded!");
        }

        public load(url: string): void {
            this._url = url;
            let self = this;
            let request = new XMLHttpRequest();
            request.open("GET", url, true);
            request.responseType = "arraybuffer";
            request.addEventListener("load", function () {
                let ioError = request.status >= 400;
                if (ioError) {
                    self.dispatchIOErrorEvent(IOErrorEvent.IO_ERROR, `Audio Error: ${self._url}`);
                }
                else {
                    AudioAPIDecode.addDecode({
                        buffer: request.response,
                        success: onAudioLoaded,
                        fail: onAudioError,
                        self: self
                    });
                    AudioAPIDecode.decode();
                }
            });
            request.addEventListener("error", function () {
                self.dispatchIOErrorEvent(IOErrorEvent.IO_ERROR, `Audio Error: ${self._url}`);
            });
            request.send();
            function onAudioLoaded(): void {
                self._loaded = true;
                self.dispatchEvent(Event.COMPLETE);
            }
            function onAudioError(): void {
                self.dispatchIOErrorEvent(IOErrorEvent.IO_ERROR, `Audio Error: ${self._url}`);
            }
        }

        public play(startTime?: number, loops?: number): AudioAPISoundChannel {
            if (!this._loaded) {
                console.error("In the absence of sound is not allowed to play after loading.");
                return;
            }
            let channel = new AudioAPISoundChannel();
            channel.url = this._url;
            channel.loops = loops;
            channel.audioBuffer = this._audioBuffer;
            channel.startTime = startTime;
            channel.play();
            return channel;
        }

        public close() {
        }
    }
}
