//jshint esversion:6

exports.getHomePage = (req, res) => {
  res.render("home");
};

exports.getAccountPage = (req, res) => {
  const clientName = req.user.name;
  res.render("account", {name: clientName});
};

exports.getRegisterPage = (req, res) => {
  res.render("register");
};

exports.getLoginPage = (req, res) => {
  res.render("login");
};

exports.getAccountDetailsPage = (req, res) => {
  res.render("update");
};

exports.getAccountDetailsLoginPage = (req, res) => {
  res.render("account-details-login");
};

exports.accountLogout = (req, res) => {
  req.logout();
  req.flash('success_msg', "You have now logged out!");
  res.redirect("/account/login");
};

exports.accountDelete = (req, res) => {
  let errors = [];

  User.deleteOne({name: req.user.name})
  .then(noAccount => {
    if (noAccount) {
      req.flash("success_msg", "You account has now been closed!");
      res.redirect("/account/register");
    }
  })
  .catch(err => {
    errors.push({
      message: "An error occurred, please try again!"
    });
  });
};

exports.createAccount = (req, res) => {
  const {name, email, password, password2} = req.body;
  let errors = [];

  //Check required fields
  if (!name || !email || !password || !password2) {
    errors.push({
      message: "Please fill out all the fields!"
    });
  }

  //Check that passwords match
  if (password !== password2) {
    errors.push({
      message: "Passwords don't match!"
    });
  }

  //Check password length
  if (password.length < 6) {
    errors.push({
      message: "Password should be AT LEAST 6 characters!"
    });
  }

  //Page will be re-rendered if any validaton checks fail
  if (errors.length > 0) {
    res.render("register", {
      errors, name, email, password, password2
    });
  } else {
    //Validation passed
    User.findOne({email: email})
    .then(user => {
      //If user exists
      if (user) {
        errors.push({message: "That email is already registered!"});
        res.render("register", {
          name, email, password, password2
        });
      } else {
        //If user doesn't exist, create new one & ENCRYPT password!
        const newUser = new User({
          name,
          email,
          password
        });

        //Hash password
        bcrypt.genSalt(saltRounds, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        //Set password to Hash
        newUser.password = hash;
        //Save new user
        newUser.save()
        .then(user => {
          req.flash('success_msg', "You have now been registered!");
          res.redirect("/account/login");
        });
     });
   });
      }
    })
    .catch(err => {
      errors.push({message: "An error occurred, please try again!"});
      res.render("register", {
        name, email, password, password2
      });
    });
  }
};

exports.accountLogin = (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/account",
    failureRedirect: "/account/login",
    failureFlash: true
  })(req, res, next);
};

exports.updateAccountDetails = (req, res) => {
  const {name, email, password} = req.body;
  let errors = [];
  let success = [];

  //Check for missing fields
  if (!name && !email && !password) {
    errors.push({
      message: "Please update at least ONE field below!"
    });
  }

  //Page will be re-rendered if validation fails
  if (errors.length > 0) {
    res.render("update", {errors});
  }

  // Check for completed fields
  if (name !== "" && email !== "" && password !== "") {
    User.updateMany({name: req.user.name}, {$set: {name: req.body.name, email: req.body.email, password: req.body.password}})
    .then(update => {
      if (update) {
        success.push({
          message: "Your details have been updated!"
        });
        res.render("update", {success, name, email});
      }
    })
    .catch(err => {
      errors.push({
        message: "An error occurred, please try again!"
      });
      res.render("update", {errors});
    });
  }

  // Check for Name & Email
  if (name !== "" && email !== "") {
    User.updateMany({name: req.user.name}, {$set: {name: req.body.name, email: req.body.email}})
    .then(update => {
      if (update) {
        success.push({
          message: "Name and Email have been updated!"
        });
        res.render("update", {success, name, email});
      }
    })
    .catch(err => {
      errors.push({
        message: "An error occurred, please try again!"
      });
      res.render("update", {errors});
    });
  }

  // Check for Name & Password
  if (name !== "" && password !== "") {
    User.updateMany({name: req.user.name}, {$set: {name: req.body.name, password: req.body.password}})
    .then(update => {
      if (update) {
        success.push({
          message: "Name and Password have been updated!"
        });
        res.render("update", {success, name});
      }
    })
    .catch(err => {
      errors.push({
        message: "An error occurred, please try again!"
      });
      res.render("update", {errors});
    });
  }

  // Check for Password & Email
  if (email !== "" && password !== "") {
    User.updateMany({email: req.user.email}, {$set: {email: req.body.email, password: req.body.password}})
    .then(update => {
      if (update) {
        success.push({
          message: "Email and Password have been updated!"
        });
        res.render("update", {success, name});
      }
    })
    .catch(err => {
      errors.push({
        message: "An error occurred, please try again!"
      });
      res.render("update", {errors});
    });
  }

  // Check for Name
  if (name !== "") {
    User.updateOne({name: req.user.name}, {$set: {name: req.body.name}})
    .then(update => {
      if (update) {
        success.push({
          message: "Your name has been updated!"
        });
        res.render("update", {success, name});
      }
    })
    .catch(err => {
      errors.push({
        message: "An error occurred, please try again!"
      });
      res.render("update", {errors});
    });
  }


  // Check for Email
  if (email !== "") {
    User.updateOne({email: req.user.email}, {$set: {email: req.body.email}})
    .then(update => {
      if (update) {
        success.push({
          message: "Your email has been updated!"
        });
        res.render("update", {success, email});
      }
    })
    .catch(err => {
      errors.push({
        message: "An error occurred, please try agan!"
      });
      res.render("update", {errors});
    });
  }

  if (password !== "") {

    //Check password length
  if (password.length < 6) {
    errors.push({
      message: "Password should be AT LEAST 6 characters!"
    });
  }

  //Page will be re-rendered if any validaton checks fail
  if (errors.length > 0) {
    res.render("update", {
      errors, name, email, password
    });
  } else {
    // Validaton passed
    bcrypt.genSalt(saltRounds, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
      if (err) throw err;
      //Set existing password to Hash
      req.user.password = hash;
      //Save new password
      req.user.save()
      .then(password => {
        success.push({
          message: "Your password has been reset!"
        });
        res.render("update", {success});
      })
      .catch(err => {
        errors.push({
          message: "An error occurred, please try again!"
        });
        res.render("update", {errors});
      });
    });
   });
  }
 }
};

exports.accountDetailsLoginPage = (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/account/details",
    failureRedirect: "/account/details/login",
    failureFlash: true
  })(req, res, next);
};
