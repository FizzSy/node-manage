const express = require("express");
const app = express();
const mongoose = require("mongoose");
const db = require("./config/key.js").mongooseURI;
const routes = require("./routes");
const bodyParser = require("body-parser");
const passport = require("passport");
const passportConfig = require("./config/passport");

app.use(bodyParser.urlencoded({ extended: true })); //解析body参数
app.use(bodyParser.json());

mongoose
  .connect(db)
  .then(() => {
    console.log("MongoDb is connected");
  })
  .catch(err => {
    console.log(err);
  });

//初始化passport
app.use(passport.initialize());
// passportConfig(passport);
passportConfig(passport);
app.use("/manage", routes);

const port = process.env.PORT || 1002;

app.listen(port, () => {
  console.log("serve is running", port);
});
