namespace dou {
    /**
     * 缓动函数集合
     * @author wizardc
     */
    export namespace Ease {
        function getPowIn(pow: number): (t: number) => number {
            return function (t: number) {
                return Math.pow(t, pow);
            }
        }

        function getPowOut(pow: number): (t: number) => number {
            return function (t: number) {
                return 1 - Math.pow(1 - t, pow);
            }
        }

        function getPowInOut(pow: number): (t: number) => number {
            return function (t: number) {
                if ((t *= 2) < 1) return 0.5 * Math.pow(t, pow);
                return 1 - 0.5 * Math.abs(Math.pow(2 - t, pow));
            }
        }

        export const quadIn: (t: number) => number = getPowIn(2);

        export const quadOut: (t: number) => number = getPowOut(2);

        export const quadInOut: (t: number) => number = getPowInOut(2);

        export const cubicIn: (t: number) => number = getPowIn(3);

        export const cubicOut: (t: number) => number = getPowOut(3);

        export const cubicInOut: (t: number) => number = getPowInOut(3);

        export const quartIn: (t: number) => number = getPowIn(4);

        export const quartOut: (t: number) => number = getPowOut(4);

        export const quartInOut: (t: number) => number = getPowInOut(4);

        export const quintIn: (t: number) => number = getPowIn(5);

        export const quintOut: (t: number) => number = getPowOut(5);

        export const quintInOut: (t: number) => number = getPowInOut(5);

        export function sineIn(t: number): number {
            return 1 - Math.cos(t * Math.PI / 2);
        }

        export function sineOut(t: number): number {
            return Math.sin(t * Math.PI / 2);
        }

        export function sineInOut(t: number): number {
            return -0.5 * (Math.cos(Math.PI * t) - 1)
        }

        function getBackIn(amount: number): (t: number) => number {
            return function (t: number) {
                return t * t * ((amount + 1) * t - amount);
            }
        }

        export const backIn: (t: number) => number = getBackIn(1.7);

        function getBackOut(amount: number): (t: number) => number {
            return function (t) {
                return (--t * t * ((amount + 1) * t + amount) + 1);
            }
        }

        export const backOut: (t: number) => number = getBackOut(1.7);

        function getBackInOut(amount: number): (t: number) => number {
            amount *= 1.525;
            return function (t: number) {
                if ((t *= 2) < 1) return 0.5 * (t * t * ((amount + 1) * t - amount));
                return 0.5 * ((t -= 2) * t * ((amount + 1) * t + amount) + 2);
            }
        }

        export const backInOut: (t: number) => number = getBackInOut(1.7);

        export function circIn(t: number): number {
            return -(Math.sqrt(1 - t * t) - 1);
        }

        export function circOut(t: number): number {
            return Math.sqrt(1 - (--t) * t);
        }

        export function circInOut(t: number): number {
            if ((t *= 2) < 1) {
                return -0.5 * (Math.sqrt(1 - t * t) - 1);
            }
            return 0.5 * (Math.sqrt(1 - (t -= 2) * t) + 1);
        }

        export function bounceIn(t: number): number {
            return 1 - bounceOut(1 - t);
        }

        export function bounceOut(t: number): number {
            if (t < 1 / 2.75) {
                return (7.5625 * t * t);
            } else if (t < 2 / 2.75) {
                return (7.5625 * (t -= 1.5 / 2.75) * t + 0.75);
            } else if (t < 2.5 / 2.75) {
                return (7.5625 * (t -= 2.25 / 2.75) * t + 0.9375);
            } else {
                return (7.5625 * (t -= 2.625 / 2.75) * t + 0.984375);
            }
        }

        export function bounceInOut(t: number): number {
            if (t < 0.5) return bounceIn(t * 2) * .5;
            return bounceOut(t * 2 - 1) * 0.5 + 0.5;
        }

        function getElasticIn(amplitude: number, period: number): (t: number) => number {
            let pi2 = Math.PI * 2;
            return function (t: number) {
                if (t == 0 || t == 1) return t;
                let s = period / pi2 * Math.asin(1 / amplitude);
                return -(amplitude * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - s) * pi2 / period));
            }
        }

        export const elasticIn: (t: number) => number = getElasticIn(1, 0.3);

        function getElasticOut(amplitude: number, period: number): (t: number) => number {
            let pi2 = Math.PI * 2;
            return function (t: number) {
                if (t == 0 || t == 1) return t;
                let s = period / pi2 * Math.asin(1 / amplitude);
                return (amplitude * Math.pow(2, -10 * t) * Math.sin((t - s) * pi2 / period) + 1);
            }
        }

        export const elasticOut: (t: number) => number = getElasticOut(1, 0.3);

        function getElasticInOut(amplitude: number, period: number): (t: number) => number {
            let pi2 = Math.PI * 2;
            return function (t: number) {
                let s = period / pi2 * Math.asin(1 / amplitude);
                if ((t *= 2) < 1) return -0.5 * (amplitude * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - s) * pi2 / period));
                return amplitude * Math.pow(2, -10 * (t -= 1)) * Math.sin((t - s) * pi2 / period) * 0.5 + 1;
            }
        }

        export const elasticInOut: (t: number) => number = getElasticInOut(1, 0.3 * 1.5);
    }
}
