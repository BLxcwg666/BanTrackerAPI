const express = require("express");
const { getData } = require("./../modules/scheduler");

const router = express.Router();

router.get("/", (req, res) => {
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

module.exports = router;