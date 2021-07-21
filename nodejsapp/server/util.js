const fetch = require('node-fetch');
const redis = require("redis");
// const client = redis.createClient({
//   port:6379,
//   host:'redis'
// });
const client = redis.createClient('6379');

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

module.exports = {
  verifyMember,
  getCache
};