namespace dou {
    /**
     * 图片加载器
     * @author wizardc
     */
    export class ImageLoader extends EventDispatcher {
        /**
         * 默认是否开启跨域访问控制
         */
        public static crossOrigin: boolean = false;

        private _data: HTMLImageElement;
        private _crossOrigin: boolean;
        private _currentImage: HTMLImageElement;

        /**
         * 是否开启跨域访问控制
         */
        public set crossOrigin(value: boolean) {
            this._crossOrigin = value;
        }
        public get crossOrigin(): boolean {
            return this._crossOrigin;
        }

        public get data(): HTMLImageElement {
            return this._data;
        }

        public load(url: string): void {
            this._data = null;
            let image = this._currentImage = new Image();
            if (this._crossOrigin !== null) {
                if (this._crossOrigin) {
                    image.crossOrigin = "anonymous";
                }
            } else {
                if (ImageLoader.crossOrigin) {
                    image.crossOrigin = "anonymous";
                }
            }
            image.onload = this.onLoad.bind(this);
            image.onerror = this.onError.bind(this);
            image.src = url;
        }

        private getImage(element: HTMLImageElement): HTMLImageElement {
            element.onload = element.onerror = null;
            if (this._currentImage === element) {
                this._data = element;
                this._currentImage = null;
                return element;
            }
            return null;
        }

        private onLoad(event: globalEvent): void {
            let image = this.getImage(<any>event.target);
            if (image) {
                setTimeout(() => {
                    this.dispatch(Event.COMPLETE);
                }, 0);
            }
        }

        private onError(event: globalEvent): void {
            let image = this.getImage(<any>event.target);
            if (image) {
                setTimeout(() => {
                    IOErrorEvent.dispatch(this, IOErrorEvent.IO_ERROR, `Image load error: ${image.src}`);
                }, 0);
            }
        }
    }
}
