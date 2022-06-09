import JarAdminClient from "./service/jarAdminClient.js";
import Schedule from "./service/schedule.js";
import {FileUtils} from "./utils/fileUtils.js";
import JarConsumer from "./service/jarConsumer.js";
import JarProducer from "./service/jarProducer.js";

const UUID = parent.window.require('uuid');
layui.use(["form", "element", "table", "laydate", "layedit", "util"], function () {
    let form = layui.form;
    let $ = layui.$;
    let layer = layui.layer;
    let element = layui.element;
    let table = layui.table;
    var layedit = layui.layedit;
    let util = layui.util;
    //建立编辑器
    let editIndex = layedit.build('messageEdit', {
        tool: null,
        hideTool: []
    });
    $("#messageEdit").attr("editIndex", editIndex);
    /*竖向tab相关操作start*/
    //触发事件
    let kafkaView = new KafkaView();
    //监听Tab切换，以改变地址hash值
    element.on('tab(docDemoTabBrief)', (e) => {
        // e.index===0为所有

        let server = $(`[name="kafkaServer"]`).val();
        if (!server) {
            layer.msg("kafka ip必填,在'kafka基础设置中填写'", {icon: 5});
            return ;
        }

        let groupInfoList;
        layer.load(1);
        if (e.index === 0) {
            groupInfoList = kafkaView.getGroupInfos(server);
        } else {
            let groupId = $(`#groupList li:eq(${e.index})`).attr("groupId");
            groupId = groupId || "";
            groupInfoList = kafkaView.getGroupInfos(server, "false", groupId);
        }

        buildGroupInfoView(groupInfoList);
        layer.closeAll('loading');
        form.render();
    });
    //Hash地址的定位

    /*竖向tab相关操作end*/


    /*
    运行一个定时任务,保存历史操作记录,默认5s一次
     */
    Schedule.doSchedule("hisSchedule", "*/5 * * * * *", () => {
        kafkaView.saveHis(kafkaView.history, kafkaView.hisSavePath, kafkaView.moduleName, dataFun);
    });
    //kafka基础信息初始化
    form.on('submit(kafkaBaseInfo)', function (data) {
        // 初始化uuid,保存历史用
        let uuid = $(`body`).attr("his_key");
        if (!uuid) {
            $(`body`).attr("his_key", UUID.v1());
        }

        let server = $(`[name="kafkaServer"]`).val();
        if (!server) {
            layer.msg("kafka ip必填,在'kafka基础设置中填写'", {icon: 5});
            return ;
        }
        layer.load(1);
        let groupInfoList = kafkaView.getGroupInfos(server);
        layer.closeAll('loading');
        buildGroupInfoView(groupInfoList);
        form.render();

        console.log(data.field);
        return false;
    });

    // producer
    form.on('submit(sendKafkaInfo)', function (data) {
        let dataInfo = data.field;
        let topic = dataInfo.topic;
        let kafkaMessage = layedit.getText(editIndex);
        let msgList = kafkaView.splitMsg(kafkaMessage, ",");
        let server = $(`[name="kafkaServer"]`).val();
        if (!server) {
            layer.msg("kafka ip必填,在'kafka基础设置中填写'", {icon: 5});
            return ;
        }
        layer.load(1);
        kafkaView.send(server, topic, msgList, (res) => {
            layer.closeAll('loading');
            layer.msg(res)
        })

        return false;
    });

    // consumer
    form.on('submit(receiveKafkaInfo)', function (data) {
        let dataInfo = data.field;
        let topic = dataInfo.topic;
        let groupId = dataInfo.groupId;
        let server = $(`[name="kafkaServer"]`).val();
        if (!server) {
            layer.msg("kafka ip必填,在'kafka基础设置中填写'", {icon: 5});
            return ;
        }

        let autoCommit = dataInfo.commitFlag;
        layer.load(1);
        kafkaView.receive(server, groupId, topic, autoCommit, (res) => {
            if (!res || res.length === 0) {
                layer.msg("暂无最新消息")
                return;
            }

            let oldValue = $(`[name="kafkaMessageReceive"]`).val();

            for (let item of res) {
                oldValue = `${oldValue}\r\n${item.msg}`
            }
            $(`[name="kafkaMessageReceive"]`).val(oldValue);
            layer.closeAll('loading');
        });
        layer.closeAll('loading');
        return false;
    });


    // 分组分区信息======================

    //监听指定开关
    form.on('switch(switchTest)', function(data){
        layer.tips('温馨提示：选择提交后, 会将该分组消息的最后一个offset提交(即lag会变成0),此举可以用来删除过多的待解析(暂仅对分组中订阅一个主题有效,多个主题时,请在"Cosumer"模块进行提交)', data.othis)
    });

    //监听提交
    form.on('submit(sendKafkaInfo)', function(data){
        let obj = data.field;
        let groupId = obj.groupId;
        if (!groupId) {
            return ;
        }

        let isCommit = obj.isCommit;
        let commit = "false";
        if ("on" === isCommit) {
            commit = "true";
        }
        let server = $(`[name="kafkaServer"]`).val();
        if (!server) {
            layer.msg("kafka ip必填,在'kafka基础设置'中填写", {icon: 5});
            return ;
        }
        layer.load(1);
        kafkaView.getGroupInfos(server, commit, groupId, buildGroupInfoView)
        layer.closeAll('loading');
        return false;
    });
   // 分组分区信息======================end

    util.event('lay-his-event', {
        openKafkaList: (e) => {
            kafkaView.refreshHis();
            let hisData = kafkaView.history;
            if (!hisData) {
                return;
            }
            // 转成list
            let hisList = [];
            for (let uuid in hisData) {
                if (!uuid) {
                    continue;
                }
                if (!hisData[uuid]) {
                    continue;
                }
                let rowData = {
                    uuid: uuid,
                    name: hisData[uuid].data.name,
                    modifiedTime: hisData[uuid].modifiedTime
                };

                hisList.push(rowData);
            }
            $(".his-content").show();
            table.render({
                elem: '#hisTable'
                , cols: [[
                    {field: 'uuid', title: 'uuid', hide: true}
                    , {field: 'name', title: '名称', sort: true}
                    , {field: 'modifiedTime', title: '最后修改时间'}
                    , {fixed: 'right', align: 'center', toolbar: '#barDemo'} //这里的toolbar值是模板元素的选择器
                ]]
                , data: hisList
                , skin: 'nob' //表格风格
                , even: true
                , size: 'sm'
            });

            //监听行单击事件（双击事件为：rowDouble）
            table.on('rowDouble(hisTable)', (obj) => {

                // 先保存一次, 防止正在输入的数据丢失
                layer.msg("页面上正在填写的数据已保存, 若要查看,请重新打开历史列表")
                kafkaView.saveHis(kafkaView.history, kafkaView.hisSavePath, kafkaView.moduleName, dataFun);

                //标注选中样式
                obj.tr.addClass('layui-table-click').siblings().removeClass('layui-table-click');

                var data = obj.data;

                let uuid = data.uuid;
                let hisData = kafkaView.history[uuid].data;
                $(`body`).attr("his_key", uuid);

                let inputArray = document.querySelectorAll("[his_scope]");
                let len = inputArray.length;
                for (let j = 0; j < len; j++) {
                    let input = inputArray[j];
                    let hisScope = $(input).attr("his_scope");
                    let scopes = hisScope.split(".");
                    let length = scopes.length;

                    let val = hisData[scopes[0]];
                    for (let i = 1; i < length; i++) {
                        val = val[scopes[i]];
                    }
                    let type = $(input).attr("type");
                    let editIndex = $(input).attr("editIndex");
                    if (editIndex) {
                        layedit.setContent(editIndex, val, false);
                        // $(input).html(val);
                    } else if ("radio" === type) {
                        let name = $(input).attr("name");
                        $(`[name="${name}"][value="${val}"]`).attr("checked", "true");
                    } else {
                        $(input).val(val);
                    }
                }
                form.render();
            });
            //监听工具条
            table.on('tool(hisTable)', function (obj) {
                var data = obj.data;
                if (obj.event === 'detail') {
                    let hisObj = kafkaView.history[data.uuid];
                    layer.confirm(JSON.stringify(hisObj), function (index) {
                        layer.close(index);
                    });
                } else if (obj.event === 'del') {
                    layer.confirm('确定删除?', function (index) {
                        obj.del();
                        kafkaView.history[data.uuid] = null;
                        layer.close(index);
                        kafkaView.saveHis2(kafkaView.history, kafkaView.hisSavePath, kafkaView.moduleName);
                    });
                } else if (obj.event === 'edit') {
                    layer.alert('编辑行：<br>' + JSON.stringify(data))
                }
            });

        },
        closeHisList: (e) => {
            $(".his-content").hide();
        }
    });

    function dataFun() {
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
            let editIndex = $(input).attr("editIndex");
            if (editIndex) {
                // $(input).html(val);
                val = layedit.getContent(editIndex);
            }


            let type = $(input).attr("type");
            if ("radio" === type) {
                let name = $(input).attr("name");
                val = $(`[name="${name}"]:checked`).val();
            }


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
    };

    function buildGroupInfoView(groupInfoList) {
        let tableBody = $("#groupInfoBody");
        tableBody.html("");
        let groupListUl = $("#groupList");
        groupListUl.html(`<li class="layui-this">所有分组</li>`);
        for (let groupInfo of groupInfoList) {
            let groupId = groupInfo.groupId;
            let partitionList = groupInfo.partitionList;
            let size = partitionList.length;
            let i = 0;
            for (let partition of partitionList) {
                let topic = partition.topic;
                let start = partition.start;
                let end = partition.end;
                let offset = partition.offset;
                let lag = partition.lag;

                let tr = $(`<tr>
                                ${((groupId, i) =>
                        i === 0 ? `<td rowspan="${size}">${groupId}</td>` : ""
                )(groupId, i++)}
                                <td >${topic}</td>
                                <td >${start}</td>
                                <td >${end}</td>
                                <td >${offset}</td>
                                <td >${lag}</td>
                            </tr>`);
                tableBody.append(tr);
            }
            groupListUl.append($(`<li groupId="${groupId}">${groupId ? groupId : "<div style='height: 40px; background: #b6c5ba'></div>"}</li>`));

        }
        layer.closeAll('loading');
    }
});

