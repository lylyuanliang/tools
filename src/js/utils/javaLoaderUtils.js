import {FileUtils} from "./fileUtils.js";

let path = parent.window.require("path")
let loaded = false;
let java = parent.window.require("java");
const {dialog} = parent.window.require('electron').remote;

export default class JavaLoaderUtils {
    static init(jarFilePath) {
        if (!loaded) {
            // 开始加载java依赖
            if(!jarFilePath) {
                jarFilePath = this.getDefaultJarFilePath();
            }
            let exist = FileUtils.existFile(jarFilePath);
            if (!exist) {
                dialog.showMessageBox({
                    message: `lib路径不存在 : ${jarFilePath}`
                });
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

        if(!this.isLoaded()) {
            this.init();
        }

        if(this.isLoaded()) {
            return java.import(classFullName);
        }

       return null;
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

    static change2JavaList(array=[]) {
        let ArrayList = this.loadClass('java.util.ArrayList');
        let arrayList = new ArrayList();
        for (let item of array) {
            arrayList.addSync(item);
        }
        return arrayList;
    }

    static change2EsList(arrayList, valueFun) {
        let size = arrayList.sizeSync();
        if(size <= 0) {
            return [];
        }

        let array = [];
        for (let i = 0; i < size; i++) {
            let value = arrayList.getSync(i);
            if(typeof valueFun === "function") {
                value = valueFun(value);
            }
            array.push(value);
        }

        return array;
    }

}