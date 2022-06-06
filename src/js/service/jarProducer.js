import JarCommon from "./jarCommon.js";

export default class JarProducer extends JarCommon{
    static getDefaultClassName() {
        // 默认java实现类
        return "com.per.kafka.service.impl.DefaultProducer";
    }

    /**
     * 消息发送
     * @param servers kafka主机设置
     * @param topic kafka主题
     * @param msgList kafka待发送的消息,为一个
     */
    getGroupInfos(servers, topic, msgList) {
        let response = this.javaObj.send(servers, topic, msgList);
        return response;
    }
}