const fetch = require('node-fetch');
const { insertHeroes } = require("../server/models/hero_model.js");
const redis = require("redis");
const client = redis.createClient({
  port:6379,
  host:'redis'
});
// const client = redis.createClient('6379');

async function verifyMember (req, res, next) {
  const {name, password}= req.headers;
  // check if there are name and password in request header
  if (name && password) {
    const user = {
      name,
      password
    };
    await fetch('https://hahow-recruit.herokuapp.com/auth',{
      method: "POST",
      body: JSON.stringify(user),
      headers: { "Content-Type": "application/json" }
    })
    .then((reply)=>{
      // authorized member
      console.log(reply.status === 200)
      if (reply.status === 200) {
        req.headers.member = true;
      } else {
        // provided invalid name or password;
        req.headers.member = false;
      }
    })
    next();
  } else {
    //not a member
    req.headers.member = false;
    next();
  }
}

function getCache (key) { // used in async function
  return new Promise((resolve, reject) => {
      client.get(key, (err, data) => {
          if (err) reject(err);
          resolve(data);
      });
  });
}

async function insertApiData () {
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
    await insertHeroes(heroesData,heroProfiles);
  })
  .catch((err)=>{
    console.log(err);
  })
}

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

module.exports = {
  verifyMember,
  getCache,
  insertApiData
};