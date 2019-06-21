namespace dou {
    /**
     * 套接字对象
     * @author wizardc
     */
    export class Socket extends EventDispatcher {
        private _webSocket: WebSocket;
        private _endian: Endian = Endian.bigEndian;
        private _input: ByteArray;
        private _output: ByteArray;

        private _url: string;
        private _connected: boolean = false;

        private _cacheInput: boolean = true;
        private _addInputPosition: number = 0;

        public constructor(host?: string, port?: number) {
            super();
            if (host && port > 0 && port < 65535) {
                this.connect(host, port);
            }
        }

        public set endian(value: Endian) {
            this._endian = value;
        }
        public get endian(): Endian {
            return this._endian;
        }

        public get input(): ByteArray {
            return this._input;
        }

        public get output(): ByteArray {
            return this._output;
        }

        public get url(): string {
            return this._url;
        }

        public get connected(): boolean {
            return this._connected;
        }

        /**
         * 是否缓存服务端发送的数据到输入流中
         */
        public set cacheInput(value: boolean) {
            this._cacheInput = value;
        }
        public get cacheInput(): boolean {
            return this._cacheInput;
        }

        public connect(host: string, port: number): void {
            let url;
            if (window.location.protocol == "https:") {
                url = "wss://" + host + ":" + port;
            } else {
                url = "ws://" + host + ":" + port;
            }
            this.connectByUrl(url);
        }

        public connectByUrl(url: string): void {
            if (this._webSocket) {
                this.close();
            }
            this._url = url;
            this._webSocket = new WebSocket(url);
            this._webSocket.binaryType = "arraybuffer";
            this._input = new ByteArray();
            this._input.endian = this.endian;
            this._output = new ByteArray();
            this._output.endian = this.endian;
            this._addInputPosition = 0;
            this._webSocket.onopen = (event: globalEvent) => {
                this.onOpen(event);
            };
            this._webSocket.onmessage = (messageEvent: MessageEvent) => {
                this.onMessage(messageEvent);
            };
            this._webSocket.onclose = (event: CloseEvent) => {
                this.onClose(event);
            };
            this._webSocket.onerror = (event: globalEvent) => {
                this.onError(event);
            };
        }

        private onOpen(event: globalEvent): void {
            this._connected = true;
            this.dispatch(Event.OPEN);
        }

        private onMessage(messageEvent: MessageEvent): void {
            if (!messageEvent || !messageEvent.data) {
                return;
            }
            let data = messageEvent.data;
            if (!this._cacheInput && data) {
                this.dispatch(Event.MESSAGE, data);
                return;
            }
            if (this._input.length > 0 && this._input.bytesAvailable < 1) {
                this._input.clear();
                this._addInputPosition = 0;
            }
            let pre = this._input.position;
            if (!this._addInputPosition) {
                this._addInputPosition = 0;
            }
            this._input.position = this._addInputPosition;
            if (data) {
                if ((typeof data == "string")) {
                    this._input.writeUTFBytes(data);
                } else {
                    this._input.writeUint8Array(new Uint8Array(data));
                }
                this._addInputPosition = this._input.position;
                this._input.position = pre;
            }
            this.dispatch(Event.MESSAGE, data);
        }

        private onClose(event: CloseEvent): void {
            this._connected = false;
            this.dispatch(Event.CLOSE);
        }

        private onError(event: globalEvent): void {
            IOErrorEvent.dispatch(this, IOErrorEvent.IO_ERROR, `Socket connect error: ${this._url}`);
        }

        public send(data: string | ArrayBuffer): void {
            this._webSocket.send(data);
        }

        public flush(): void {
            if (this._output && this._output.length > 0) {
                let error;
                try {
                    if (this._webSocket) {
                        this._webSocket.send(this._output.buffer);
                    }
                } catch (e) {
                    error = e;
                }
                this._output.endian = this.endian;
                this._output.clear();
                if (error) {
                    IOErrorEvent.dispatch(this, IOErrorEvent.IO_ERROR, `Socket connect error: ${this._url}`);
                }
            }
        }

        public close(): void {
            if (this._webSocket) {
                this.cleanSocket();
            }
        }

        private cleanSocket() {
            this._webSocket.close();
            this._connected = false;
            this._webSocket.onopen = null;
            this._webSocket.onmessage = null;
            this._webSocket.onclose = null;
            this._webSocket.onerror = null;
            this._webSocket = null;
            this._url = null;
        }
    }
}
