// ____             _
// |  _ \ ___  _   _| |_ ___ _ __
// | |_) / _ \| | | | __/ _ \ '__|
// |  _ < (_) | |_| | ||  __/ |
// |_| \_\___/ \__,_|\__\___|_|
//
// By BLxcwg666 <huixcwg@gmail.com>

const express = require("express");
const log = require('./../utils/logger');

const router = express.Router();

router.use('/', require('../routes/root'));
router.use('/wdr', require('../routes/wdr'));
router.use('/wdr/raw', require('../routes/wdr/raw'));

// 未匹配的路由
router.use((req, res) => {
    res.json({ success: false, msg: "你在找什么喵？" });
});

// 错误处理
router.use((err, req, res, next) => {
    log.err(err, "ROUTER")
    res.json({ success: false, msg: "出错了呜呜呜~ 请检查控制台输出喵~" });
});

module.exports = router;