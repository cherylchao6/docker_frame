const { pool } = require("./mysql");
const redis = require("redis");
const client = redis.createClient({
  port:6379,
  host:'redis'
});

// 從controller傳來的值
const insertHeroes = async (heroData,heroProfoles) => {
  await pool.query("INSERT INTO heroes (hero_id, name, image, date) VALUES ?", [heroData]);
  await pool.query("INSERT INTO profile (hero_id, str, inte, agi, luk, date) VALUES ?", [heroProfoles]);
  let lastestDateResult = await pool.query('SELECT MAX(date) FROM heroes');
  let lastestDate = lastestDateResult[0][0]['MAX(date)']
  let heroes = await pool.query(`SELECT hero_id as id, name, image FROM heroes WHERE heroes.date = '${lastestDate}'`)
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
  console.log(redisHeroes);
  console.log(redisHero)
  console.log(redisHeroesWithProfile)
  console.log(redisHeroWithProfile)
  client.set("redisHeroes", redisHeroes);
  client.set("redisHero", redisHero);
  client.set("redisHeroesWithProfile", redisHeroesWithProfile);
  client.set("redisHeroWithProfile", redisHeroWithProfile);
};

const selectHeroes = async (requestDetail) => {
  
};




module.exports = {
  insertHeroes,
  selectHeroes
};