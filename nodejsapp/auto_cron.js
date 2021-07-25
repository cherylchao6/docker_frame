const cron = require("node-cron");
const fetch = require("node-fetch");
const { pool } = require("./server/models/mysql.js");
const { insertApiData, getApiData } = require("./server/util");
require("dotenv").config();

const { UPDATE_DATA_FREQENCY } = process.env;

// check if there are new heroes everyday
cron.schedule(UPDATE_DATA_FREQENCY, async () => {
  try {
    let apiData;
    do {
      apiData = await getApiData();
    } while (apiData === "wrong data format");
    // compare heroes data from api and mysql
    const lastestDateResult = await pool.query("SELECT MAX(date) FROM heroes");
    const lastestDate = lastestDateResult[0][0]["MAX(date)"];
    const sqlData = await pool.query(`SELECT hero_id as id, name, image FROM heroes WHERE date = '${lastestDate}'`);
    const heroDataCompare = (apiData.toString() === sqlData[0].toString());
    // get all hero ids for profile api
    const apiHeroIdArr = [];
    for (const i in apiData) {
    // for profile api
      apiHeroIdArr.push(apiData[i].id);
    }
    // compare profile data from api and mysql
    const apiHeroProfiles = await getHerosProfile(apiHeroIdArr);
    const sqlHeroProfiles = await pool.query(`SELECT hero_id, str, inte, agi, luk FROM profile WHERE date = '${lastestDate}'`);
    const profileCompare = (apiHeroProfiles.toString() === sqlHeroProfiles[0].toString());
    if (heroDataCompare && profileCompare) {
      console.log("no need to update data");
    } else {
      console.log("update data");
      await insertApiData();
    }
  } catch (err) {
    console.log("error in getHerosData");
  }
});

// get each hero profile
async function getHerosProfile (arr) {
  try {
    const heroProfiles = [];
    for (let i = 0; i < arr.length; i++) {
      const heroProfile = {};
      heroProfile.hero_id = arr[i];
      const result = await fetch(`https://hahow-recruit.herokuapp.com/heroes/${arr[i]}/profile`, {
        method: "GET"
      });
      const profileData = await result.json();
      // in case there is unwanted data format of returned api data
      if (profileData.str) {
        heroProfile.str = profileData.str;
        heroProfile.inte = profileData.int;
        heroProfile.agi = profileData.agi;
        heroProfile.luk = profileData.luk;
        heroProfiles.push(heroProfile);
      } else {
        console.log("The hero profile data format is not correct");
        i--;
      }
    }
    return heroProfiles;
  } catch (err) {
    console.log("error in getHerosProfile");
  }
}
