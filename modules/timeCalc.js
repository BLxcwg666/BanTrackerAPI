function timeCalc(timestamp, includeMs = true) {
    const now = Date.now();
    const ts = timestamp > 1e12 ? timestamp : timestamp * 1000;
    let delta = now - ts;
    const isPast = delta >= 0;
    delta = Math.abs(delta);

    const units = includeMs
        ? [
            ["年", 365 * 24 * 60 * 60 * 1000],
            ["个月", 30 * 24 * 60 * 60 * 1000],
            ["周", 7 * 24 * 60 * 60 * 1000],
            ["天", 24 * 60 * 60 * 1000],
            ["小时", 60 * 60 * 1000],
            ["分钟", 60 * 1000],
            ["秒", 1000],
            ["毫秒", 1],
        ]
        : [
            ["年", 365 * 24 * 60 * 60 * 1000],
            ["个月", 30 * 24 * 60 * 60 * 1000],
            ["周", 7 * 24 * 60 * 60 * 1000],
            ["天", 24 * 60 * 60 * 1000],
            ["小时", 60 * 60 * 1000],
            ["分钟", 60 * 1000],
            ["秒", 1000],
        ];

    for (const [unit, ms] of units) {
        if (delta >= ms) {
            const value = unit === "毫秒" ? delta : Math.floor(delta / ms);
            return `${value}${unit}${isPast ? "前" : "后"}`;
        }
    }

    return "刚刚";
}

module.exports = timeCalc;