// const redis = require("redis");
// const client = redis.createClient({
//   port:6379,
//   host:'redis'
// });

const Heroes = require("../models/hero_model.js");
const getHeroes = async (req, res, next) => {
  try {
    let requestDetail = {};
    console.log
    await Heroes.selectHeroes();
  } catch (err) {
    next(err);
  }
};


module.exports = {
  getHeroes
};