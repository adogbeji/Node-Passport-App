//jshint esversion:6

  exports.ensureAuthenticated_1 = function(req, res, next) {  // Account Page
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash("error_msg", "Please log in to view this page!");
    res.redirect("/account/login");
  };

  exports.ensureAuthenticated_2 = function(req, res, next) {  // Account Details Page
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash("error_msg", "Please log in to view this page!");
    res.redirect("/account/details/login");
  };
