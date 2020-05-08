namespace dou {
    /**
     * 实际地址控制器
     * @author wizardc
     */
    export interface IPathController {
        /**
         * 获取实际的 URL 地址
         */
        getVirtualUrl(url: string): string;
    }
}
