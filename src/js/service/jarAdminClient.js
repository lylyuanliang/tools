import JarCommon from "./jarCommon.js";
import JavaLoaderUtils from "../utils/javaLoaderUtils.js";

export default class JarAdminClient extends JarCommon{
    static getDefaultClassName() {
        // 默认java实现类
        return "com.per.kafka.service.impl.DefaultAdminClient";
    }

    /**
     * 获取分组信息
     * @param servers kafka主机
     * @param autoCommit 自动提交
     *                   false: 不自动提交, 默认false
     *                   true: 自动提交offset, 为清理某些分组积压的巨量消息时使用(删除待解析)
     * @param specialGroupId 需要清空的分组, autoCommit = "true"时必填
     *                    同时, 注: 当指定groupId时, 只会返回当前groupId相关的信息
     */
    getGroupInfos(servers, autoCommit, specialGroupId) {
        let response;
        if (autoCommit && specialGroupId) {
            response = this.javaObj.getGroupInfosSync(servers, autoCommit, specialGroupId);
        }else {
            response = this.javaObj.getGroupInfosSync(servers);
        }

        if (!response) {
            return [];
        }

        return JavaLoaderUtils.change2EsList(response, this.change2JavaObj);
    }

    change2JavaObj(groupInfoBean) {
        let groupId = groupInfoBean.getGroupIdSync();
        let partitionList = groupInfoBean.getPartitionListSync();

        let partitionArray = JavaLoaderUtils.change2EsList(partitionList, (partition) => {
            let topic = partition.getTopicSync();
            let start = partition.getStartSync();
            let end = partition.getEndSync();
            let offset = partition.getOffsetSync();
            let lag = partition.getLagSync();

            return {
                topic: topic,
                start: start,
                end: end,
                offset: offset,
                lag: lag
            };
        });

        let obj = {
            groupId: groupId,
            partitionList: partitionArray
        };
        return obj;
    }
}