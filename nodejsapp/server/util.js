const fetch = require('node-fetch');


async function verifyMember (req, res, next) {
  const {name, password}= req.headers;
  console.log(name);
  console.log(password);
  // check if there are name and password in request header
  if (name && password) {
    const user = {
      name,
      password
    };
    console.log(user);
    await fetch('https://hahow-recruit.herokuapp.com/auth',{
      method: "POST",
      body: JSON.stringify(user),
      headers: { "Content-Type": "application/json" }
    })
    .then((res)=>{
      // authorized member
      console.log(res.status)
      if (res.staus === 200) {
        req.headers.member = true;
        next();
      } else {
        // provide invalid name or password;
        req.headers.member = false;
      }
    })
  }
  //not a member
  req.headers.member = false;
  next();
}

module.exports = {
  verifyMember
};