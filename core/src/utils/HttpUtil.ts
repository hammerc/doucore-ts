namespace dou {
    /**
     * HTTP 请求工具类
     * @author wizardc
     */
    export namespace HttpUtil {
        export function addParamToUrl(url: string, data: Object): string {
            if (data) {
                for (let key in data) {
                    let value = data[key];
                    url += "&" + key + "=" + value;
                }
                if (url.indexOf("?") == -1) {
                    url = url.replace("&", "?");
                }
            }
            return url;
        }

        export function get(url: string, callback?: (response: any) => void, thisObj?: any, errorCallback?: (status: number) => void, errorThisObj?: any): void {
            request("GET", url, null, callback, thisObj, errorCallback, errorThisObj);
        }

        export function post(url: string, data?: any, callback?: (response: any) => void, thisObj?: any, errorCallback?: (status: number) => void, errorThisObj?: any): void {
            request("POST", url, data, callback, thisObj, errorCallback, errorThisObj);
        }

        function request(method: string, url: string, data?: any, callback?: (response: any) => void, thisObj?: any, errorCallback?: (status: number) => void, errorThisObj?: any): void {
            let xhr = new XMLHttpRequest();
            xhr.onreadystatechange = () => {
                if (xhr.readyState == 4) {
                    let error = (xhr.status >= 400 || xhr.status == 0);
                    if (error) {
                        if (errorCallback) {
                            errorCallback.call(errorThisObj, xhr.status);
                        }
                    }
                    else {
                        if (callback) {
                            callback.call(thisObj, xhr.response);
                        }
                    }
                }
            };
            xhr.open(method, url, true);
            switch (typeof data) {
                case "string":
                    break;
                case "object":
                    data = JSON.stringify(data);
                    break;
                default:
                    data = "" + data;
            }
            xhr.send(data);
        }
    }
}
