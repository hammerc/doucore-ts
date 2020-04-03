namespace dou {
    /**
     * 字符串工具类
     * @author wizardc
     */
    export namespace StringUtil {
        /**
         * 使用参数替换模板字符串
         */
        export function substitute(str: string, ...rest: string[]): string {
            let len = rest.length;
            for (let i = 0; i < len; i++) {
                str = str.replace(new RegExp("\\{" + i + "\\}", "g"), rest[i]);
            }
            return str;
        }

        /**
         * 字符串是否全是空白字符
         */
        export function isAllWhitespace(str: string): boolean {
            return /^[ \t\r\n\f]*$/.test(str);
        }
    }
}
