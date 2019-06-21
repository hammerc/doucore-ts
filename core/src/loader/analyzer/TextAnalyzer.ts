namespace dou {
    /**
     * 文本加载器
     * @author wizardc
     */
    export class TextAnalyzer extends RequestAnalyzerBase {
        protected getResponseType(): HttpResponseType {
            return HttpResponseType.text;
        }

        protected dataAnalyze(data: any): any {
            return data;
        }
    }
}
