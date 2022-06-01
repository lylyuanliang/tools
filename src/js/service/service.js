import SysType from "../enum/SysType.js";
import WebService from "./webService.js";
import JarService from "./jarService.js";

export default class Service {
    constructor($, layer) {
        if(!Service.instance) {
            // 本地接口
            this.webService = new WebService($, layer);
            // 远程接口
            this.jarService = new JarService();

            Service.instance = this;
        }

        return Service.instance;
    }

    /**
     * 初始化方法
     * @callback 回调方法
     * @sysType 类型, 本地接口或远程接口
     */
    init(callback, sysType) {
        this.getServiceTypeList(callback, sysType);
    }

    /**
     * 获取接口列表
     */
    getServiceTypeList(callback, sysType) {
        if(!sysType || sysType === SysType.LOCAL) {
            debugger;
            // 本地接口
            this.webService.getServiceTypeList(callback);
        }else if (sysType === SysType.OTHER) {
            this.jarService.getServiceTypeList(callback);
        }
    }

    /**
     * 获取接口方法列表
     */
    getFunctionList(serviceType, callback, sysType) {
        if(!sysType || sysType === SysType.LOCAL) {
            // 本地接口
            this.webService.getFunctionList(callback);
        }else if (sysType === SysType.OTHER) {
            this.jarService.getFunctionList(callback);
        }
    }

    /**
     * 获取接口方法列表和对应版本信息
     */
    getFunctionListAndVersion(serviceType, callback, sysType) {
        if(!sysType || sysType === SysType.LOCAL) {
            // 本地接口
            this.webService.getFunctionListAndVersion(callback);
        }else if (sysType === SysType.OTHER) {
            this.jarService.getFunctionListAndVersion(callback);
        }

    }

    /**
     * 列出接口所有版本
     */
    listVersionByFunction(serviceType, functionName, callback, sysType) {
        if(!sysType || sysType === SysType.LOCAL) {
            // 本地接口
            this.webService.listVersionByFunction(callback);
        }else if (sysType === SysType.OTHER) {
            this.jarService.listVersionByFunction(callback);
        }
    }

    /**
     * 获取接口详情
     */
    getFunctionDetail(serviceType, functionName, callback, sysType) {
        if(!sysType || sysType === SysType.LOCAL) {
            // 本地接口
            this.webService.getFunctionDetail(callback);
        }else if (sysType === SysType.OTHER) {
            this.jarService.getFunctionDetail(callback);
        }
    }
}