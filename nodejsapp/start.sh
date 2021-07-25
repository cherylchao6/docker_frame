#!/bin/bash
pm2 start app.js
node insert_db.js
