const fetch = require("node-fetch");
const { insertHeroes } = require("../server/models/hero_model.js");

async function verifyMember (req, res, next) {
  const { name, password } = req.headers;
  // check if there are name and password in request header
  if (name && password) {
    const user = {
      name,
      password
    };
    await fetch("https://hahow-recruit.herokuapp.com/auth", {
      method: "POST",
      body: JSON.stringify(user),
      headers: { "Content-Type": "application/json" }
    })
      .then((reply) => {
      // authorized member
        if (reply.status === 200) {
          req.headers.member = true;
        } else {
        // provided invalid name or password;
          req.headers.member = false;
        }
      });
    next();
  } else {
    // not a member
    req.headers.member = false;
    next();
  }
}

async function insertApiData () {
  await fetch("https://hahow-recruit.herokuapp.com/heroes", {
    method: "GET"
  })
    .then(async (res) => {
      const data = await res.json();
      // insert into mysql
      const heroesData = [];
      const apiHeroIdArr = [];
      const today = new Date();
      const date = today.toISOString().substring(0, 10);
      for (const i in data) {
        const heroData = [];
        heroData.push(data[i].id);
        heroData.push(data[i].name);
        heroData.push(data[i].image);
        heroData.push(date);
        heroesData.push(heroData);
        // for profile api
        apiHeroIdArr.push(data[i].id);
      }
      // iterate apiHeroIdArr and get profile for each hero
      const heroProfiles = await getHerosProfile(apiHeroIdArr);
      await insertHeroes(heroesData, heroProfiles);
    })
    .catch((err) => {
      console.log(err);
    });
}

async function getHerosProfile (arr) {
  const today = new Date();
  const date = today.toISOString().substring(0, 10);
  const heroProfiles = [];
  for (const i in arr) {
    const heroProfile = [];
    heroProfile.push(arr[i]);
    await fetch(`https://hahow-recruit.herokuapp.com/heroes/${arr[i]}/profile`, {
      method: "GET"
    })
      .then(async (res) => {
        const profileData = await res.json();
        heroProfile.push(profileData.str);
        heroProfile.push(profileData.int);
        heroProfile.push(profileData.agi);
        heroProfile.push(profileData.luk);
        heroProfile.push(date);
        heroProfiles.push(heroProfile);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  return heroProfiles;
}

module.exports = {
  verifyMember,
  insertApiData
};
