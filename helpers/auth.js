module.exports = {
  ensureAuthenticated: function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    } else {
      req.flash("error_msq", "Not authorized");
      req.redirect("/users/login");
    }
  }
};
