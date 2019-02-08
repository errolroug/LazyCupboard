// REQUIRE MODELS FOLDER WHICH CONTAIN TABLE MODELS
var db = require("../models");

// REQUIRE AXIOS FOR API CALL - Need to remove this later once API call is saved in a separate file
var axios = require("axios");

// REQUIRE INGREDIENTS API SCRIPT FILE
var ingredientsAPIscript = require("../public/js/ingredientsAPIscript");

// REQUIRE RECIPES API SCRIPT FILE
var recipesAPIscript = require("../public/js/recipesAPIscript");

var db = require("../models");
const bcrypt = require("bcryptjs");
const passport = require("../config/passport");

module.exports = function(app) {
  // GET ALL INGREDIENTS SAVED TO THE 'INGREDIENTS' TABLE
  // See all ingredients in json format via the browser by using the site url + the route specified in the GET request below.

  app.get("/api/ingredients/", function(req, res) {
    db.Ingredients.findAll({
      // include: [db.Measurements]
    }).then(function(dbIngredient) {
      res.json(dbIngredient);
    });
  });

  // GET A SINGLE INGREDIENT SAVED TO THE 'INGREDIENTS' TABLE
  // See a single ingredient in json format vai the browser by using the site url + the route specified in the GET request below.

  app.get("/api/ingredients/:id", function(req, res) {
    db.Ingredients.findOne({
      where: {
        id: req.params.id
      }
      // include: [db.Measurements]
    }).then(function(dbIngredient) {
      res.json(dbIngredient);
    });
  });

  // POST INGREDIENT TO 'INGREDIENT' TABLE
  // You do not render data in a browser using a POST request, this route is only being used to send info to the db.
  // To view the data in the db, use the GET request for ingredients above.
  app.post("/api/ingredientsAPI", function(req, res) {
    //Variable that will store the ingredient name that will be passed to ingredientsAPIscript
    var ingredientName = req.body;
    //Variable that will tell ingredientsAPIscript what action to take once response is received
    var ingredientAction = "post_to_db";
    //Variable that saves the call back function needed by ingredientsAPIscript to perform the action needed
    var addIngredientNutrition = function(ingredient) {
      db.Ingredients.create(ingredient)
        .then(function(newIngredient) {
          res.json(newIngredient);
        })
        .catch(function(error) {
          if (error) {
            res.status(500).send(error);
            console.log(error);
          }
        });
    };

    //Calling the ingredientsAPIscript module.export function getIngredientInfo and passing it the parameters needed
    ingredientsAPIscript.getIngredientInfo(
      ingredientName,
      ingredientAction,
      addIngredientNutrition
    );
  });

  // GET RECIPES FROM API USING USER SELECTED INGREDIENTS
  app.post("/recipesAPI", recipesAPIscript);

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
      errors.push({
        text: "Passwords do not match"
      });
    }
    if (req.body.password.length < 6) {
      errors.push({
        text: "Password must be at least 6 characters"
      });
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

      db.User.find({
        where: {
          email: req.body.email
        }
      }).then(user => {
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
    req.logout();
    // req.flash('success_msg', 'you are logged out')
    res.redirect("/users/login");
  });

  //COMMENTING THIS OUT FOR NOW_________________________________________________________
  // Will add back to the file once the first get request works
  // Delete an example by id
  app.delete("/api/ingredient/:id", function(req, res) {
    db.Ingredients.destroy({
      where: {
        id: req.params.id
      }
    }).then(function(dbIngredient) {
      res.json(dbIngredient);
    });
  });
};
