// const redis = require("redis");
// const client = redis.createClient({
//   port:6379,
//   host:'redis'
// });
const fetch = require('node-fetch');
const Heroes = require("../models/hero_model.js");
const getHeroes = async (req, res, next) => {
  try {
    console.log(req.headers)
    let heroId = req.params.heroId
    // is member, give profile

    // await Heroes.selectHeroes();
  } catch (err) {
    next(err);
  }
};



module.exports = {
  getHeroes
};