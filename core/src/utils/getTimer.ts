namespace dou {
    /**
     * 获取引擎启动之后经过的毫秒数
     */
    export function getTimer(): number {
        return Date.now() - TickerBase.$startTime;
    }
}
