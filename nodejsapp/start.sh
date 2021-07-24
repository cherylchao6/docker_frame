#!/bin/bash
pm2 start app.js
node insertDB.js
