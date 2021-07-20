// const redis = require("redis");
// const client = redis.createClient({
//   port:6379,
//   host:'redis'
// });
const test = async (req, res, next) => {
  try {
    let clientip = req.connection.remoteAddress
    client.get(clientip, function (err, value) {
      if (!value) {
        client.setex(clientip, 10, "1");
        return res.send(`visit my website 1 time`)
      }
      else {
        let valueToNumber = parseInt(value);
        valueToNumber += 1;
        client.setex(clientip, 10, `${valueToNumber}`);
        return res.send(`visit my website ${valueToNumber} times`)
      }
    });
  } catch (err) {
    next(err);
  }
};


module.exports = {
  test
};