namespace dou {
    /**
     * 脚本工具类
     * @author wizardc
     */
    export namespace ScriptUtil {
        /**
         * 同步加载 JS 文件
         */
        export function loadJSSync(url: string): void {
            document.write(`<script type="text/javascript" src="${url}"></script>`);
        }

        /**
         * 异步加载 JS 文件, 放在 head 中
         */
        export function loadJSAsync(url: string): void {
            let script = document.createElement("script");
            script.setAttribute("type", "text/javascript");
            script.setAttribute("src", url);
            document.getElementsByTagName("head")[0].appendChild(script);
        }

        /**
         * 异步加载 JS 文件, 放在 body 中
         */
        export function loadJS(url: string, cross?: boolean, callback?: Function, thisObj?: any, ...args): void {
            let script = document.createElement("script");
            script.async = false;
            script.src = url;
            if (cross) {
                script.crossOrigin = "anonymous";
            }
            script.addEventListener("load", function () {
                script.parentNode.removeChild(script);
                script.removeEventListener("load", (<any>arguments).callee, false);
                callback.apply(thisObj, args);
            }, false);
            document.body.appendChild(script);
        }
    }
}
