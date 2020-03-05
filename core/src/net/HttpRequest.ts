namespace dou {
    /**
     * HTTP 请求类
     * @author wizardc
     */
    export class HttpRequest extends EventDispatcher {
        private _xhr: XMLHttpRequest;
        private _responseType: HttpResponseType;
        private _withCredentials: boolean;
        private _headerMap: { [key: string]: string };

        private _url: string;
        private _method: HttpMethod;

        public constructor() {
            super();
        }

        public set responseType(value: HttpResponseType) {
            this._responseType = value;
        }
        public get responseType(): HttpResponseType {
            return this._responseType;
        }

        public set withCredentials(value: boolean) {
            this._withCredentials = value;
        }
        public get withCredentials(): boolean {
            return this._withCredentials;
        }

        public get response(): any {
            if (this._xhr) {
                return this._xhr.response;
            }
            return null;
        }

        public setRequestHeader(header: string, value: string): void {
            if (!this._headerMap) {
                this._headerMap = {};
            }
            this._headerMap[header] = value;
        }

        public getResponseHeader(header: string): string {
            return this._headerMap[header];
        }

        public getAllResponseHeaders(): { [key: string]: string } {
            return this._headerMap;
        }

        public open(url: string, method: HttpMethod = HttpMethod.GET): void {
            this._url = url;
            this._method = method;
            if (this._xhr) {
                this._xhr.abort();
                this._xhr = null;
            }
            this._xhr = new XMLHttpRequest();
            this._xhr.onreadystatechange = this.onReadyStateChange.bind(this);
            this._xhr.onprogress = this.updateProgress.bind(this);
            this._xhr.open(HttpMethod[this._method], this._url, true);
        }

        public send(data?: any): void {
            if (this._responseType) {
                this._xhr.responseType = <any>HttpResponseType[this._responseType];
            }
            if (this._withCredentials) {
                this._xhr.withCredentials = true;
            }
            if (this._headerMap) {
                for (let key in this._headerMap) {
                    this._xhr.setRequestHeader(key, this._headerMap[key]);
                }
            }
            this._xhr.send(data);
        }

        private onReadyStateChange(event?: any): void {
            let xhr = this._xhr;
            if (xhr.readyState == 4) {
                let ioError = (xhr.status >= 400 || xhr.status == 0);
                setTimeout(() => {
                    if (ioError) {
                        this.dispatchIOErrorEvent(IOErrorEvent.IO_ERROR, `Request Error: ${this._url}`);
                    }
                    else {
                        this.dispatchEvent(Event.COMPLETE);
                    }
                }, 0);
            }
        }

        private updateProgress(event?: any): void {
            if (event.lengthComputable) {
                this.dispatchProgressEvent(ProgressEvent.PROGRESS, event.loaded, event.total);
            }
        }

        public abort(): void {
            if (this._xhr) {
                this._xhr.abort();
                this._xhr = null;
            }
            this._url = null;
            this._method = null;
        }
    }
}
