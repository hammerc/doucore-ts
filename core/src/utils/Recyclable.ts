namespace dou {
    export type Recyclable<T> = T & {recycle(): void};

    /**
     * 获取一个可回收的对象
     */
    export function recyclable<T>(creator: Creator<T> & {__pool?: ObjectPool<T>}): Recyclable<T> {
        let pool: ObjectPool<T> = creator.__pool;
        if (!pool) {
            let maxCount = (<any> creator.prototype.constructor).__cacheMaxCount || 50;
            pool = new ObjectPool(creator, maxCount);
            let prototype = creator.prototype;
            if (!prototype.hasOwnProperty("recycle")) {
                prototype.recycle = function() {
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
    export function deployPool(targetClass: {new(): any}, maxCount: number): void {
        (<any> targetClass.prototype.constructor).__cacheMaxCount = maxCount;
    }
}
