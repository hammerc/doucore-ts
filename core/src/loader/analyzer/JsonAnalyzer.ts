namespace dou {
    /**
     * JSON 加载器
     * @author wizardc
     */
    export class JsonAnalyzer extends RequestAnalyzerBase {
        protected getResponseType(): HttpResponseType {
            return HttpResponseType.text;
        }

        protected dataAnalyze(data: any): any {
            return JSON.parse(data);
        }
    }
}
