import JarCommon from "./jarCommon.js";

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
        let response = this.javaObj.receive(servers, groupId, topic, autoCommit);
        return response;
    }
}