(function (Dou) {

    Dou.impl = Dou.impl || {};

    Dou.TickerBase = dou.TickerBase;

    Dou.Event = dou.Event;
    Dou.EventDispatcher = dou.EventDispatcher;
    Dou.IOErrorEvent = dou.IOErrorEvent;
    Dou.ProgressEvent = dou.ProgressEvent;

    Dou.BytesAnalyzer = dou.BytesAnalyzer;
    Dou.JsonAnalyzer = dou.JsonAnalyzer;
    Dou.RequestAnalyzerBase = dou.RequestAnalyzerBase;
    Dou.SoundAnalyzer = dou.SoundAnalyzer;
    Dou.TextAnalyzer = dou.TextAnalyzer;
    Dou.LoadManager = dou.LoadManager;
    Dou.loader = dou.loader;

    Dou.impl.AudioAPIDecode = dou.impl.AudioAPIDecode;
    Dou.impl.AudioAPISound = dou.impl.AudioAPISound;
    Dou.impl.AudioAPISoundChannel = dou.impl.AudioAPISoundChannel;
    Dou.impl.AudioSound = dou.impl.AudioSound;
    Dou.impl.AudioSoundChannel = dou.impl.AudioSoundChannel;
    Dou.Sound = dou.Sound;

    Dou.HttpMethod = dou.HttpMethod;
    Dou.HttpRequest = dou.HttpRequest;
    Dou.HttpResponseType = dou.HttpResponseType;
    Dou.ImageLoader = dou.ImageLoader;
    Dou.Socket = dou.Socket;

    Dou.Ease = dou.Ease;
    Dou.Tween = dou.Tween;

    Dou.BitUtil = dou.BitUtil;
    Dou.ByteArray = dou.ByteArray;
    Dou.getTimer = dou.getTimer;
    Dou.HttpUtil = dou.HttpUtil;
    Dou.ObjectPool = dou.ObjectPool;
    Dou.recyclable = dou.recyclable;
    Dou.DeployPool = dou.DeployPool;
    Dou.deployPool = dou.deployPool;
    Dou.getPoolSize = dou.getPoolSize;
    Dou.clearPool = dou.clearPool;
    Dou.ScriptUtil = dou.ScriptUtil;
    Dou.StringUtil = dou.StringUtil;
    Dou.superGetter = dou.superGetter;
    Dou.superSetter = dou.superSetter;

})((<any>window).Dou || ((<any>window).Dou = {}));
