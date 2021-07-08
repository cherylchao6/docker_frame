require('dotenv').config();
const {PORT_TEST, PORT, NODE_ENV} = process.env;
const port = NODE_ENV == 'test' ? PORT_TEST : PORT;

// Express Initialization
const express = require('express');
const app = express();

app.set('json spaces', 2);

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// Routes:
app.use(require("./server/routes/test_route.js"));
// Page not found
app.use(function(req, res, next) {
  res.status(404).send('No this page');;
});

// Error handling
app.use(function(err, req, res, next) {
  console.log(err);
  res.status(500).send('Internal Server Error');
});

if (NODE_ENV != 'production'){
  app.listen(port, () => {console.log(`Listening on port: ${port}`);});
}

module.exports = app;