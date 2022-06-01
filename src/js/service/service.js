import SysType from "../enum/SysType.js";
import WebService from "./webService.js";
import JarService from "./jarService.js";

export default class Service {
    constructor($, layer) {
        if (!Service.instance) {
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
        if (!sysType || sysType === SysType.OTHER) {
            let data = this.jarService.getServiceTypeList(callback);
            if (callback && typeof callback === "function") {
                callback(data);
            }
        } else if (sysType === SysType.LOCAL) {
            this.webService.getServiceTypeList(callback);
        }
    }

    /**
     * 获取接口方法列表
     */
    getFunctionList(serviceType, callback, sysType) {
        if (!sysType || sysType === SysType.OTHER) {
            let data = this.jarService.getFunctionList(serviceType, callback);
            if (callback && typeof callback === "function") {
                callback(data);
            }
        } else if (sysType === SysType.LOCAL) {
            // 本地接口
            this.webService.getFunctionList(serviceType, callback);
        }
    }

    /**
     * 获取接口方法列表和对应版本信息
     */
    getFunctionListAndVersion(serviceType, callback, sysType) {
        if (!sysType || sysType === SysType.OTHER) {
            // 本地接口
            let data = this.jarService.getFunctionListAndVersion(serviceType, callback);
            if (callback && typeof callback === "function") {
                callback(data);
            }
        } else if (sysType === SysType.LOCAL) {
            this.webService.getFunctionListAndVersion(serviceType, callback);
        }

    }

    /**
     * 列出接口所有版本
     */
    listVersionByFunction(serviceType, functionName, callback, sysType) {
        if (!sysType || sysType === SysType.OTHER) {
            let data = this.jarService.listVersionByFunction(serviceType, functionName, callback);
            if (callback && typeof callback === "function") {
                callback(data);
            }
        } else if (sysType === SysType.LOCAL) {
            // 本地接口
            this.webService.listVersionByFunction(serviceType, functionName, callback);
        }
    }

    /**
     * 获取接口详情
     */
    getFunctionDetail(serviceType, functionName, callback, sysType) {
        if (!sysType || sysType === SysType.OTHER) {
            let data = this.jarService.getFunctionDetail(serviceType, functionName, callback);
            if (callback && typeof callback === "function") {
                callback(data);
            }
        } else if (sysType === SysType.LOCAL) {
            // 本地接口
            this.webService.getFunctionDetail(serviceType, functionName, callback);
        }
    }
}