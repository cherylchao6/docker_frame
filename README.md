# Hahow Recruiment Project

Demo Server URL: <https://iwantthisjobsobad.tw/>

Recruiment Project by Hahow [BackEnd](https://github.com/hahow/hahow-recruit/blob/master/backend.md)

## 我們該如何跑起這個 server

1. 於您的雲端 server 安裝 git 及 docker
2.將我的作品clone下來
```bash
git clone https://github.com/cherylchao6/hahow_homework.git
```
3.由於啟動 nginx container 需要 SSL 憑證，請將SSL 憑證同步至雲端 server 內，位置為 hahow_homework/nginx/ssl 資料夾內，以下為我的雲端 server 完整資料結構
```bash
hahow_homework
├── docker-compose.yml                 
├── hero_web.sql                      # 我的 mysql tables ，提供您 import 至 RDS mysql
├── nginx
│   ├── default.conf
│   ├── dockerfile
│   └── ssl                           # ssl憑證資料夾，為設定 nginx default.conf 所需
│       ├── certificate.crt
│       └── private.key
├── nodejsapp
│   ├── app.js
│   ├── auto_cron.js                  # 定期自動爬蟲腳本
│   ├── dockerfile
│   ├── insert_db.js                  # 打 hahow hero api，拿到所有資料，並插入 RDS mysql 和 redis ，啟動 server 時會自動跑該腳本
│   ├── node_modules
│   ├── package.json
│   ├── package-lock.json
│   ├── .env
│   ├── .env-template
│   ├── server
│   │   ├── controllers
│   │   │   ├── hero_controller.js
│   │   │   └── test_controller.js
│   │   ├── models
│   │   │   ├── hero_model.js
│   │   │   ├── mysql.js
│   │   │   └── redis.js
│   │   ├── routes
│   │   │   ├── hero_route.js
│   │   │   └── test_route.js
│   │   └── util.js
│   ├── start.sh
│   └── test                         # hero api 測試腳本
│       ├── fake_data_generator.js
│       ├── fake_data.js
│       ├── hero_api_test.js
│       ├── set_up.js
│       └── teardown.js
└── redis
    └── dockerfile
```
3. 請將 hero_web.sql import 至您的 RDS，並將 schema 命名為 hero_web
4. 在 hahow_homework/nodejsapp 內，依照 .env-template 檔，新增 .env 檔
5. 於 hahow_homework 資料夾執行
```bash
docker-compose up
```

