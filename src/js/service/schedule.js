const schedule = parent.window.require('node-schedule');
export default class Schedule {
    /**
     * 执行定时任务
     * @param id 定时任务id, String
     * @param cron cron表达式
     *          *  *  *  *  *  *
     *          ┬  ┬  ┬  ┬  ┬  ┬
     *          │  │  │  │  │  │
     *          │  │  │  │  │  └ day of week (0 - 7) (0 or 7 is Sun)
     *          │  │  │  │  └───── month (1 - 12)
     *          │  │  │  └────────── day of month (1 - 31)
     *          │  │  └─────────────── hour (0 - 23)
     *          │  └──────────────────── minute (0 - 59)
     *          └───────────────────────── second (0 - 59, OPTIONAL)
     * @param task, 定时执行的任务, 为function
     */
    static doSchedule(id, cron, task) {
        if (typeof task !== "function") {
            throw "task必须为Function";
        }
        if (!id) {
            throw "请指定定时任务的名称";
        }
        this.cancelSchedule(id);
        console.log("启动定时任务",id);
        //执行定时任务
        console.log(schedule.scheduleJob(id, cron, task));
    }

    /**
     * 取消定时任务
     * @param id 定时任务id
     */
    static cancelSchedule(id) {
        console.log("取消定时任务", id);
        schedule.cancelJob(id);
    }
}