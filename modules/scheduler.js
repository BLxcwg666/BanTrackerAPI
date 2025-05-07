const schedule = require("node-schedule");
const axios = require("axios");
const UserAgent = require("user-agents");
const NumberManager = require("./numManager");

const staffHalfHourCalc = new NumberManager();

let banHistory = [];
let lastUpdated = Date.now();
let watchdog = { last_minute: 0, last_day: 0, total: -1 };
let staff = { last_half_hour: 0, last_day: 0, total: -1 };

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

        if (wdiff > 0) pushBan(true, wdiff);
        if (sdiff > 0) {
            pushBan(false, sdiff);
            staffHalfHourCalc.add(sdiff);
        }

        staff.total = data.staff_total;
        watchdog.total = data.watchdog_total;
        lastUpdated = Date.now();
    } catch (err) {
        console.error("Fetch error:", err.message);
    }
};

schedule.scheduleJob("*/3 * * * * *", getBanData);
schedule.scheduleJob("*/3 * * * * *", () => {
    staffHalfHourCalc.remove();
    staff.last_half_hour = staffHalfHourCalc.getCount();
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