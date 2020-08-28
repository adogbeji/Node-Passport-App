//jshint esversion:6

require("dotenv").config({path: "./config.env"});
const app = require("./app");

const port = process.env.PORT;

app.listen(port, (req, res) => {
  console.log(`Listening on port ${port}...`);
});
