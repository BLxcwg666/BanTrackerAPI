// rewrite of https://github.com/HypixelBanTrackerProject/webapi

const express = require("express");
const app = express();
const cluster = require('cluster');
const moment = require('moment-timezone');
const config = require('./config');
const { getBanData } = require("./modules/scheduler");
const routes = require('./modules/router');
const numCPUs = require('os').cpus().length;
const compression = require('compression');
const log = require('./utils/logger');

const host = config.API_HOST;
const port = config.API_PORT;

global.version = "1.0.0";
global.time = function () {
    return moment().tz('Asia/Shanghai').format('YYYY-MM-DD HH:mm:ss');
}

// 启动初始化任务
getBanData();

if (cluster.isPrimary) {
    // 复制线程
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    // 启动 API
    const app = express();

    app.use(compression());
    app.use(express.json());
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Access-Control-Allow-Headers', 'Content-Type');
        next();
    });

    app.use('/', routes);
    app.listen(port, host, async () => {
        log.info(`API Started at port ${port} on ${host}`, "APP")
    });
    cluster.on('exit', (worker, code, signal) => {
        log.warn(`线程 PID ${worker.process.pid} 已退出，代码：${code}`, "APP")
        log.info(`尝试启动新线程`, "APP")
        cluster.fork(); // 重新启动子进程
    });
}