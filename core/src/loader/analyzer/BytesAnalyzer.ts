namespace dou {
    /**
     * 二进制加载器
     * @author wizardc
     */
    export class BytesAnalyzer extends RequestAnalyzerBase {
        protected getResponseType(): HttpResponseType {
            return HttpResponseType.arraybuffer;
        }

        protected dataAnalyze(data: any): any {
            return new ByteArray(data);
        }
    }
}
