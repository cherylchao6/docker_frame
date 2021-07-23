require("dotenv").config();
const { NODE_ENV } = process.env;

const InsertDB = require("./fake_data");


const { pool } = require("../server/models/mysql");

async function _insertHeroes () {
  console.log('insert Data')
  await pool.query("INSERT INTO heroes (hero_id, name, image, date) VALUES ?", [InsertDB.mysqlHeroes]);
  await pool.query("INSERT INTO profile (hero_id, str, inte, agi, luk, date) VALUES ?", [InsertDB.mysqlProfiles]);
  return;
}

async function createFakeData () {
  console.log('createFakeData')
  if (NODE_ENV !== "test") {
    console.log("Not in test env");
    return;
  }
  await _insertHeroes();
}
async function truncateFakeData () {
  if (NODE_ENV !== "test") {
    console.log("Not in test env");
    return;
  }
  console.log('truncate table');
  const truncateTable = async (table) => {
    const conn = await pool.getConnection();
    await conn.query("START TRANSACTION");
    await conn.query("SET FOREIGN_KEY_CHECKS = ?", 0);
    await conn.query(`TRUNCATE TABLE ${table}`);
    await conn.query("SET FOREIGN_KEY_CHECKS = ?", 1);
    await conn.query("COMMIT");
    await conn.release();
  };
  const tables = ["heroes", "profile"];
  for (const table of tables) {
    await truncateTable(table);
  }
}

async function closeConnection () {
  return await pool.end();
}

async function main () {
  await truncateFakeData();
  await createFakeData();
  await closeConnection();
}

// execute when called directly.
if (require.main === module) {
  main();
}

module.exports = {
  createFakeData,
  truncateFakeData,
  closeConnection
};


