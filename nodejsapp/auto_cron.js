const cron = require("node-cron");
const fetch = require("node-fetch");
const { pool } = require("./server/models/mysql.js");
const { insertApiData } = require("./server/util");
require("dotenv").config();

const { UPDATE_DATA_FREQENCY } = process.env;

checkLatestData();

function checkLatestData () {
  // check if there are new heroes everyday
  cron.schedule(UPDATE_DATA_FREQENCY, async () => {
  // check heroes data
    await fetch("https://hahow-recruit.herokuapp.com/heroes", {
      method: "GET"
    })
      .then(async (res) => {
        // compare heroes data from api and mysql
        const apiData = await res.json();
        // in case there is unwanted data format of returned api data
        if (apiData.length && apiData[0].id) {
          const lastestDateResult = await pool.query("SELECT MAX(date) FROM heroes");
          const lastestDate = lastestDateResult[0][0]["MAX(date)"];
          const sqlData = await pool.query(`SELECT hero_id as id, name, image FROM heroes WHERE date = '${lastestDate}'`);
          const heroDataCompare = (apiData.toString() == sqlData[0].toString());
          // get all hero ids for profile api
          const apiHeroIdArr = [];
          for (const i in apiData) {
          // for profile api
            apiHeroIdArr.push(apiData[i].id);
          }
          // compare profile data from api and mysql
          const apiHeroProfiles = await getHerosProfile(apiHeroIdArr);
          const sqlHeroProfiles = await pool.query(`SELECT hero_id, str, inte, agi, luk FROM profile WHERE date = '${lastestDate}'`);
          const profileCompare = (apiHeroProfiles.toString() == sqlHeroProfiles[0].toString());
          if (heroDataCompare && profileCompare) {
            console.log("no need to update data");
          } else {
            console.log("update data");
            await insertApiData();
          }
        } else {
          console.log("The heroes data format is incorrect");
          checkLatestData();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
}

// get each hero profile
async function getHerosProfile (arr) {
  const heroProfiles = [];
  for (let i = 0; i < arr.length; i++) {
    const heroProfile = {};
    heroProfile.hero_id = arr[i];
    await fetch(`https://hahow-recruit.herokuapp.com/heroes/${arr[i]}/profile`, {
      method: "GET"
    })
      .then(async (res) => {
        const profileData = await res.json();
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
      })
      .catch((err) => {
        console.log(err);
      });
  }
  return heroProfiles;
}
