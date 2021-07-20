//require mysql function 
//require redis function 
const cron = require('node-cron');
const fetch = require('node-fetch');
const Heroes = require("./server/models/hero_model.js");
// //check if there are new heroes everyday
// cron.schedule("*/2 * * * * *", async () => {
//   await fetch('https://hahow-recruit.herokuapp.com/heroes',{
//     method: "GET",
//   })
//   .then(async(res)=>{
//     let data = await res.json();
//     console.log(data);
//     //put all hero id from api in an array
//     let apiHeroIdArr = [];
//     for (let i in data) {
//       console.log(typeof(data[i]));
//       apiHeroIdArr.push(data[i]['id']);
//     }
//     //get hero id from redis
//     //if there is no data in redis, get data from mysql

//   })
//   .catch((err)=>{
//     console.log(err);
//   })
// })

async function insertHeroes(dataArr) {
  await fetch('https://hahow-recruit.herokuapp.com/heroes',{
    method: "GET"
  })
  .then(async(res)=>{
    let data = await res.json();
    //insert into mysql 
    let heroesData = [];
    let apiHeroIdArr = [];
    const today = new Date();
    let date = today.toISOString().substring(0, 10);
    for (let i in data) {
      let heroData = [];
      heroData.push(data[i]['id']);
      heroData.push(data[i]['name']);
      heroData.push(data[i]['image']);
      heroData.push(date);
      heroesData.push(heroData);

      //for profile api 
      apiHeroIdArr.push(data[i]['id']);
    }
    //iterate apiHeroIdArr and get profile for each hero
    let heroProfiles = await getHerosProfile(apiHeroIdArr);
    await Heroes.insertHeroes(heroesData,heroProfiles);
  })
  .catch((err)=>{
    console.log(err);
  })
}

// insertHeroes();
async function getHerosProfile (arr) {
  const today = new Date();
  let date = today.toISOString().substring(0, 10);
  let heroProfiles = [];
  for (let i in arr) {
    let heroProfile = [];
    heroProfile.push(arr[i]);
    await fetch(`https://hahow-recruit.herokuapp.com/heroes/${arr[i]}/profile`,{
      method: "GET",
    })
    .then (async(res)=>{
      let profileData = await res.json();
      heroProfile.push(profileData['str']);
      heroProfile.push(profileData['int']);
      heroProfile.push(profileData['agi']);
      heroProfile.push(profileData['luk']);
      heroProfile.push(date);
      heroProfiles.push(heroProfile);
    })
    .catch((err)=>{
      console.log(err);
    })
  }
  return heroProfiles;
}
// const today = new Date();
// let date = today.toISOString().substring(0, 10);




