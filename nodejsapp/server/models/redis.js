const redis = require("redis");
const client = redis.createClient({
  port: 6379,
  host: "redis"
});

function getCache (key) {
  return new Promise((resolve, reject) => {
    client.get(key, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
}

module.exports = {
  getCache,
  client
};
