import JarCommon from "./jarCommon.js";
import JavaLoaderUtils from "../utils/javaLoaderUtils.js";

export default class JarConsumer extends JarCommon{
    static getDefaultClassName() {
        // 默认java实现类
        return "com.per.kafka.service.impl.DefaultConsumer";
    }

    /**
     * 接受消息
     *
     * @param servers    kafka 主机
     * @param groupId    分组id
     * @param topic      主题
     * @param autoCommit 是否提交offset
     */
    receive(servers, groupId, topic, autoCommit) {
        let response = this.javaObj.receiveSync(servers, groupId, topic, autoCommit);
        let res = JavaLoaderUtils.change2EsList(response, (messBean) => {
            let topic = messBean.getTopicSync();
            let offset = messBean.getOffsetSync();
            let msg = messBean.getMsgSync();

            let obj = {
                topic: topic,
                offset: offset,
                msg: msg
            };
            return obj;
        });
        return res;
    }
}