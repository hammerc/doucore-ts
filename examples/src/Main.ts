class Main {
    public js = [
        "",
    ];

    public constructor() {
        this.loadNextJS();
    }

    private loadNextJS(): void {
        if (this.js.length > 0) {
            let path = this.js.shift();
            dou.ScriptUtil.loadJS(path, true, this.loadNextJS, this);
        } else {
            this.onComplete();
        }
    }

    private onComplete(): void {
        
    }
}
