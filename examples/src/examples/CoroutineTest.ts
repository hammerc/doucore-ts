namespace examples {
    export class CoroutineTest {
        private _num = 0;

        public constructor() {
            dou.Coroutine.start(this.coroutineTest, this);
        }

        public * coroutineTest() {
            while (this._num < 100) {
                this._num++;
                console.log("coroutineTest", 1, this._num);
                yield;
            }
            yield* this.part2();
            console.log("开始等待 1 秒");
            yield* this.waitTime(1000);
            console.log("等待结束");
        }

        private * part2() {
            while (this._num < 150) {
                this._num++;
                console.log("coroutineTest", 2, this._num);
                yield;
            }
        }

        private * waitTime(millisecond: number) {
            let endTime = dou.getTimer() + millisecond;
            while (dou.getTimer() < endTime) {
                yield;
            }
        }
    }
}
