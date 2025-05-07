// rewrite of https://github.com/HypixelBanTrackerProject/webapi

const express = require("express");
const app = express();
const port = 8963;
const timeSince = require("./timeCalc");
const { getData, getBanData } = require("./scheduler");

app.get("/", (req, res) => {
    const { staff, watchdog, banHistory, lastUpdated } = getData();
    const response = {
        staff,
        watchdog,
        banHistory,
        lastUpdated: {
            timestamp: lastUpdated,
            formated: new Date(lastUpdated).toLocaleTimeString("zh-CN", { hour12: false }),
        },
    };
    res.set("Cache-Control", "max-age=3, must-revalidate");
    res.json(response);
});

app.get("/wdr", (req, res) => {
    const { staff, watchdog, banHistory, lastUpdated } = getData();
    let message = `🐕🐕 Hypixel Ban Tracker 👮‍👮‍
[🐕] 过去一分钟有 ${watchdog.last_minute} 人被狗咬了
[🐕‍] 狗在过去二十四小时内已封禁 ${watchdog.last_day} 人,

[👮‍] 过去的半小时有 ${staff.last_half_hour} 人被逮捕了
[👮‍] 客服在过去二十四小时内已封禁 ${staff.last_day} 人,

上次更新: ${new Date(lastUpdated).toLocaleTimeString("zh-CN", { hour12: false })} ${timeSince(lastUpdated)}
`;

    if (banHistory.length === 0) {
        message += "无最近封禁";
    } else {
        message += "最近封禁记录:\n";
        for (const ban of banHistory) {
            message += `[${ban.watchdog ? "🐕" : "👮"}] [${ban.formated}] banned ${ban.number} player.\n`;
        }
    }

    res.set("Cache-Control", "max-age=3, must-revalidate");
    res.json({ wdr: message.trim() });
});

app.get("/wdr/raw", (req, res) => {
    const { staff, watchdog, banHistory, lastUpdated } = getData();
    let message = `🐕🐕 Hypixel Ban Tracker 👮‍👮‍
[🐕] 过去一分钟有 ${watchdog.last_minute} 人被狗咬了
[🐕‍] 狗在过去二十四小时内已封禁 ${watchdog.last_day} 人,

[👮‍] 过去的半小时有 ${staff.last_half_hour} 人被逮捕了
[👮‍] 客服在过去二十四小时内已封禁 ${staff.last_day} 人,

上次更新: ${new Date(lastUpdated).toLocaleTimeString("zh-CN", { hour12: false })} ${timeSince(lastUpdated)}
`;

    if (banHistory.length === 0) {
        message += "无最近封禁";
    } else {
        message += "最近封禁记录:\n";
        for (const ban of banHistory) {
            message += `[${ban.watchdog ? "🐕" : "👮"}] [${ban.formated}] banned ${ban.number} player.\n`;
        }
    }

    res.set("Content-Type", "text/plain; charset=utf-8");
    res.set("Cache-Control", "max-age=3, must-revalidate");
    res.send(message.trim());
});

// 启动初始化任务
getBanData();

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});