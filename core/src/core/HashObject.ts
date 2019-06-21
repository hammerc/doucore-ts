namespace dou {
    export let hashCount: number = 1;

    /**
     * 带有 Hash 码的对象
     * @author wizardc
     */
    export abstract class HashObject {
        private _hashCode: number;

        public constructor() {
            this._hashCode = hashCount++;
        }

        public get hashCode(): number {
            return this._hashCode;
        }
    }
}
