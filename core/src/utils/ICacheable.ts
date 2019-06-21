namespace dou {
    /**
     * 通过对象池进行缓存的对象类型
     * @author wizardc
     */
    export interface ICacheable {
        /**
         * 加入对象池时调用
         */
        onRecycle?(): void;

        /**
         * 从对象池中取出时调用
         */
        onReuse?(): void;
    }
}
