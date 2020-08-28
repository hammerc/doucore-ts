namespace dou {
    /**
     * HTTP 请求加载器基类
     * @author wizardc
     */
    export abstract class RequestAnalyzerBase implements IAnalyzer {
        protected abstract getResponseType(): HttpResponseType;

        protected abstract dataAnalyze(data: any): any;

        public load(url: string, callback: (url: string, data: any) => void, thisObj: any): void {
            let request = new HttpRequest();
            request.responseType = this.getResponseType();
            request.on(Event.COMPLETE, (event: Event) => {
                callback.call(thisObj, url, this.dataAnalyze(request.response));
            }, this);
            request.on(IOErrorEvent.IO_ERROR, (event: IOErrorEvent) => {
                callback.call(thisObj, url);
            }, this);
            request.open(url, HttpMethod.GET);
            request.send();
        }

        public release(url: string, data: any): boolean {
            return true;
        }
    }
}
