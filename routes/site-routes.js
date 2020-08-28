//jshint esversion:6

const express = require("express");
const router = express.Router();
const siteController = require("./../controllers/site-controller");

//Protecting RESTRICTED Pages
const {ensureAuthenticated_1, ensureAuthenticated_2} = require("./../config/auth");

router
.route("/")
.get(siteController.getHomePage);

router
.route("/account")
.get(ensureAuthenticated_1, siteController.getAccountPage);

router
.route("/account/register")
.get(siteController.getRegisterPage)
.post(siteController.createAccount);

router
.route("/account/login")
.get(siteController.getLoginPage)
.post(siteController.accountLogin);

router
.route("/account/details")
.get(ensureAuthenticated_2, siteController.getAccountDetailsPage)
.post(siteController.updateAccountDetails);

router
.route("/account/details/login")
.get(siteController.getAccountDetailsLoginPage)
.post(siteController.accountDetailsLoginPage);

router
.route("/account/logout")
.get(siteController.accountLogout);

router
.route("/account/delete")
.get(siteController.accountDelete);

module.exports = router;
