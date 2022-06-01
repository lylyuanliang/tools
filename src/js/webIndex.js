import Service from "./service/Service.js";

layui.use(["form", "element", "table", "laydate"], function () {
    debugger;
    let form = layui.form;
    let $ = layui.$;
    let layer = layui.layer;
    let element = layui.element;
    let table = layui.table;
    let laydate = layui.laydate;

    let service = new Service($, layer);
    let index = new WebIndex($, service, element);

    service.init(index.buildServiceTypeView($, form));

    // select change 事件
    form.on("select(serviceType)", function (data) {
        index.change4Select(data.value, data.elem);
    });

    // 点击方法名, 展示其所有版本
    $("body").on("click", ".layui-collapse", function () {
        let functionName = $(this).find(".layui-colla-title label").html();
        let li = $(this).parents().find("li[serviceType]");
        let serviceType = li.attr("serviceType");
        service.listVersionByFunction(serviceType, functionName, (data) => {
            let versionHtml = index.buildFunctionVersionView(data);
            $(this).find(".layui-colla-content").html(versionHtml);
            element.render();
        });
    });

    // 展示接口详情界面
    $("body").on("click", `[name="funcNameAndVersion"]`, function () {
        let functionNameAndVersion = $(this).html();
        let li = $(this).parents().find("li[serviceType]");
        let serviceType = li.attr("serviceType");
        let serviceContext = li.attr("serviceContext");

        let funArray = functionNameAndVersion.split(".");
        let functionVersion = funArray[0];
        let functionName = functionNameAndVersion.substring(functionNameAndVersion.indexOf(functionVersion) + 2);

        let baseUrl = index.getBaseUrl();

        // url
        $(`input[lay-filter="serviceUrl"]`).val(`${baseUrl}`);
        $(`input[lay-filter="serviceContext"]`).val(`${serviceContext}`);
        // 获取接口名称
        $(`input[lay-filter="functionName"]`).val(functionName);
        // 获取接口版本
        $(`input[lay-filter="functionVersion"]`).val(functionVersion);

        service.getFunctionDetail(serviceType, functionNameAndVersion, function (data) {
            index.buildFunctionParamsView(data);
            //执行一个laydate实例
            laydate.render({
                elem: '[user-date="date"]', //指定元素
                type: "datetime"
            });
            form.render();
            index.showDetailView();
        });
    });

    $(".user-service-detail-shadow").on("click", function (event) {
        index.hideDetailView();
    });

    $(".user-service-detail").on("click", function (event) {
        event.stopPropagation();
    });

    // 接口提交
    $("#submit").on("click", function (e) {
        let params = index.getParams();

        // 获取url
        let serviceContext = $(`input[lay-filter="serviceContext"]`).val();
        // http 类型
        let httpVerb = $(`input[name='httpVerb']:checked`).val();

        // todo 组装参数
        if ("GET" == httpVerb) {
            params = service.buildParam4Get(params);
        }

        // 发送请求
        service.send(serviceContext, params, httpVerb, function (res) {
            if (!((res instanceof String) || (typeof res).toLowerCase() == 'string')) {
                res = JSON.stringify(res);
            }
            $(`.user-service-result blockquote`).html(res);
        });
    });

    // 方法列表收缩展开
    $("body").on("click", `li[name="funLi"] i`, function () {
        let ele = $(this);
        let li = ele.parent(`li`);
        let iEl = li.find(`i[name="headerMark"]`);
        let mark = iEl.attr("status");
        // &#xe61f;  ==> +
        // &#xe616;  ===> -
        if("1" == mark) {
            //status==1表示当前符号为-, 点击事件发生后, 需要改为+号
            iEl.html("&#xe61f;");
            iEl.attr("status", "2");
        }else if("2" == mark) {
            //status==2表示当前符号为-, 点击事件发生后, 需要改为-号
            iEl.html("&#xe616;");
            iEl.attr("status", "1");
        }
        li.find(`div[name="funListInType"]`).toggle("slow");
        li.find(`span[name="number"]`).toggle("fast");
    });

})

class WebIndex {
    constructor($, service, element) {
        this.$ = $;
        this.service = service;
        this.element = element;
    }

    /**
     * 展示所有接口类型列表
     * @param data 数据
     */
    buildServiceTypeView($, form) {
        return (data) => {
            let select = $("#serviceType select");
            select.html($("<option value=''>----请选择一个接口类型---</option>"));
            $.each(data, (index, obj) => {
                let context = obj.context;
                let code = obj.code;

                let option = $("<option></option>");
                option.attr("value", context);
                option.html(code);

                select.append(option);

            });
            form.render();
        }
    }

    /**
     *
     * @param value
     * @param eleSelected
     */
    change4Select(value, eleSelected) {
        let context = value;
        let serviceType = this.$(eleSelected).find("option:selected").text();
        this.service.getFunctionList(serviceType, this.buildFunctionListView(this.$, this.element, context, serviceType));
    }

