import JarAdminClient from "./service/jarAdminClient.js";
import Schedule from "./service/schedule.js";
import {FileUtils} from "./utils/fileUtils.js";
const UUID = parent.window.require('uuid');
layui.use(["form", "element", "table", "laydate", "layedit"], function () {
    let form = layui.form;
    let $ = layui.$;
    let layer = layui.layer;
    let element = layui.element;
    let table = layui.table;
    var layedit = layui.layedit;
    //建立编辑器
    layedit.build('messageEdit', {
        tool: null,
        hideTool: []
    });
    /*竖向tab相关操作start*/
    //触发事件
    var active = {
        tabAdd: function () {
            //新增一个Tab项
            element.tabAdd('demo', {
                title: '新选项' + (Math.random() * 1000 | 0) //用于演示
                , content: '内容' + (Math.random() * 1000 | 0)
                , id: new Date().getTime() //实际使用一般是规定好的id，这里以时间戳模拟下
            })
        }
        , tabDelete: function (othis) {
            //删除指定Tab项
            element.tabDelete('demo', '44'); //删除：“商品管理”


            othis.addClass('layui-btn-disabled');
        }
        , tabChange: function () {
            //切换到指定Tab项
            element.tabChange('demo', '22'); //切换到：用户管理
        }
    };

    $('.site-demo-active').on('click', function () {
        var othis = $(this), type = othis.data('type');
        active[type] ? active[type].call(this, othis) : '';
    });

    //Hash地址的定位
    var layid = location.hash.replace(/^#test=/, '');
    element.tabChange('test', layid);

    element.on('tab(test)', function (elem) {
        location.hash = 'test=' + $(this).attr('lay-id');
    });
    /*竖向tab相关操作end*/


    let kafkaView = new KafkaView();


    /*
    运行一个定时任务,保存历史操作记录,默认5s一次
     */
    Schedule.doSchedule("task", "*/10 * * * * *", () => {
        kafkaView.saveHis(kafkaView.history, kafkaView.hisSavePath, kafkaView.moduleName, () => {
            // 读取uuid
            let uuid = $(`body`).attr("his_key");
            if (!uuid) {
                return;
            }
            let inputArray = document.querySelectorAll("[his_scope]");
            if (!inputArray) {
                return;
            }
            let result = {uuid: uuid};
            let len = inputArray.length;
            for (let j = 0; j < len; j++) {
                let input = inputArray[j];
                let hisScope = $(input).attr("his_scope");
                let scopes = hisScope.split(".");


                let val = $(input).val();

                let length = scopes.length;
                if (length === 1) {
                    result[scopes[0]] = val;
                    continue;
                }

                result[scopes[0]] = result[scopes[0]] || {};
                // 创建子对象
                let subObj = result[scopes[0]];
                for (let i = 1; i < length - 1; i++) {
                    let scope = scopes[i];
                    subObj[scope] = subObj[scope] || {};
                    // 指向新创建的子对象
                    subObj = subObj[scope];
                }
                subObj[scopes[length - 1]] = val;
            }
            return result;
        });
    });
    //kafka基础信息初始化
    form.on('submit(kafkaBaseInfo)', function (data) {
        // 初始化uuid,保存历史用
        let uuid = $(`body`).attr("his_key");
        if (!uuid) {
            $(`body`).attr("his_key", UUID.v1());
        }
        layer.msg(JSON.stringify(data.field));
        return false;
    });

    // producer
    form.on('submit(sendKafkaInfo)', function (data) {
        layer.msg(JSON.stringify(data.field));
        return false;
    });

    // consumer
    form.on('submit(receiveKafkaInfo)', function (data) {
        layer.msg(JSON.stringify(data.field));
        return false;
    });


    // 分组分区信息
    form.on('submit(refresh)', function (data) {
        layer.msg(JSON.stringify(data.field));
        return false;
    });


})



class KafkaView {
    constructor() {
        this.moduleName = "kafka";
        this.hisSavePath = FileUtils.getDefaultHisDataPath();
        this.history = this.loadHis(this.hisSavePath, this.moduleName);
    }

    loadHis(hisSavePath, fileName) {
        let fullPath = FileUtils.join(hisSavePath, fileName);
        console.log(`历史记录保存路径: ${fullPath}`);
        let history = FileUtils.readFile2Obj(fullPath);
        history = history || {};
        return history;
    }

    saveHis(history, filePath, fileName, dataFun) {
        let hisData = dataFun();
        if (!hisData) {
            return true;
        }

        let uuid = hisData["uuid"];

        history[uuid] = history[uuid] || {};
        if (!this.isChange(history[uuid].data, uuid, hisData)) {
            return true;

        }
        history[uuid].data = hisData;
        history[uuid].modifiedTime = new Date().toLocaleString();
        history[uuid].isTemp = true;
        console.log("开始保存历史", filePath)
        let content = JSON.stringify(history);
        FileUtils.writeFile(filePath, fileName, content);

    }

    isChange(historyData={}, uuid, hisData) {
        if (!uuid) {
            return true;
        }
        if (!hisData) {
            return false;
        }

        if (JSON.stringify(historyData) === JSON.stringify(hisData)) {
            return false;
        }
        return true;
    }



}