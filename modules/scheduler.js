const schedule = require("node-schedule");
const axios = require("axios");
const UserAgent = require("user-agents");
const NumberManager = require("./numManager");
const log = require("./../utils/logger");

const staffHalfHourCalc = new NumberManager(30);
const watchdogHalfHourCalc = new NumberManager(30);
const staffLastMinuteCalc = new NumberManager(1);

let banHistory = [];
let lastUpdated = Date.now();
let watchdog = { last_minute: 0, last_half_hour: 0, last_day: 0, total: -1 };
let staff = { last_minute: 0, last_half_hour: 0, last_day: 0, total: -1 };

function pushBan(isWatchdog, number) {
    const now = Date.now();
    const formated = new Date(now).toLocaleTimeString("zh-CN", { hour12: false });

    banHistory.unshift({
        time: now,
        formated,
        watchdog: isWatchdog,
        number,
    });

    if (banHistory.length > 10) banHistory.pop();
}

const getBanData = async () => {
    try {
        // 这个 API 不太朋友，在我的 Azure HK 上被返回 403
        const res = await axios.get("https://api.plancke.io/hypixel/v1/punishmentStats", {
            timeout: 3000,
            headers: {
                "User-Agent": new UserAgent().toString(),
                Accept: "application/json",
            },
        });

        const data = res.data?.record;
        if (!data) return;

        staff.last_day = data.staff_rollingDaily;
        watchdog.last_day = data.watchdog_rollingDaily;
        watchdog.last_minute = data.watchdog_lastMinute;

        if (staff.total === -1 || watchdog.total === -1) {
            staff.total = data.staff_total;
            watchdog.total = data.watchdog_total;
            lastUpdated = Date.now();
            return;
        }

        const wdiff = data.watchdog_total - watchdog.total;
        const sdiff = data.staff_total - staff.total;

        if (wdiff > 0) {
            pushBan(true, wdiff);
            watchdogHalfHourCalc.add(wdiff);
        }

        if (sdiff > 0) {
            pushBan(false, sdiff);
            staffLastMinuteCalc.add(sdiff);
            staffHalfHourCalc.add(sdiff);
        }

        staff.total = data.staff_total;
        watchdog.total = data.watchdog_total;
        lastUpdated = Date.now();
    } catch (err) {
        log.err(err.message, 'SCHEDULER');
    }
};

schedule.scheduleJob("*/3 * * * * *", getBanData);
schedule.scheduleJob("*/3 * * * * *", () => {
    staffHalfHourCalc.remove();
    staffLastMinuteCalc.remove();
    watchdogHalfHourCalc.remove();
    staff.last_minute = staffLastMinuteCalc.getCount();
    staff.last_half_hour = staffHalfHourCalc.getCount();
    watchdog.last_half_hour = watchdogHalfHourCalc.getCount();
});

module.exports = {
    getBanData,
    getData: () => ({
        staff,
        watchdog,
        banHistory,
        lastUpdated,
    }),
};