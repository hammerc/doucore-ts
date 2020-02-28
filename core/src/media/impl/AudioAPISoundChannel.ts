namespace dou.impl {
    /**
     * 声音通道
     * * Audio API 实现
     * @author wizardc
     */
    export class AudioAPISoundChannel extends EventDispatcher {
        public url: string;
        public loops: number;
        public startTime: number = 0;
        public audioBuffer: AudioBuffer;

        private _context: AudioContext;
        private _gain: GainNode;
        private _bufferSource: AudioBufferSourceNode;

        private _isStopped: boolean = false;
        private _recordStartTime: number = 0;

        private _volume: number = 1;

        private _onPlayEnd = () => {
            if (this.loops == 1) {
                this.stop();
                dispatcher.event(this, Event.SOUND_COMPLETE);
                return;
            }
            if (this.loops > 0) {
                this.loops--;
            }
            this.play();
        };

        public constructor() {
            super();
            this._context = AudioAPIDecode.getContext();
            if (this._context.createGain) {
                this._gain = this._context.createGain();
            }
            else {
                this._gain = this._context["createGainNode"]();
            }
        }

        public set volume(value: number) {
            if (this._isStopped) {
                console.error("Sound has stopped, please recall Sound.play () to play the sound.");
                return;
            }
            this._volume = value;
            this._gain.gain.value = value;
        }
        public get volume(): number {
            return this._volume;
        }

        public get position(): number {
            if (this._bufferSource) {
                return (Date.now() - this._recordStartTime) / 1000 + this.startTime;
            }
            return 0;
        }

        public play(): void {
            if (this._isStopped) {
                console.error("Sound has stopped, please recall Sound.play () to play the sound.");
                return;
            }
            if (this._bufferSource) {
                this._bufferSource.onended = null;
                this._bufferSource = null;
            }
            let context = this._context;
            let gain = this._gain;
            let bufferSource = context.createBufferSource();
            this._bufferSource = bufferSource;
            bufferSource.buffer = this.audioBuffer;
            bufferSource.connect(gain);
            gain.connect(context.destination);
            bufferSource.onended = this._onPlayEnd;
            this._recordStartTime = Date.now();
            this._gain.gain.value = this._volume;
            bufferSource.start(0, this.startTime);
        }

        public stop(): void {
            if (this._bufferSource) {
                let sourceNode = this._bufferSource;
                if (sourceNode.stop) {
                    sourceNode.stop(0);
                }
                else {
                    (<any>sourceNode).noteOff(0);
                }
                sourceNode.onended = null;
                sourceNode.disconnect();
                this._bufferSource = null;
                this.audioBuffer = null;
            }
            this._isStopped = true;
        }
    }
}
