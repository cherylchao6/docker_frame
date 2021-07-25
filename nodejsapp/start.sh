#!/bin/bash
pm2 start app.js
pm2 start insert_db.js
pm2 start auto_cron.js
