const test = async (req, res, next) => {
  try {
    res.send("hello")
  } catch (err) {
    next(err);
  }
};


module.exports = {
  test
};