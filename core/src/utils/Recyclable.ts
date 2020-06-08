namespace dou {
    export type Recyclable<T> = T & { recycle(): void };

    /**
     * 获取一个可回收的对象
     */
    export function recyclable<T>(creator: Creator<T> & { __pool?: ObjectPool<T> }): Recyclable<T> {
        let pool: ObjectPool<T>;
        if (creator.hasOwnProperty("__pool")) {
            pool = creator.__pool;
        }
        else {
            let maxCount = (<any>creator.prototype.constructor).__cacheMaxCount || 50;
            pool = new ObjectPool(creator, maxCount);
            let prototype = creator.prototype;
            if (!prototype.hasOwnProperty("recycle")) {
                prototype.recycle = function () {
                    pool.join(this);
                };
            }
            creator.__pool = pool;
        }
        return pool.take() as Recyclable<T>;
    }

    /**
     * 对象池配置
     */
    export function deployPool(creator: Creator<any> & { __pool?: ObjectPool<any> }, maxCount: number): void {
        (<any>creator.prototype.constructor).__cacheMaxCount = maxCount;
    }

    /**
     * 获取对象池中的对象数量
     */
    export function getPoolSize(creator: Creator<any> & { __pool?: ObjectPool<any> }): number {
        let pool: ObjectPool<any>;
        if (creator.hasOwnProperty("__pool")) {
            pool = creator.__pool;
        }
        if (pool) {
            return pool.size;
        }
        return 0;
    }

    /**
     * 清空对象池
     */
    export function clearPool(creator: Creator<any> & { __pool?: ObjectPool<any> }): void {
        let pool: ObjectPool<any>;
        if (creator.hasOwnProperty("__pool")) {
            pool = creator.__pool;
        }
        if (pool) {
            pool.clear();
        }
    }
}
