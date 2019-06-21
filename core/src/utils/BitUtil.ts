namespace dou {
    /**
     * 位运算工具类
     * @author wizardc
     */
    export namespace BitUtil {
        /**
         * @param position 指定的位的位置, 从低位开始, 范围为 [0-64)
         * @param value 设置为 1 (true) 还是 0 (false)
         */
        export function setBit(target: number, position: number, value: boolean): number {
            if (value) {
                target |= 1 << position;
            } else {
                target &= ~(1 << position);
            }
            return target;
        }

        /**
         * @param position 指定的位的位置, 从低位开始, 范围为 [0-64)
         * @returns 对应的值为 1 (true) 还是 0 (false)
         */
        export function getBit(target: number, position: number): boolean {
            return target == (target | (1 << position));
        }

        /**
         * @param position 指定的位的位置, 从低位开始, 范围为 [0-64)
         * @returns 对应的值为 1 (true) 还是 0 (false)
         */
        export function switchBit32(target: number, position: number): number {
            target ^= 1 << position;
            return target;
        }
    }
}
