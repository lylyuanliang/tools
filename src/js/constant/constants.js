export default class Constants {
    static get PATH_DATA_DEFAULT() {
        return PATH_DATA_DEFAULT;
    }
    static get TAG_START() {
        return TAG_START;
    }
    static get DATA_NAME_DEFAULT() {
        return DATA_NAME_DEFAULT;
    }
    static get BACKLOG_PATH_DEFAULT() {
        return BACKLOG_PATH_DEFAULT;
    }
    static get BACKLOG_LIST_COMMON() {
        return BACKLOG_LIST_COMMON;
    }
}

const PATH_DATA_DEFAULT = "temp/data/";
const DATA_NAME_DEFAULT = "taskList.json";
const TAG_START="task";
/**
 * 待办事项路径
 * @type {string}
 */
const BACKLOG_PATH_DEFAULT = "/backlog/"
/**
 * 待办事项模板
 * @type {string}
 */
const BACKLOG_LIST_COMMON = "backlogList.json"
