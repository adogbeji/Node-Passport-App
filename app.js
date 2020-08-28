//jshint esversion:6

const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocal = require("passport-local");
const bcrypt = require("bcryptjs");
const saltRounds = 8;
const flash = require("connect-flash");

//Protecting RESTRICTED Pages
const {ensureAuthenticated_1, ensureAuthenticated_2} = require("./config/auth");
const siteRouter = require("./routes/site-routes");


const app = express();
app.set("view engine", "ejs");

//Middleware

app.use(express.urlencoded({extended: true}));
app.use(express.static(`${__dirname}/public`));
app.use("/account", express.static(`${__dirname}/public`));
app.use("/account/details", express.static(`${__dirname}/public`));

//Express-Session
app.use(session({
  secret: "JavaScript",
  resave: true,
  saveUninitialized: true
}));

//Passport
app.use(passport.initialize());
app.use(passport.session());

//Connect Flash
app.use(flash());

//Global Variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

//Passport Config
require("./config/passport")(passport);

//DB Config
const db = require("./config/keys").MongoURI;

mongoose.connect(db, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
  console.log("MongoDB Connected!");
})
.catch(err => {
  console.log(err);
});

const User = require("./models/user");

app.use("/", siteRouter);

module.exports = app;
