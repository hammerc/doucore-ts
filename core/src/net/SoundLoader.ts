namespace dou {
    /**
     * 声音加载器
     * @author wizardc
     */
    export class SoundLoader extends EventDispatcher {
        private _data: HTMLAudioElement;
        private _currentAudio: HTMLAudioElement;

        public get data(): HTMLAudioElement {
            return this._data;
        }

        public load(url: string): void {
            this._data = null;
            let audio = this._currentAudio = new Audio(url);
            audio.addEventListener("canplaythrough", this.onLoaded.bind(this));
            audio.addEventListener("error", this.onError.bind(this));
            audio.load();
        }

        private getAudio(element: HTMLAudioElement): HTMLAudioElement {
            if (this._currentAudio === element) {
                this._data = element;
                this._currentAudio = null;
                return element;
            }
            return null;
        }

        private onLoaded(event: globalEvent): void {
            let audio = this.getAudio(<any>event.target);
            if (audio) {
                setTimeout(() => {
                    this.dispatch(Event.COMPLETE);
                }, 0);
            }
        }

        private onError(event: globalEvent): void {
            let audio = this.getAudio(<any>event.target);
            if (audio) {
                setTimeout(() => {
                    IOErrorEvent.dispatch(this, IOErrorEvent.IO_ERROR, `Sound load error: ${audio.src}`);
                }, 0);
            }
        }
    }
}
