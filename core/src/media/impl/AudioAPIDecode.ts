namespace dou.impl {
    /**
     * AudioContext 解码器
     * @author wizardc
     */
    export namespace AudioAPIDecode {
        let _context: AudioContext;
        let _decodeList: { buffer: any, success: Function, fail: Function, self: any }[];
        let _decoding: boolean;

        export function init(context: AudioContext): void {
            _context = context;
        }

        export function getContext(): AudioContext {
            return this._context;
        }

        export function addDecode(decode: { buffer: any, success: Function, fail: Function, self: any }): void {
            _decodeList.push(decode);
        }

        export function decode(): void {
            if (_decodeList.length <= 0) {
                return;
            }
            if (_decoding) {
                return;
            }
            _decoding = true;
            let decodeInfo = _decodeList.shift();
            _context.decodeAudioData(decodeInfo.buffer, (audioBuffer) => {
                decodeInfo.self.audioBuffer = audioBuffer;
                if (decodeInfo.success) {
                    decodeInfo.success();
                }
                _decoding = false;
                decode();
            }, () => {
                console.warn("Sound decode error.");
                if (decodeInfo.fail) {
                    decodeInfo.fail();
                }
                _decoding = false;
                decode();
            });
        }
    }
}
