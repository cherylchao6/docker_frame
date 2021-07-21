const Heroes = require("../models/hero_model.js");

const getHeroes = async (req, res, next) => {
  try {
    let requestDetail = {};
    console.log(req.headers);
    let heroId = req.params.heroId;
    console.log("13");
    console.log(heroId)
    if (!heroId && req.headers.member) {
      console.log('15')
      requestDetail = {
        member: true
      }
    }
    if (heroId && !req.headers.member) {
      console.log('20')
      requestDetail = {
        heroId
      }
    }
    if (heroId && req.headers.member) {
      console.log('27')
      requestDetail = {
        heroId,
        member: true
      }
    }
    let data = await Heroes.selectHeroes(requestDetail);
    console.log('get data done');
    console.log(data);
    if (data) {
      res.status(200).send(data);
      return;
    } else {
      res.status(200).send({Message:'The hero dose not exist!'});
    }
  } catch (err) {
    next(err);
  }
};



module.exports = {
  getHeroes
};