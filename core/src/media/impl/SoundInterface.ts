namespace dou.impl {
    /**
     * 声音接口
     * @author wizardc
     */
    export interface ISound extends IEventDispatcher {
        readonly length: number;
        load(url: string): void;
        play(startTime?: number, loops?: number): SoundChannel;
        close(): void;
    }

    export let soundImpl: { new(target: any): ISound };

    let context: AudioContext;
    try {
        context = new (window["AudioContext"] || window["webkitAudioContext"] || window["mozAudioContext"])();
    }
    catch (error) {
    }
    if (context) {
        AudioAPIDecode.init(context);
        soundImpl = AudioAPISound;
    }
    else {
        soundImpl = AudioSound;
    }
}
