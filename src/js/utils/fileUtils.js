import Constants from "../constant/constants.js";

const fs = parent.window.require("fs");
const path = parent.window.require("path");
const { remote } = parent.window.require('electron');

export class FileUtils {
    constructor() {
    }

    /**
     * 获取exe所在路径
     * @returns {string}
     */
    static getAppPath() {
        let exePath = path.dirname(remote.app.getPath('exe'));
        return exePath;
    }

    /**
     * 读取文件目录列表
     * @param filePath 文件路径
     * @returns
     */
    static listDirs(filePath, resultList = []) {
        if (!filePath) {
            return null;
        }
        let fileList = fs.readdirSync(filePath);
        for (let i = 0; i < fileList.length; i++) {
            let filename = fileList[i];
            let fullPath = path.join(filePath, filename);
            //根据文件路径获取文件信息，返回一个fs.Stats对象
            let stats = fs.statSync(fullPath);
            let isFile = stats.isFile();//是文件
            let isDir = stats.isDirectory();//是文件夹
            if (isFile) {
                // console.log(fullPath);
            }
            if (isDir && filename.startsWith("task")) {
                resultList[resultList.length++] = fullPath;
            } else if (isDir) {
                resultList = this.listDirs(fullPath, resultList);//递归，如果是文件夹，就继续遍历该文件夹下面的文件
            }
        }
        return resultList;
    }

    /**
     * 读取文件目录列表
     * @param filePath 文件路径
     * @returns
     */
    static listFiles(filePath, resultList = []) {
        if (!filePath) {
            return null;
        }
        let fileList = fs.readdirSync(filePath);
        for (let i = 0; i < fileList.length; i++) {
            let filename = fileList[i];
            let fullPath = path.join(filePath, filename);
            //根据文件路径获取文件信息，返回一个fs.Stats对象
            let stats = fs.statSync(fullPath);
            let isFile = stats.isFile();//是文件
            let isDir = stats.isDirectory();//是文件夹
            if (isFile) {
                resultList[resultList.length++] = fullPath;
            } else {
                resultList = this.listDirs(fullPath, resultList);//递归，如果是文件夹，就继续遍历该文件夹下面的文件
            }
        }
        return resultList;
    }


    /**
     * 读取文件
     * @param filePath 文件路径
     * @returns {string|null}
     */
    static readFile2String(filePath) {
        if (!filePath) {
            return null;
        }

        let exist = this.existFile(filePath);
        if (!exist) {
            return null;
        }

        let fileContent = fs.readFileSync(filePath, "utf8");
        return fileContent;
    }

    /**
     * 判断文件是否存在
     * @param filePath 文件路径
     * @returns {boolean}
     */
    static existFile(filePath) {
        try {
            // 判断文件是否存在
            fs.accessSync(filePath, fs.constants.F_OK);
            // 无异常表示文件存在
            return true;
        } catch (e) {
            // 文件不存在,
            return false;
        }
    }

    /**
     * 保存文件
     * @param filePath 文件路径
     * @param fileName 文件名
     * @param fileContent 文件内容
     */
    static writeFile(filePath, fileName, fileContent) {
        if (!filePath || !fileContent) {
            return;
        }

        if (!this.existFile(filePath)) {
            fs.mkdirSync(filePath, {recursive: true});
        }

        let fullPath = filePath + fileName;

        fs.writeFileSync(fullPath, fileContent);
    }

    /**
     * 获取默认数据保存路径
     */
    static getDefaultDataPath() {
        return Constants.PATH_DATA_DEFAULT;
    }

    /**
     * 获取默认数据文件名
     * @returns {*}
     */
    static getDefaultDataName() {
        return Constants.DATA_NAME_DEFAULT;
    }

    /**
     * 获取基本路径
     * @returns {*}
     */
    static getBasePath() {
        let appPath = this.getAppPath();
        let defaultDataPath = this.getDefaultDataPath();
        let basePath = path.join(appPath, defaultDataPath);
        return basePath;
    }

}