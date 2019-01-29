var db = require("../models");
const bcrypt = require("bcryptjs");
const passport = require("passport");
//Load User Model

module.exports = function(app) {
  // Load index page
  app.get("/", function(req, res) {
    // db.Example.findAll({}).then(function(dbExamples) {
    res.render("index", {
      msg: "Welcome!",
      msg2: "Under Construction, please come back soon :)"
      // examples: dbExamples
    });
    // });
  });

  // Load example page and pass in an example by id
  app.get("/example/:id", function(req, res) {
    db.Example.findOne({ where: { id: req.params.id } }).then(function(
      dbExample
    ) {
      res.render("example", {
        example: dbExample
      });
    });
  });
  //User Register Route
  app.get("/users/register", function(req, res) {
    res.render("register");
  });
  //User Login Route
  app.get("/users/login", function(req, res) {
    res.render("login");
  });
  //login user route

  app.get("/users/login", (res, req, next) => {
    passport.authenticate("local", {
      successRedirect: "/index",
      failureRedirect: "/users/login",
      failureFlash: true
    })(res, req, next);
  });
  //Register form
  app.post("/users/register", (req, res) => {
    console.log(req.body);
    let errors = [];
    if (req.body.password !== req.body.password2) {
      errors.push({ text: "Passwords do not match" });
    }
    if (req.body.password.length < 6) {
      errors.push({ text: "Password must be at least 6 characters" });
    }
    if (errors.length > 0) {
      res.render("/users/register", {
        errors: errors,
        firstName: res.body.first_name,
        lastName: res.body.last_name,
        username: res.body.username,
        email: res.body.email,
        role: res.body.role,
        password: res.body.password,
        password2: res.body.password2
      });
    } else {
      console.log(req.body.email);

      db.User.find({ where: { email: req.body.email } }).then(user => {
        if (user) {
          console.log(user);
          console.log("Failing");
          req.flash("error_msg", "Email already registered");
          res.redirect("/users/login");
        } else {
          console.log("testing testing");
          const newUser = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            username: req.body.username,
            email: req.body.email,
            role: req.body.role,
            password: req.body.password
            // user: req.user.id
          };

          //using bcrypt to hash password values, then storing password values
          //into database, 10 is number of characters
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              //set new user password to hash value
              newUser.password = hash;

              db.User.create(newUser)
                // will then pass in new user
                .then(user => {
                  req.flash(
                    "success_msg",
                    "You are now registered and can login"
                  );
                  res.redirect("/users/login");
                })
                .catch(err => {
                  console.log(err);
                  return;
                });
            });
          });
        }
      });
    }
  });
  //Logout User
  app.get("/users/logout", (req, res) => {
    res.logout();
    req.flash("success_msg", "You are logged out");
    req.redirect("/users/login");
  });
  app // Render 404 page for any unmatched routes
    .get("*", function(req, res) {
      res.render("404");
    });
};
