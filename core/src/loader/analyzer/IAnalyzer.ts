namespace dou {
    /**
     * 资源加载解析器接口
     * @author wizardc
     */
    export interface IAnalyzer {
        load(url: string, callback: (url: string, data: any) => void, thisObj: any): void;
        release(data: any): boolean;
    }
}
