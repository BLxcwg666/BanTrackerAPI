# BanTrackerAPI
A Hypixel Ban Tracker API For Ban Tracker Opai Client™ Extension

## Run
`pnpm i`&&`pnpm start`

## Build
`pnpm i -g @vercel/ncc pkg`&&`pnpm build`

## Env
Create `.env` and input：
```
API_HOST=0.0.0.0
API_PORT=3000
```

## Endpoint
`/`：
```
{
  "staff": {
    "last_half_hour": 0,
    "last_day": 1607,
    "total": 4980261
  },
  "watchdog": {
    "last_minute": 2,
    "last_day": 1425,
    "total": 9811352
  },
  "banHistory": [],
  "lastUpdated": {
    "timestamp": 1746645204082,
    "formated": "03:13:24"
  }
}
```
`/wdr`：
```
{
  "wdr": "🐕🐕 Hypixel Ban Tracker 👮‍👮‍\n[🐕] 过去一分钟有 1 人被狗咬了\n[🐕‍] 狗在过去二十四小时内已封禁 1426 人,\n\n[👮‍] 过去的半小时有 1 人被逮捕了\n[👮‍] 客服在过去二十四小时内已封禁 1607 人,\n\n上次更新: 03:13:51 2秒前\n最近封禁记录:\n[👮] [03:13:39] banned 1 player.\n[🐕] [03:13:27] banned 1 player."
}
```
`/wdr/raw`：
```
🐕🐕 Hypixel Ban Tracker 👮‍👮‍
[🐕] 过去一分钟有 1 人被狗咬了
[🐕‍] 狗在过去二十四小时内已封禁 1426 人,

[👮‍] 过去的半小时有 1 人被逮捕了
[👮‍] 客服在过去二十四小时内已封禁 1606 人,

上次更新: 03:14:15 1秒前
最近封禁记录:
[👮] [03:13:39] banned 1 player.
[🐕] [03:13:27] banned 1 player.
```

## Thanks
https://github.com/HypixelBanTrackerProject/webapi