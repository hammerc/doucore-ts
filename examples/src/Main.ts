function loadJS(url: string): void {
    document.writeln(`<script src="${url}"></script>`);
}

function loadAllJS(): void {
}

function loadJSAsync(src: string, callback: () => void): void {
    let s = document.createElement("script");
    s.async = false;
    s.src = src;
    s.addEventListener("load", function () {
        s.parentNode.removeChild(s);
        s.removeEventListener("load", <any>arguments.callee, false);
        callback();
    }, false);
    document.body.appendChild(s);
}

class Ticker extends dou.TickerBase {
    protected updateLogic(passedTime: number): void {
    }
}

class Main {
    private _ticker: Ticker;

    public constructor(urlParams: { [key: string]: string }) {
        this._ticker = new Ticker();
        this.startTicker();

        let demo = urlParams.demo;
        loadJSAsync("bin/examples/" + demo + ".js", () => {
            new (<any>window).examples[demo]();
        });
    }

    private startTicker(): void {
        requestAnimationFrame(onTick);
        let ticker = this._ticker;
        function onTick() {
            ticker.update();
            requestAnimationFrame(onTick);
        }
    }
}
