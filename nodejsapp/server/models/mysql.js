require('dotenv').config();
const mysql = require("mysql2/promise");

const env = process.env.NODE_ENV || "test";
console.log(env)
const { DB_HOST, DB_USER, DB_PWD, DB_DB, DB_DB_TEST } = process.env;
console.log(DB_HOST);
console.log(DB_USER);
console.log(DB_PWD);
console.log(DB_DB);

const mysqlConfig = {
  production: {
    host: DB_HOST,
    user: DB_USER,
    password: DB_PWD,
    database: DB_DB
  },
  test: {
    host: DB_HOST,
    user: DB_USER,
    password: DB_PWD,
    database: DB_DB_TEST
  }
};

const mysqlEnv = mysqlConfig[env];
mysqlEnv.waitForConnections = true;
mysqlEnv.connectionLimit = 20;

const pool = mysql.createPool(mysqlEnv);

module.exports = {
  pool
};
