export default class WebService {
    constructor($, layer) {
        if(!WebService.instance) {
            this.$ = $;
            this.baseUrl = "/customize";
            this.layer = layer;

            WebService.instance = this;
        }

        return WebService.instance;
    }

    /**
     * 初始化方法
     */
    init(callback) {
        this.getServiceTypeList(callback);
    }

    /**
     * 获取接口列表
     */
    getServiceTypeList(callback) {
        let param = {
            actionName: "ServiceTypeList"
        }

        let url = this.baseUrl;

        this.send(url, param, callback)
    }

    /**
     * 获取接口方法列表
     */
    getFunctionList(serviceType, callback) {
        let url = this.baseUrl;
        let param = {
            actionName: "FunctionList",
            params: `{"serviceType": "${serviceType}"}`
        };
        this.send(url, param, callback)
    }

    /**
     * 获取接口方法列表和对应版本信息
     */
    getFunctionListAndVersion(serviceType, callback) {
        let url = this.baseUrl;
        let param = {
            actionName: "FunctionListAndVersions",
            params: `{"serviceType": "${serviceType}"}`
        };
        this.send(url, param, callback);
    }

    /**
     * 列出接口所有版本
     */
    listVersionByFunction(serviceType, functionName, callback) {
        let url = this.baseUrl;
        let param = {
            actionName: "FunctionVersions",
            params: `{"serviceType": "${serviceType}", "functionName": "${functionName}"}`
        };
        this.send(url, param, callback);
    }

    /**
     * 获取接口详情
     */
    getFunctionDetail(serviceType, functionName, callback) {
        let url = this.baseUrl;
        let param = {
            actionName: "FunctionDetail",
            params: `{"serviceType": "${serviceType}", "functionName": "${functionName}"}`
        };
        this.send(url, param, callback)
    }

    /**
     * 发送请求
     * @param url 请求地址
     * @param param 请求参数
     * @param callback 数据回调
     */
    send(url, param, typeOrCallback, callback) {
        let method = this.$.get;

        if(typeof typeOrCallback === "function") {
            callback = typeOrCallback;
        }

        if (typeOrCallback && "POST" === typeOrCallback) {
            method = this.$.post;
        }

        method(url, param, (res) => {
            let data ;
            try {
                res = JSON.parse(res);
            }catch (e) {
                data = res;
            }
            if (res["Result"] && res["Result"] != "true") {
                this.layer.msg(res["ErrorMessage"]);
            } else if(res["Data"]) {
                data = res["Data"];
                if (!data) {
                    this.layer("数据返回为空啦!");
                    return;
                }
            }

            if (callback && typeof callback === "function") {
                callback(data);
            } else {
                this.layer("数据查询成功, 但无任何操作!");
                return data;
            }
        });

    }

    /**
     * 组装get参数部分
     * @param param json格式的参数
     * {
     *   "Version" :"2.1",
     *   "Function":{"Name":"接口名称","Version":"接口版本"},
     *   "Params":[
     *              {"Type":"参数1字段类型","Value":"字符串参数值1"},
     *              {"Type":"参数2字段类型","Value":"字符串参数值2"},
     *              {"Type":"参数3字段类型","Value":整形参数值3 },
     *              {"Type":"参数4字段类型","Value":[2,3,1,4,5]}
     *            ]
     *  }
     *  return 接口名称|接口版本|参数1字段类型;参数1值|参数2字段类型;参数2值
     */
    buildParam4Get(param) {
        let funcObj = param["Function"];
        let functionName = funcObj["Name"];
        let funVersion = funcObj["Version"];

        let paramArray = param["Params"] || [];

        let pa = "";
        this.$.each(paramArray, (index, obj) => {
            pa += `|${obj["Type"]};${obj["Value"]}`
        });

        return {"iquery":`${functionName}|${funVersion}${pa}`};
    }
}