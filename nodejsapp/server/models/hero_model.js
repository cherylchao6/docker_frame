const { pool } = require("./mysql");
const redis = require("redis");
const client = redis.createClient({
  port:6379,
  host:'redis'
});
// const client = redis.createClient('6379');
const { getCache } = require("../util");

const insertHeroes = async (heroData,heroProfoles) => {
  console.log("insert latest api data into mysql");
  await pool.query("INSERT INTO heroes (hero_id, name, image, date) VALUES ?", [heroData]);
  //since the 'int' is the conserved world in mysql
  //use 'inte' to store data in DB instead.
  await pool.query("INSERT INTO profile (hero_id, str, inte, agi, luk, date) VALUES ?", [heroProfoles]);
  let lastestDateResult = await pool.query('SELECT MAX(date) FROM heroes');
  //only select latest data
  let lastestDate = lastestDateResult[0][0]['MAX(date)']
  let heroes = await pool.query(`SELECT hero_id as id, name, image FROM heroes WHERE heroes.date = '${lastestDate}'`)
  let heroesWithProfile = await pool.query(`SELECT heroes.hero_id as id, heroes.name, heroes.image, profile.str, profile.inte, profile.agi, profile.luk FROM heroes JOIN profile ON heroes.hero_id = profile.hero_id and heroes.date = profile.date WHERE heroes.date = '${lastestDate}'`);
  for (let i in heroesWithProfile[0]) {
    //wrap data into required format after select from sql 
    let profile = {
      str: heroesWithProfile[0][i]['str'],
      int: heroesWithProfile[0][i]['inte'],
      agi: heroesWithProfile[0][i]['agi'],
      luk: heroesWithProfile[0][i]['luk']
    }
    delete heroesWithProfile[0][i]['str'];
    delete heroesWithProfile[0][i]['inte'];
    delete heroesWithProfile[0][i]['agi'];
    delete heroesWithProfile[0][i]['luk'];
    heroesWithProfile[0][i]['profile'] = profile;
  }
  //wrap redis data
  let redisHeroesWithProfile = {
    heroes:heroesWithProfile[0]
  }
  let redisHeroes = {
    heroes: heroes[0]
  };
  let redisHero = {};
  for (let i in heroes[0]) {
    let id = heroes[0][i]['id'];
    redisHero[id] = heroes[0][i]
  }
  let redisHeroWithProfile = {};
  for (let i in heroesWithProfile[0]) {
    let id = heroesWithProfile[0][i]['id'];
    redisHeroWithProfile[id] = heroesWithProfile[0][i];
  }
  //store data in redis
  console.log('store data in redis');
  client.set("redisHeroes", JSON.stringify(redisHeroes));
  client.set("redisHero", JSON.stringify(redisHero));
  client.set("redisHeroesWithProfile", JSON.stringify(redisHeroesWithProfile));
  client.set("redisHeroWithProfile", JSON.stringify(redisHeroWithProfile));
};


const selectHeroes = async (requestDetail) => {
  const { getCache } = require("../util");
  let {heroId, member} = requestDetail;
  let checkCashe = await getCache('redisHeroes');
  // if there is data in redis, get it from redis
  if (checkCashe !== null) {
    console.log('get data from redis')
    if (!heroId && !member) {
      return JSON.parse(checkCashe);
    }
    if (!heroId && member) {
      let data = await getCache("redisHeroesWithProfile");
      return JSON.parse(data);
    }
    if (heroId && !member) {
      let unparsedData = await getCache("redisHero");
      let allHeroes = JSON.parse(unparsedData);
      // since the type of key in redis is string
      let id = heroId.toString();
      let heroData = allHeroes[id];
      return heroData
    }
    if (heroId && member) {
      let unparsedData = await getCache("redisHeroWithProfile");
      let allHeroes = JSON.parse(unparsedData);
      let id = heroId.toString();
      let heroData = allHeroes[id];
      return heroData
    }
  } else {
    // if there is no data in redis, get it from mysql DB
    //only select latest data
    console.log("get data from mysql")
    let lastestDateResult = await pool.query('SELECT MAX(date) FROM heroes');
    let lastestDate = lastestDateResult[0][0]['MAX(date)'];
    if (!heroId && !member) {
      let heroes = await pool.query(`SELECT hero_id as id, name, image FROM heroes WHERE heroes.date = '${lastestDate}'`);
      let data = {
        heroes: heroes[0]
      };
      return data;
    }
    if (!heroId && member) {
      let heroesWithProfile = await pool.query(`SELECT heroes.hero_id as id, heroes.name, heroes.image, profile.str, profile.inte, profile.agi, profile.luk FROM heroes JOIN profile ON heroes.hero_id = profile.hero_id and heroes.date = profile.date WHERE heroes.date = '${lastestDate}'`);
      for (let i in heroesWithProfile[0]) {
        let profile = {
          str: heroesWithProfile[0][i]['str'],
          int: heroesWithProfile[0][i]['inte'],
          agi: heroesWithProfile[0][i]['agi'],
          luk: heroesWithProfile[0][i]['luk']
        }
        delete heroesWithProfile[0][i]['str'];
        delete heroesWithProfile[0][i]['inte'];
        delete heroesWithProfile[0][i]['agi'];
        delete heroesWithProfile[0][i]['luk'];
        heroesWithProfile[0][i]['profile'] = profile;
      }
      let data = {
        heroes:heroesWithProfile[0]
      }
      return data;
    }
    if (heroId && !member) {
      let data = await pool.query(`SELECT hero_id as id, name, image FROM heroes WHERE date = '${lastestDate}' and hero_id = ${heroId}`);
      return data[0][0];
    }
    if (heroId && member) {
      let data = await pool.query(`SELECT heroes.hero_id as id, heroes.name, heroes.image, profile.str, profile.inte, profile.agi, profile.luk FROM heroes JOIN profile ON heroes.hero_id = profile.hero_id and heroes.date = profile.date WHERE heroes.date = '${lastestDate}' and heroes.hero_id = ${heroId}`);
      let profile = {
        str: data[0][0]['str'],
        int: data[0][0]['inte'],
        agi: data[0][0]['agi'],
        luk: data[0][0]['luk']
      }
      delete data[0][0]['str'];
      delete data[0][0]['inte'];
      delete data[0][0]['agi'];
      delete data[0][0]['luk'];
      data[0][0]['profile'] = profile;
      return data[0][0];
    }
  }
};



module.exports = {
  insertHeroes,
  selectHeroes
};