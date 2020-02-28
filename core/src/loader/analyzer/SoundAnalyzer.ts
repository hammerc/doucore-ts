namespace dou {
    /**
     * 声音加载器
     * @author wizardc
     */
    export class SoundAnalyzer implements IAnalyzer {
        public load(url: string, callback: (url: string, data: any) => void, thisObj: any): void {
            let sound = new Sound();
            sound.on(Event.COMPLETE, () => {
                callback.call(thisObj, url, sound);
            });
            sound.on(IOErrorEvent.IO_ERROR, () => {
                callback.call(thisObj, url);
            });
            sound.load(url);
        }

        public release(data: Sound): boolean {
            if (data) {
                data.close();
                return true;
            }
            return false;
        }
    }
}
