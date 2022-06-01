import {FileUtils} from "./fileUtils";
import path from "path";
import { Message } from 'element-ui';

let loaded = false;
let java = require("java");
export default class JavaLoaderUtils {
    static init(jarFilePath) {
        if (!loaded) {
            // 开始加载java依赖
            if(!jarFilePath) {
                jarFilePath = this.getDefaultJarFilePath();
            }
            let exist = FileUtils.existFile(jarFilePath);
            if (!exist) {
                Message.error(`lib路径不存在 : ${jarFilePath}`);
                return [];
            }
            this.loadJars(jarFilePath);
        }
    }

    static loadJars(jarFilePath) {
        let listFiles = FileUtils.listFiles(jarFilePath);
        for (let file of listFiles) {
            java.classpath.push(file);
        }

        this.setLoaded(true);
    }

    /**
     * 加载class
     * @param classFullName 类全名, 例如com.test.Test
     */
    static loadClass(classFullName) {
        if(!classFullName) {
            return null;
        }

        if(!loaded) {
            this.init();
        }

        return java.import(classFullName);
    }

    /**
     * jar包默认路径
     * @returns {string}
     */
    static getDefaultJarFilePath() {
        let jarFile = "/jars/";
        let basePath = FileUtils.getBasePath();
        let jarFilePath = path.join(basePath, jarFile);
        return jarFilePath;
    }

    static isLoaded() {
        return loaded;
    }

    static setLoaded(loadedFlag) {
        loaded = loadedFlag;
    }
}