    /**
     * 接口列表
     * @param $
     * @param element
     * @returns {function(...[*]=)}
     */
    buildFunctionListView($, element, serviceContext, serviceType) {
        return (data) => {
            // 1. tab标题
            let li = $(`<li serviceType="${serviceType}" serviceContext="${serviceContext}">${serviceContext}</li>`);
            let tabItemDiv = $(`<div class="layui-tab-item"></div>`);
            let functionListUl = this.buildFunctionListUl(data);
            tabItemDiv.append(functionListUl);

            $(`[name="tabTitle"]`).append(li);
            $(`[name="tabContent"]`).append(tabItemDiv);
            element.render();

            li.click();
        }
    }

    /**
     * 创建方法列表视图
     * @param data
     * @returns {*}
     */
    buildFunctionListUl(data) {
        let lis = "";
        this.$.each(data, (type, funNameList) => {
            lis += `
                <li class="layui-timeline-item" name="funLi">
                    <i class="layui-icon layui-timeline-axis" name="headerMark" status="2">&#xe61f;</i>
                    <div class="layui-timeline-content layui-text">
                        <h3 class="layui-timeline-title">${type}<span class="layui-badge-rim" name="number">${funNameList.length}</span></h3>
                        <div name="funListInType" style="display: none">
                            ${this.buildFunctionListLi(funNameList)}
                        </div>
                    </div>
                </li>
            `;
        });

        let endLi = this.$(`
                    <li class="layui-timeline-item">
                        <i class="layui-icon layui-timeline-axis">&#xe617;</i>
                        <div class="layui-timeline-content layui-text">
                            <div class="layui-timeline-title">----------------我的底线--------------</div>
                        </div>
                    </li>`);

        // 列表视图
        let ul = this.$(`<ul class="layui-timeline"></ul>`);
        ul.append(this.$(lis));
        ul.append(endLi);
        return ul;
    }

    /**
     * 方法列表(同一个type)
     * @param funNameList
     * @returns {string}
     */
    buildFunctionListLi(funNameList) {
        let innerHtml = "";
        this.$.each(funNameList, (index, funName) => {
            innerHtml += `
                    <div class="layui-collapse">
                        <div class="layui-colla-item">
                            <h6 class="layui-colla-title"><label>${funName}</label></h6>
                            <div class="layui-colla-content">
                               
                            </div>
                        </div>
                    </div>`;
        });
        return innerHtml;
    }

    /**
     * 创建方法版本视图
     * @param versions
     * @returns {string}
     */
    buildFunctionVersionView(versions) {
        let versionTrHtml = "";
        this.$.each(versions, function (index, functionVersion) {
            versionTrHtml += `
                <tr>
                    <td>
                        <div name="funcNameAndVersion">${functionVersion}</div>
                    </td>
                </tr>
            `;
        });

        let versionHtml = ` 
                <table class="layui-table" lay-skin="line" lay-filter="fun-versions">
                    <colgroup>
                        <col>
                    </colgroup>
                    <tbody>
                        ${versionTrHtml}
                    </tbody>
                </table>`;

        return versionHtml;
    }

    /**
     * 展示方法参数
     */
    buildFunctionParamsView(data) {
        let paramDetailHtml = "";
        this.$.each(data, function (index, paramDetail) {
            let parameterType = paramDetail["parameterType"];
            let parameterName = paramDetail["parameterName"];
            paramDetailHtml += `
                <div class="layui-inline" style="width: 100%" lay-filter="paramsInfo">
                    <label class="layui-form-label" name="parameterType">${parameterType}</label>
                    <label class="layui-form-label" style="width: auto; min-width: 110px;">${parameterName}</label>
                    <div class="layui-input-inline" style="width: 50%">
                        <input type="text" name="title" lay-verify="title" autocomplete="off"
                               placeholder="请输入参数值"
                               class="layui-input" user-date="${parameterType == "DateTime" ? "date" : ""}">
                    </div>
                </div>
            `;
        });
        this.$(".user-param-detail").html(paramDetailHtml);
    }

    showDetailView() {
        this.$(`[name="serviceDetail"]`).show();
    }

    hideDetailView() {
        this.$(`[name="serviceDetail"]`).hide();
    }

    getParams() {
        // 获取参数信息
        let paramElArray = this.$(`[lay-filter="paramsInfo"]`);
        let paramArray = [];
        this.$.each(paramElArray, (index, paramEl) => {
            let parameterType = this.$(paramEl).find(`label[name="parameterType"]`).html();
            let paramValue = this.$(paramEl).find(`input`).val();

            paramArray[paramArray.length++] = {
                "Type": parameterType,
                "Value": paramValue
            };
        });

        // 获取接口名称
        let functionName = this.$(`input[lay-filter="functionName"]`).val();
        // 获取接口版本
        let functionVersion = this.$(`input[lay-filter="functionVersion"]`).val();

        let params = {
            "Version": "2.1",
            "Function": {"Name": functionName, "Version": functionVersion},
            "Params": paramArray
        };

        return params;
    }

    getBaseUrl() {
        let cur = window.document.location.href;
        let pathname = window.document.location.pathname;
        let pos = cur.indexOf(pathname);
        let localhostPath = cur.substring(0, pos);

        return localhostPath;
    }
}