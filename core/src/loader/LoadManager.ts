namespace dou {
    /**
     * 加载管理器
     * @author wizardc
     */
    export class LoadManager {
        private static _instance: LoadManager;

        public static get instance(): LoadManager {
            return LoadManager._instance || (LoadManager._instance = new LoadManager());
        }

        private _maxLoadingThread: number = 5;

        private _resourceRoot: string = "";

        private _analyzerMap: { [key: string]: IAnalyzer };
        private _extensionMap: { [key: string]: string };

        private _priorityList: number[];
        private _priorityMap: { [priority: number]: ResourceItem[] };
        private _keyMap: { [key: string]: ResourceItem[] };

        private _loadingMap: { [key: string]: boolean };

        private _cacheTypeMap: { [url: string]: string };
        private _cacheDataMap: { [url: string]: any };

        private _nowLoadingThread: number = 0;

        private constructor() {
            this._analyzerMap = {};
            this._extensionMap = {};

            this._priorityList = [];
            this._priorityMap = {};
            this._keyMap = {};

            this._loadingMap = {};

            this._cacheTypeMap = {};
            this._cacheDataMap = {};
        }

        /**
         * 最大的下载线程数
         */
        public set maxLoadingThread(value: number) {
            this._maxLoadingThread = value;
        }
        public get maxLoadingThread(): number {
            return this._maxLoadingThread;
        }

        /**
         * 资源根路径
         */
        public set resourceRoot(value: string) {
            this._resourceRoot = value || "";
        }
        public get resourceRoot(): string {
            return this._resourceRoot;
        }

        /**
         * 注册加载器
         */
        public registerAnalyzer(type: string, analyzer: IAnalyzer): void {
            this._analyzerMap[type] = analyzer;
        }

        /**
         * 注册后缀名和其对应的默认类型
         */
        public registerExtension(extension: string, type: string): void {
            this._extensionMap[extension] = type;
        }

        /**
         * 加载指定项
         */
        public load(url: string, callback?: (data: any, url: string) => void, thisObj?: any, type?: string, priority: number = 0, cache: boolean = true): void {
            if (this.isLoaded(url)) {
                callback.call(thisObj, this.get(url), url);
                return;
            }
            if (!type) {
                type = this.getDefaultType(url);
            }
            if (!this._analyzerMap[type]) {
                console.error(`Can not find resource type: "${type}"`);
                return;
            }
            let item: ResourceItem = { url, type, priority, cache, callback, thisObj };
            if (!this._priorityMap[priority]) {
                this._priorityList.push(priority);
                this._priorityList.sort(this.sortFunc);
                this._priorityMap[priority] = [];
            }
            let list = this._priorityMap[priority];
            list.push(item);
            if (!this._keyMap[item.url]) {
                this._keyMap[item.url] = [];
            }
            this._keyMap[item.url].push(item);
            this.loadNext();
        }

        private getDefaultType(url: string): string {
            let suffix: string;
            let regexp = /\.(\w+)\?|\.(\w+)$/;
            let result = regexp.exec(url);
            if (result) {
                suffix = result[1] || result[2];
            }
            if (this._extensionMap.hasOwnProperty(suffix)) {
                return this._extensionMap[suffix];
            }
            return suffix;
        }

        private sortFunc(a: number, b: number): number {
            return b - a;
        }

        private loadNext(): void {
            if (this._nowLoadingThread >= this._maxLoadingThread) {
                return;
            }
            let item: ResourceItem;
            for (let priority of this._priorityList) {
                let list = this._priorityMap[priority];
                if (list.length > 0) {
                    item = list.shift();
                    break;
                }
            }
            if (item) {
                if (this._loadingMap[item.url]) {
                    this.loadNext();
                }
                else {
                    this._nowLoadingThread++;
                    this._loadingMap[item.url] = true;
                    let analyzer = this._analyzerMap[item.type];
                    analyzer.load(this._resourceRoot + item.url, (url, data) => {
                        this._nowLoadingThread--;
                        delete this._loadingMap[url];
                        let items = this._keyMap[url];
                        if (items && items.length > 0) {
                            for (let item of items) {
                                if (this._priorityMap[item.priority]) {
                                    let list = this._priorityMap[item.priority];
                                    let index = list.indexOf(item);
                                    if (index != -1) {
                                        list.splice(index, 1);
                                    }
                                }
                                if (item.cache && data) {
                                    this._cacheTypeMap[item.url] = item.type;
                                    this._cacheDataMap[item.url] = data;
                                }
                                if (item.callback) {
                                    item.callback.call(item.thisObj, data, url);
                                }
                            }
                            delete this._keyMap[url];
                        }
                        this.loadNext();
                    }, this);
                }
            }
        }

        public loadAsync(url: string, type?: string, priority: number = 0, cache: boolean = true): Promise<any> {
            return new Promise<any>((resolve: (value?: any) => void, reject: (reason?: any) => void) => {
                this.load(url, (url, data) => {
                    if (data) {
                        resolve(data);
                    }
                    else {
                        reject("Load Error: " + url);
                    }
                }, this, type, priority, cache);
            });
        }

        /**
         * 加载多个指定项
         */
        public loadGroup(items: { url: string, type?: string, priority?: number, cache?: boolean }[], callback?: (current: number, total: number, url: string, data: any) => void, thisObj?: any): void {
            let current = 0, total = items.length;
            let itemCallback = (url: string, data: any) => {
                current++;
                callback.call(thisObj, current, total, url, data);
            };
            for (let item of items) {
                this.load(item.url, itemCallback, this, item.type, item.priority, item.cache);
            }
        }

        public loadGroupAsync(items: { url: string, type?: string, priority?: number, cache?: boolean }[]): Promise<void> {
            return new Promise<any>((resolve: (value?: any) => void, reject: (reason?: any) => void) => {
                this.loadGroup(items, (current, total, url, data) => {
                    if (current == total) {
                        resolve();
                    }
                }, this);
            });
        }

        /**
         * 资源是否已经加载并缓存
         */
        public isLoaded(url: string): boolean {
            return this._cacheDataMap.hasOwnProperty(url);
        }

        /**
         * 获取已经加载并缓存的资源
         */
        public get(url: string): any {
            return this._cacheDataMap[url];
        }

        /**
         * 释放已经加载并缓存的资源
         */
        public release(url: string): boolean {
            if (this.isLoaded(url)) {
                let type = this._cacheTypeMap[url];
                let analyzer = this._analyzerMap[type];
                if (!analyzer) {
                    return false;
                }
                let data = this._cacheDataMap[url];
                let success = analyzer.release(data);
                if (success) {
                    delete this._cacheTypeMap[url];
                    delete this._cacheDataMap[url];
                }
                return success;
            }
            return false;
        }
    }

    interface ResourceItem {
        url: string;
        type: string;
        priority: number;
        cache: boolean;
        callback: Function;
        thisObj: any;
    }

    /**
     * 加载管理器快速访问
     */
    export const loader = LoadManager.instance;
}
