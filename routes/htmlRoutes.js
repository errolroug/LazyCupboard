var db = require("../models");
const bcrypt = require("bcryptjs");
const passport = require("../config/passport");

module.exports = function(app) {
  // Load index page
  app.get("/", function(req, res) {
    db.Ingredients.findAll().then(function(dbIngredient, dbMeals) {
      // data returned is an array. Need to wrap it in an object to send to handlebars
      let hbIngredients = { dbIngredient };
      res.render("index", hbIngredients);
    });
  });

  // Load example page and pass in an example by id
  app.get("/ingredient/:id", function(req, res) {
    db.Ingredients.findOne({ where: { id: req.params.id } }).then(function(
      dbExample
    ) {
      res.render("example", {
        example: dbExample
      });
    });
  });

  app.get("/users/register", function(req, res) {
    res.render("register");
  });

  app.get("/users/login", function(req, res) {
    res.render("login");
  });
  //login user route

  app.get("/users/login", (res, req, next) => {
    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "register"
      // failureFlash: true
    })(res, req, next);
  });
  //once logged in
  app.post(
    "/users/login",
    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "register"
      // failureFlash: true
    })
  );
  //Register form
  app.post("/users/register", (req, res) => {
    // console.log(req.body);
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
          // console.log(user);
          // console.log("Failing");
          // req.flash("error_msg", "Email already registered");
          res.redirect("/users/login");
        } else {
          // console.log("testing testing");
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
              if (err) {
                throw err;
              }
              //set new user password to hash value
              newUser.password = hash;

              db.User.create(newUser)
                // will then pass in new user
                .then(user => {
                  // req.flash(
                  //   "success_msg",
                  //   "You are now registered and can login"
                  // );
                })
                .catch(err => {
                  // console.log(err);
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
    // req.flash("success_msg", "You are logged out");
    req.redirect("/users/login");
  });
  app // Render 404 page for any unmatched routes
    .get("*", function(req, res) {
      res.render("404");
    });

  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404");
  });
};