export default class KafkaView {
    constructor() {
        this.moduleName = "kafka";
        this.hisSavePath = FileUtils.getDefaultHisDataPath();
        this.history = this.loadHis(this.hisSavePath, this.moduleName);

        this.adminClient = JarAdminClient.getInstance();
        this.consumer = JarConsumer.getInstance();
        this.producer = JarProducer.getInstance();
    }

    send(server, topic, msgList, callBack) {
        let response = this.producer.send(server, topic, msgList);
        if (typeof callBack === "function") {
            callBack(response);
        }
        return response;
    }

    receive(servers, groupId, topic, autoCommit = "false", callBack) {
        let response = this.consumer.receive(servers, groupId, topic, autoCommit);

        if (typeof callBack === "function") {
            callBack(response);
        }
        return response;
    }

    getGroupInfos(servers, autoCommit, specialGroupId, callBack) {
        let response = this.adminClient.getGroupInfos(servers, autoCommit, specialGroupId);

        if (typeof callBack === "function") {
            callBack(response);
        }
        return response;

    }

    splitMsg(msg, flag) {
        if (!msg) {
            return [];
        }
        if (!flag) {
            return msg;
        }

        return msg.split(flag);
    }

    loadHis(hisSavePath, fileName) {
        let fullPath = FileUtils.join(hisSavePath, fileName);
        console.log(
            `历史记录保存路径: ${fullPath}`
        );
        let history = FileUtils.readFile2Obj(fullPath);
        history = history || {};
        return history;
    }

    saveHis2(history, filePath, fileName) {
        if (!history) {
            return true;
        }
        console.log("开始保存历史", filePath)
        // 过滤掉无效数据
        let his2Save = {};
        for (let uuid in history) {
            if (!uuid) {
                continue;
            }

            if (!history[uuid]) {
                continue;
            }

            his2Save[uuid] = history[uuid];
        }

        let content = JSON.stringify(his2Save);
        FileUtils.writeFile(filePath, fileName, content);
        this.history = his2Save;
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

        this.saveHis2(history, filePath, fileName);
    }

    isChange(historyData = {}, uuid, hisData) {
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

    refreshHis() {
        this.history = this.loadHis(this.hisSavePath, this.moduleName);
    }
}