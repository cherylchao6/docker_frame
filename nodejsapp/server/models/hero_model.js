const { pool } = require("./mysql");

// 從controller傳來的值
const insertHeroes = async (heroData,heroProfoles) => {
  console.log('here');
  console.log(heroData);
  console.log(typeof heroProfoles[0][2]);
  await pool.query("INSERT INTO heroes (hero_id, name, image, date) VALUES ?", [heroData]);
  await pool.query("INSERT INTO profile (hero_id, str, inte, agi, luk, date) VALUES ?", [heroProfoles]);
};

const selectHeroes = async (requestDetail) => {
  
};




module.exports = {
  insertHeroes,
  selectHeroes
};