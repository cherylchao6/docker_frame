··# Hahow Recruiment Project

Demo Server URL: <https://iwantthisjobsobad.tw/>

Recruiment Project by Hahow [BackEnd](https://github.com/hahow/hahow-recruit/blob/master/backend.md)

## 我們該如何跑起這個 server

1. 於您的雲端 server 安裝 git 及 docker
2. 將我的作品clone下來
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
│       ├── ake_data_generator.js
│       ├── fake_data.js
│       ├── hero_api_test.js
│       ├── set_up.js
│       └── teardown.js
└── redis
    └── dockerfile
```
4. 請於 hahow_homework/nginx 的 default.conf 檔，port 80 及 443 的 server_name 填上您的網域名稱
5. 請將 hero_web.sql import 至您的 RDS，並將 schema 命名為 hero_web
6. 在 hahow_homework/nodejsapp 內，依照 .env-template 檔，新增 .env 檔
7. 創建連接各 container 所需的 network
```bash
docker network create interview-net
```
9. 於 hahow_homework 資料夾啟動 compose 檔以創建 container，並用 network 相連
```bash
docker-compose up
```
10.為選擇性步驟，為了能定期檢查最新的官方 hero 資料是否與資料庫相同，請跑定期爬蟲腳本，目前預設的爬蟲頻率為每天一次，您可以於 .env 檔客製化您喜愛的更新頻率
```bash
docker exec -it nodejsserver bash
pm2 start auto_cron.js
```


## 專案的架構、Web 的架構邏輯

### 專案的設計邏輯

由於我發現只要有透過第三方api拿到資料，再整理再回傳，我的 server response 的效率不彰，尤其若是還要第三方驗證帳號密碼，故採用於啟動 server 時，先從第三方api拿到所有資料，整理成對應的資料格式並存至 mysql，另外為了再加速資料拿取速度，也將資料存至 redis ，當使用者送 request 至我的 server 時，會先從 redis 拿取資料，若 redis 沒有資料 (由於我有定期爬蟲，難以保證若剛好在更新 redis，會拿不到資料)，可再進一步從 sql 拿取，以確保一定有資料回傳。另外我也思考過，帳號密碼是否我的 server 自己驗證就好，但考量第三方資料存取權限，不應該由我來決定，所以還是透過第三方認證的方式，再給予使用者相對應的資料。
再進一步思考仍然有存在著資料即時性的問題，今天我不確定第三方資料多久會更新，為了解決此問題，我寫了自動爬蟲的腳本，頻率目前為每天一次，將爬下來的第三方資料與 mysql 資料庫比對，若是一樣就不用更新，若是發現不一樣，就連同時間標記插入新的一批資料，由於資料庫有時間標記，我每次都是給使用者最新的資料，時間標記有另一大好處，就是我可以日後分析第三方資料多久會更新，進一步調整我爬蟲的頻率，另外我也想到其他有趣的用途，像是我們就可以知道某個英雄發行日期，或是某個英雄他的詳細資料變化的各個時間點(什麼時候智力提升或力氣變大等等)，畢竟資料就是價值啊！

<img width="977" alt="截圖 2021-07-24 下午4 23 27" src="https://user-images.githubusercontent.com/77141019/126862595-0d70ca7e-4328-494f-8c39-b3ab113fe1d9.png">

### API server 的架構邏輯
<img width="1006" alt="截圖 2021-07-24 上午11 14 06" src="https://user-images.githubusercontent.com/77141019/126862829-dd43dd0a-c716-412e-9aa6-d70f43ee1286.png">

## 你對於所有使用到的第三方 library 的理解，以及他們的功能簡介

- Framework: React with React Hooks
- UI Library： [Styled Components](https://styled-components.com/)、[Ant Design](https://ant.design/)
- Router： [React Router Dom](https://reactrouter.com/web/guides/quick-start)
- HTTP： [Axios](https://axios-http.com/docs/intro)
- Bundler: [Webpack](https://webpack.js.org/)
- Compiler: [Babel](https://babeljs.io/)
- Code Splitting: [React Loadable](https://github.com/jamiebuilds/react-loadable)
- Unit Test: [Jest](https://jestjs.io/), [moxios](https://github.com/axios/moxios), [testing-library](https://testing-library.com/)
- Coding Style： [Eslint](https://eslint.org/)






