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
10. 為選擇性步驟，為了能定期檢查最新的官方 hero 資料是否與資料庫相同，請跑定期爬蟲腳本，目前預設的爬蟲頻率為每天一次，您可以於 .env 檔客製化您喜愛的更新頻率
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

### dotenv

- 功能簡介：

  可協助你設定環境變數的套件

- 個人理解＆感想：

  在部署 server 時，不論是測試或正式開發環境會有許多不同的環境變數設定，有的甚至是機密資料，比如說 hostname、port和帳號密碼等等，都可放置 env 檔統一管理，或是其他你想要彈性設定環境變數，像是我這次的小專案，爬蟲頻率也寫至 env 檔，這樣就不用要更改時，都還要到相對應的檔案更改。

### express

- 功能簡介：
  
  node 的 web 框架

- 個人理解＆感想：

  我很老實說打從一開始使用 node 寫後端的時候，教學的第一步就是要 npm install express XD ，所以我沒有辦法比較有沒有使用該框架的區別，但是看了網路資料後，我的理解是，若是沒有 express ，就不能針對額外的不同的HTTP方法(例如：GET, POST, DELETE等)增加特定的處理，而且許多參數都要自己設定，code 會變很冗長，有了 express ，許多整套的功能皆包裝好，我們只要引用相對應的參數即可。


### mysql2

- 功能簡介：

  使 node.js server 能連上 mysql DB

- 個人理解＆感想：

  之所以會用這個新版的套件而不是 mysqljs/mysql，是因為裡面有許多實用的功能，如自動 promisify funciton ，或是有 format 可以檢查 query 語句是否正確

### node-cron

- 功能簡介：

  在 node.js 裡能用 crontab 語法來撰寫自動任務腳本

- 個人理解＆感想：
  
  為了能定期將第三方 api 資料與 db 比對，我才會使用該 library 來設定自動執行腳本的時間點，不過這是我第一次體驗自動爬蟲，滿有趣的！
  
### node-fetch

- 功能簡介：

  在 node.js 裡能用瀏覽器的 fetch 語法對目標 api 送出請求

- 個人理解＆感想：
  
  因為自己之前的專案前端寫了大量的 fetch ，比較習慣該語法，故使用此套件
  
### nodemon

- 功能簡介：

   當偵測到 node.js 檔案有變化時，會自動重啟 node application

- 個人理解＆感想：
  
  這樣就不用每次有修改後都還要 node app.js ，很方便

### redis

- 功能簡介：

   使 node.js server 能連上 redis
   
### chai && chai-http

- 功能簡介：

   chai 提供 BDD 語法測試用的斷言庫（Assertion Library）。斷言庫是一種判斷工具，明確地將預測結果指出。若實際結果和預測不同，就是測試有誤。
   chai-http 則是與 assertions 一同運作，進行HTTP integration tests。

- 個人理解＆感想：

  有了 chai 和 chai-http，我就能針對 api 測試 http request 有沒有預期中的 response code 和 data。
  
## 你對於所有使用到的第三方服務和其他工具的理解，以及他們的功能簡介

### AWS EC2

- 功能簡介：

   讓您建立雲端虛擬伺服器，可客製化作業系統，容量限制，對應 IP 等等。 

- 個人理解＆感想：

  我也很老實的說我沒有用過其他服務來架設我的 server ，但我覺得 AWS EC2 服務很多，像是你可以預先設置好 AMI 當作建立 server 的模板，可用於處理高流量時的 auto-scaling (或是自己把不小心把 server 搞爆的時候不用砍掉重來？ＸＤ）

### AWS RDS

- 功能簡介：

   讓您於雲端管理 relational database 

- 個人理解＆感想：

  在沒有使用 RDS 之前，我只能很土炮的每次都要先把 mysql 當下的 table 都 dump 出來，再到雲端 import ，但自從有了 AWS RDS 的服務，我的 local 端和 雲端 server 都能管理同一個資料庫，另外還有一個好處是，若是有 server 水平擴展的需求，有了 AWS RDS ，所有 serverv 間同步資料庫相對簡易
  
### NGINX

- 功能簡介：

   NGINX 為反向代理伺服器，能提供 Load Balance、快取以及 HTTPS 憑證，rate-limit 等功能。（server 很棒的秘書？）
   
- 個人理解＆感想：

  由於正向代理是 server 端不知道 client 端是誰，反向代理即是倒過來，會變成 client 端不知道 server 端真實 IP，這樣可以減少 server 被攻擊的機會，另外我之前都專案在單一 server 內包了兩個web server，由於 IP 都是同一個，也是藉由 NGINX 幫我導倒不同 port ，並且統一管理我兩個不同 domain 的 ssl。
  
### Docker

- 功能簡介：

   Docker 是一種軟體管理平台，可讓您快速地建立、測試和部署應用程式。
   
- 個人理解＆感想：

  我本身最近對於 docker 一直都很有興趣(因爲大家一直說輕量級？很潮？很方便？)，所以決定藉由這個小專案來玩看看 docker，首先看了很多介紹， 就我的理解，docker 的目的是為了讓開發者都能於統一環境開發、測試部署應用程式，那又進一步會將 docker 與 VM 做比較，最大的不同是docker 是用原生的 linux kernel 既有的功能來切割劃分 container 所需資料，而 VM 會需要另外切割空間給 guest OS，並且，由於 host OS 還需要透過 hypervisor 來轉譯 guest OS 每一步的操作，電腦負擔會比較大，我曾經看到一個很棒的比喻，VM 是 'virtualizing hardware'，而 docker 是 'virtualizing operating system'，下面遇到的困難會再進一步帶入我實作上遇到的困難與感想。




