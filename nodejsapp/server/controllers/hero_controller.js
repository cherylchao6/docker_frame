const Heroes = require("../models/hero_model.js");

const getHeroes = async (req, res, next) => {
  try {
    let requestDetail = {};
    const heroId = req.params.heroId;
    if (!heroId && req.headers.member) {
      requestDetail = {
        member: true
      };
    }
    if (heroId && !req.headers.member) {
      requestDetail = {
        heroId
      };
    }
    if (heroId && req.headers.member) {
      requestDetail = {
        heroId,
        member: true
      };
    }
    const data = await Heroes.selectHeroes(requestDetail);
    if (data) {
      res.status(200).send(data);
      return;
    } else {
      res.status(200).send({ Message: "The hero dose not exist!" });
    }
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getHeroes
};
