# Hahow Recruiment Project

Demo Server URL: <https://iwantthisjobsobad.tw/>

Recruiment Project by Hahow [BackEnd](https://github.com/hahow/hahow-recruit/blob/master/backend.md)

## 我們該如何跑起這個 server

1. 於您的雲端 server 安裝 git 及 docker
2.
```bash
git clone https://github.com/cherylchao6/hahow_homework.git
```
3.由於啟動 nginx container 需要 SSL 憑證，請將SSL 憑證同步至雲端 server 內，位置為 hahow_homework/nginx/ssl 資料夾內，以下為我的雲端 server 完整資料結構
```bash
hahow_homework
├── docker-compose.yml
├── hero_web.sql
├── nginx
│   ├── default.conf
│   ├── dockerfile
│   └── ssl
│       ├── certificate.crt
│       └── private.key
├── nodejsapp
│   ├── app.js
│   ├── auto_cron.js
│   ├── dockerfile
│   ├── insert_db.js
│   ├── node_modules
│   ├── package.json
│   ├── package-lock.json
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
│   └── test
│       ├── fake_data_generator.js
│       ├── fake_data.js
│       ├── hero_api_test.js
│       ├── set_up.js
│       └── teardown.js
└── redis
    └── dockerfile
```

