import JavaLoaderUtils from "../utils/javaLoaderUtils.js";

export default class JarCommon{
    constructor(className) {
        this.className = className;
        let classObj = JavaLoaderUtils.loadClass(className);
        if(classObj) {
            this.javaObj = new classObj();
        }else {
            throw `${className}不存在,请检查java依赖包是否存在`;
        }
    }

    /**
     * 获取实例
     * @param className
     * @returns {JarCommon}
     */
    static getInstance(className) {
        className = className || this.getDefaultClassName();
        if(!this.instance || className !== this.instance.className) {
            this.instance = new this(className);
        }
        return this.instance;
    }

    static getDefaultClassName() {
        throw "无默认class类,请指定";
    }
}