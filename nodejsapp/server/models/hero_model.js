const { pool } = require("./mysql");
const { getCache, client } = require("./redis");

const insertHeroes = async (heroData, heroProfoles) => {
  const conn = await pool.getConnection();
  try {
    console.log("insert latest api data into mysql");
    await conn.query("START TRANSACTION");
    await pool.query("INSERT INTO heroes (hero_id, name, image, date) VALUES ?", [heroData]);
    // since the 'int' is the conserved world in mysql
    // use 'inte' to store data in DB instead.
    await pool.query("INSERT INTO profile (hero_id, str, inte, agi, luk, date) VALUES ?", [heroProfoles]);
    const lastestDateResult = await pool.query("SELECT MAX(date) FROM heroes");
    // only select latest data
    const lastestDate = lastestDateResult[0][0]["MAX(date)"];
    const heroes = await pool.query(`SELECT hero_id as id, name, image FROM heroes WHERE heroes.date = '${lastestDate}'`);
    const heroesWithProfile = await pool.query(`SELECT heroes.hero_id as id, heroes.name, heroes.image, profile.str, profile.inte, profile.agi, profile.luk FROM heroes JOIN profile ON heroes.hero_id = profile.hero_id and heroes.date = profile.date WHERE heroes.date = '${lastestDate}'`);
    for (const i in heroesWithProfile[0]) {
      // wrap data into required format after select from sql
      const profile = {
        str: heroesWithProfile[0][i].str,
        int: heroesWithProfile[0][i].inte,
        agi: heroesWithProfile[0][i].agi,
        luk: heroesWithProfile[0][i].luk
      };
      delete heroesWithProfile[0][i].str;
      delete heroesWithProfile[0][i].inte;
      delete heroesWithProfile[0][i].agi;
      delete heroesWithProfile[0][i].luk;
      heroesWithProfile[0][i].profile = profile;
    }
    // wrap redis data
    const redisHeroesWithProfile = {
      heroes: heroesWithProfile[0]
    };
    const redisHeroes = {
      heroes: heroes[0]
    };
    const redisHero = {};
    for (const i in heroes[0]) {
      const id = heroes[0][i].id;
      redisHero[id] = heroes[0][i];
    }
    const redisHeroWithProfile = {};
    for (const i in heroesWithProfile[0]) {
      const id = heroesWithProfile[0][i].id;
      redisHeroWithProfile[id] = heroesWithProfile[0][i];
    }
    // store data in redis
    console.log("store data in redis");
    client.set("redisHeroes", JSON.stringify(redisHeroes));
    client.set("redisHero", JSON.stringify(redisHero));
    client.set("redisHeroesWithProfile", JSON.stringify(redisHeroesWithProfile));
    client.set("redisHeroWithProfile", JSON.stringify(redisHeroWithProfile));
    const message = {
      message: "Insert DB done."
    };
    return message;
  } catch (error) {
    console.log(error);
    await conn.query("ROLLBACK");
    return { error };
  } finally {
    conn.release();
  }
};

const selectHeroes = async (requestDetail) => {
  const { heroId, member } = requestDetail;
  const checkCashe = await getCache("redisHeroes");
  // if there is data in redis, get it from redis
  if (checkCashe !== null) {
    console.log("get data from redis");
    if (!heroId && !member) {
      return JSON.parse(checkCashe);
    }
    if (!heroId && member) {
      const data = await getCache("redisHeroesWithProfile");
      return JSON.parse(data);
    }
    if (heroId && !member) {
      const unparsedData = await getCache("redisHero");
      const allHeroes = JSON.parse(unparsedData);
      // since the type of key in redis is string
      const id = heroId.toString();
      const heroData = allHeroes[id];
      return heroData;
    }
    if (heroId && member) {
      const unparsedData = await getCache("redisHeroWithProfile");
      const allHeroes = JSON.parse(unparsedData);
      const id = heroId.toString();
      const heroData = allHeroes[id];
      return heroData;
    }
  } else {
    // if there is no data in redis, get it from mysql DB
    // only select latest data
    console.log("get data from mysql");
    const lastestDateResult = await pool.query("SELECT MAX(date) FROM heroes");
    const lastestDate = lastestDateResult[0][0]["MAX(date)"];
    if (!heroId && !member) {
      const heroes = await pool.query(`SELECT hero_id as id, name, image FROM heroes WHERE heroes.date = '${lastestDate}'`);
      const data = {
        heroes: heroes[0]
      };
      return data;
    }
    if (!heroId && member) {
      const heroesWithProfile = await pool.query(`SELECT heroes.hero_id as id, heroes.name, heroes.image, profile.str, profile.inte, profile.agi, profile.luk FROM heroes JOIN profile ON heroes.hero_id = profile.hero_id and heroes.date = profile.date WHERE heroes.date = '${lastestDate}'`);
      for (const i in heroesWithProfile[0]) {
        const profile = {
          str: heroesWithProfile[0][i].str,
          int: heroesWithProfile[0][i].inte,
          agi: heroesWithProfile[0][i].agi,
          luk: heroesWithProfile[0][i].luk
        };
        delete heroesWithProfile[0][i].str;
        delete heroesWithProfile[0][i].inte;
        delete heroesWithProfile[0][i].agi;
        delete heroesWithProfile[0][i].luk;
        heroesWithProfile[0][i].profile = profile;
      }
      const data = {
        heroes: heroesWithProfile[0]
      };
      return data;
    }
    if (heroId && !member) {
      const data = await pool.query(`SELECT hero_id as id, name, image FROM heroes WHERE date = '${lastestDate}' and hero_id = ?`, heroId);
      return data[0][0];
    }
    if (heroId && member) {
      const data = await pool.query(`SELECT heroes.hero_id as id, heroes.name, heroes.image, profile.str, profile.inte, profile.agi, profile.luk FROM heroes JOIN profile ON heroes.hero_id = profile.hero_id and heroes.date = profile.date WHERE heroes.date = '${lastestDate}' and heroes.hero_id = ?`, heroId);
      if (data[0].length === 0) {
        return;
      }
      const profile = {
        str: data[0][0].str,
        int: data[0][0].inte,
        agi: data[0][0].agi,
        luk: data[0][0].luk
      };
      delete data[0][0].str;
      delete data[0][0].inte;
      delete data[0][0].agi;
      delete data[0][0].luk;
      data[0][0].profile = profile;
      return data[0][0];
    }
  }
};

module.exports = {
  insertHeroes,
  selectHeroes
};
