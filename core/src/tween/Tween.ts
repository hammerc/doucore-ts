namespace dou {
    /**
     * 缓动类
     * @author wizardc
     */
    export class Tween extends EventDispatcher {
        /**
         * 不做特殊处理
         */
        private static NONE: number = 0;

        /**
         * 循环
         */
        private static LOOP: number = 1;

        /**
         * 倒序
         */
        private static REVERSE: number = 2;

        private static _tweens: Tween[] = [];

        /**
         * 帧循环逻辑, 请在项目的合适地方进行循环调用
         */
        public static tick(passedTime: number, paused = false): void {
            let tweens = Tween._tweens.concat();
            for (let i = tweens.length - 1; i >= 0; i--) {
                let tween = tweens[i];
                if ((paused && !tween._ignoreGlobalPause) || tween._paused) {
                    continue;
                }
                tween.$tick(tween._useTicks ? 1 : passedTime);
            }
        }

        /**
         * 激活一个对象, 对其添加 Tween 动画
         * @param target 要激活 Tween 的对象
         * @param props 参数
         * @param override 是否移除对象之前添加的tween
         * @returns 缓动对象
         */
        public static get(target: any, props?: { loop?: boolean, onChange?: Function, onChangeObj?: any }, override: boolean = false): Tween {
            if (override) {
                Tween.removeTweens(target);
            }
            return new Tween(target, props);
        }

        /**
         * 暂停某个对象的所有 Tween 动画
         */
        public static pauseTweens(target: any): void {
            if (!target.tween_count) {
                return;
            }
            let tweens = Tween._tweens;
            for (let i = tweens.length - 1; i >= 0; i--) {
                if (tweens[i]._target == target) {
                    tweens[i]._paused = true;
                }
            }
        }

        /**
         * 继续播放某个对象的所有 Tween 动画
         */
        public static resumeTweens(target: any): void {
            if (!target.tween_count) {
                return;
            }
            let tweens = Tween._tweens;
            for (let i = tweens.length - 1; i >= 0; i--) {
                if (tweens[i]._target == target) {
                    tweens[i]._paused = false;
                }
            }
        }

        /**
         * 删除一个对象上的全部 Tween 动画
         */
        public static removeTweens(target: any): void {
            if (!target.tween_count) {
                return;
            }
            let tweens = Tween._tweens;
            for (let i = tweens.length - 1; i >= 0; i--) {
                if (tweens[i]._target == target) {
                    tweens[i]._paused = true;
                    tweens.splice(i, 1);
                }
            }
            target.tween_count = 0;
        }

        /**
         * 删除所有的 Tween 动画
         */
        public static removeAllTweens(): void {
            let tweens = Tween._tweens;
            for (let i = 0, l = tweens.length; i < l; i++) {
                let tween = tweens[i];
                tween._paused = true;
                tween._target.tween_count = 0;
            }
            tweens.length = 0;
        }

        private static _register(tween: Tween, value: boolean): void {
            let target = tween._target;
            let tweens = Tween._tweens;
            if (value) {
                if (target) {
                    target.tween_count = target.tween_count > 0 ? target.tween_count + 1 : 1;
                }
                tweens.push(tween);
            }
            else {
                if (target) {
                    target.tween_count--;
                }
                let i = tweens.length;
                while (i--) {
                    if (tweens[i] == tween) {
                        tweens.splice(i, 1);
                        return;
                    }
                }
            }
        }

        private _target: any;

        private _useTicks: boolean = false;
        private _ignoreGlobalPause: boolean = false;
        private _loop: boolean = false;

        private _curQueueProps: any;
        private _initQueueProps: any;
        private _steps: any[];
        private _paused: boolean = false;
        private _duration: number = 0;
        private _prevPos: number = -1;
        private _position: number;
        private _prevPosition: number = 0;
        private _stepPosition: number = 0;
        private _passive: boolean = false;

        public constructor(target: any, props: any) {
            super();
            this.initialize(target, props);
        }

        private initialize(target: any, props: any): void {
            this._target = target;
            if (props) {
                this._useTicks = props.useTicks;
                this._ignoreGlobalPause = props.ignoreGlobalPause;
                this._loop = props.loop;
                props.onChange && this.on(Event.CHANGE, props.onChange, props.onChangeObj);
                if (props.override) {
                    Tween.removeTweens(target);
                }
            }
            this._curQueueProps = {};
            this._initQueueProps = {};
            this._steps = [];
            if (props && props.paused) {
                this._paused = true;
            }
            else {
                Tween._register(this, true);
            }
            if (props && props.position) {
                this.setPosition(props.position, Tween.NONE);
            }
        }

        /**
         * 设置是否暂停
         */
        public setPaused(value: boolean): Tween {
            if (this._paused == value) {
                return this;
            }
            this._paused = value;
            Tween._register(this, !value);
            return this;
        }

        /**
         * 等待指定毫秒后执行下一个动画
         * @param duration 要等待的时间, 以毫秒为单位
         * @param passive 等待期间属性是否会更新
         * @returns Tween 对象本身
         */
        public wait(duration: number, passive?: boolean): Tween {
            if (duration == null || duration <= 0) {
                return this;
            }
            let o = this._cloneProps(this._curQueueProps);
            return this._addStep({ d: duration, p0: o, p1: o, v: passive });
        }

        /**
         * 将指定对象的属性修改为指定值
         * @param props 对象的属性集合
         * @param duration 持续时间
         * @param ease 缓动算法
         * @returns Tween 对象本身
         */
        public to(props: any, duration?: number, ease?: Function): Tween {
            if (isNaN(duration) || duration < 0) {
                duration = 0;
            }
            this._addStep({ d: duration || 0, p0: this._cloneProps(this._curQueueProps), e: ease, p1: this._cloneProps(this._appendQueueProps(props)) });
            return this.set(props);
        }

        /**
         * 执行回调函数
         * @param callback 回调方法
         * @param thisObj 回调方法 this 作用域
         * @param params 回调方法参数
         * @returns Tween 对象本身
         */
        public call(callback: Function, thisObj?: any, params?: any[]): Tween {
            return this._addAction({ f: callback, p: params ? params : [], o: thisObj ? thisObj : this._target });
        }

        /**
         * 立即将指定对象的属性修改为指定值
         * @param props 对象的属性集合
         * @param target 要继续播放 Tween 的对象
         * @returns Tween 对象本身
         */
        public set(props: any, target?: any): Tween {
            this._appendQueueProps(props);
            return this._addAction({ f: this._set, o: this, p: [props, target ? target : this._target] });
        }

        /**
         * 播放
         * @param tween 需要操作的 Tween 对象, 默认 this
         * @returns Tween 对象本身
         */
        public play(tween?: Tween): Tween {
            if (!tween) {
                tween = this;
            }
            return this.call(tween.setPaused, tween, [false]);
        }

        /**
         * 暂停
         * @param tween 需要操作的 Tween 对象, 默认 this
         * @returns Tween 对象本身
         */
        public pause(tween?: Tween): Tween {
            if (!tween) {
                tween = this;
            }
            return this.call(tween.setPaused, tween, [true]);
        }

        /**
         * @private
         */
        public $tick(delta: number): void {
            if (this._paused) {
                return;
            }
            this.setPosition(this._prevPosition + delta);
        }

        /**
         * @private
         */
        public setPosition(value: number, actionsMode: number = 1): boolean {
            if (value < 0) {
                value = 0;
            }
            let t = value;
            let end = false;
            if (t >= this._duration) {
                if (this._loop) {
                    var newTime = t % this._duration;
                    if (t > 0 && newTime === 0) {
                        t = this._duration;
                    }
                    else {
                        t = newTime;
                    }
                }
                else {
                    t = this._duration;
                    end = true;
                }
            }
            if (t == this._prevPos) {
                return end;
            }
            if (end) {
                this.setPaused(true);
            }
            let prevPos = this._prevPos;
            this._position = this._prevPos = t;
            this._prevPosition = value;
            if (this._target) {
                if (this._steps.length > 0) {
                    let l = this._steps.length;
                    let stepIndex = -1;
                    for (let i = 0; i < l; i++) {
                        if (this._steps[i].type == "step") {
                            stepIndex = i;
                            if (this._steps[i].t <= t && this._steps[i].t + this._steps[i].d >= t) {
                                break;
                            }
                        }
                    }
                    for (let i = 0; i < l; i++) {
                        if (this._steps[i].type == "action") {
                            if (actionsMode != 0) {
                                if (this._useTicks) {
                                    this._runAction(this._steps[i], t, t);
                                }
                                else if (actionsMode == 1 && t < prevPos) {
                                    if (prevPos != this._duration) {
                                        this._runAction(this._steps[i], prevPos, this._duration);
                                    }
                                    this._runAction(this._steps[i], 0, t, true);
                                }
                                else {
                                    this._runAction(this._steps[i], prevPos, t);
                                }
                            }
                        }
                        else if (this._steps[i].type == "step") {
                            if (stepIndex == i) {
                                let step = this._steps[stepIndex];
                                this._updateTargetProps(step, Math.min((this._stepPosition = t - step.t) / step.d, 1));
                            }
                        }
                    }
                }
            }
            dispatcher.event(this, Event.CHANGE);
            return end;
        }

        private _runAction(action: any, startPos: number, endPos: number, includeStart: boolean = false): void {
            let sPos = startPos;
            let ePos = endPos;
            if (startPos > endPos) {
                sPos = endPos;
                ePos = startPos;
            }
            let pos = action.t;
            if (pos == ePos || (pos > sPos && pos < ePos) || (includeStart && pos == startPos)) {
                action.f.apply(action.o, action.p);
            }
        }

        private _updateTargetProps(step: any, ratio: number): void {
            let p0: any, p1: any, v0: any, v1: any, v: any;
            if (!step && ratio == 1) {
                this._passive = false;
                p0 = p1 = this._curQueueProps;
            }
            else {
                this._passive = !!step.v;
                if (this._passive) {
                    return;
                }
                if (step.e) {
                    ratio = step.e(ratio, 0, 1, 1);
                }
                p0 = step.p0;
                p1 = step.p1;
            }
            for (let n in this._initQueueProps) {
                if ((v0 = p0[n]) == null) {
                    p0[n] = v0 = this._initQueueProps[n];
                }
                if ((v1 = p1[n]) == null) {
                    p1[n] = v1 = v0;
                }
                if (v0 == v1 || ratio == 0 || ratio == 1 || (typeof (v0) != "number")) {
                    v = ratio == 1 ? v1 : v0;
                }
                else {
                    v = v0 + (v1 - v0) * ratio;
                }
                this._target[n] = v;
            }
        }

        private _cloneProps(props: any): any {
            let o = {};
            for (let n in props) {
                o[n] = props[n];
            }
            return o;
        }

        private _addStep(o: any): Tween {
            if (o.d > 0) {
                o.type = "step";
                this._steps.push(o);
                o.t = this._duration;
                this._duration += o.d;
            }
            return this;
        }

        private _appendQueueProps(o): any {
            let oldValue: any, injectProps: any;
            for (let n in o) {
                if (this._initQueueProps[n] === undefined) {
                    oldValue = this._target[n];
                    this._initQueueProps[n] = this._curQueueProps[n] = (oldValue === undefined) ? null : oldValue;
                }
                else {
                    oldValue = this._curQueueProps[n];
                }
            }
            for (let n in o) {
                oldValue = this._curQueueProps[n];
                this._curQueueProps[n] = o[n];
            }
            if (injectProps) {
                this._appendQueueProps(injectProps);
            }
            return this._curQueueProps;
        }

        private _addAction(o: any): Tween {
            o.t = this._duration;
            o.type = "action";
            this._steps.push(o);
            return this;
        }

        private _set(props: any, o: any): void {
            for (let n in props) {
                o[n] = props[n];
            }
        }
    }
}
