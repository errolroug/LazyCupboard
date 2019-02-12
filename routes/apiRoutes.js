// REQUIRE MODELS FOLDER WHICH CONTAIN TABLE MODELS
var db = require("../models");

// REQUIRE INGREDIENTS API SCRIPT FILE
var ingredientsAPIscript = require("../controllers/ingredientsAPIscript");

// REQUIRE AXIOS FOR API CALL
var axios = require("axios");

// REQUIRE RECIPES API SCRIPT FILE
var recipesAPIscript = require("../controllers/recipesAPIscript");

const bcrypt = require("bcryptjs");
const passport = require("../config/passport");

const startOfToday = require("date-fns/start_of_today");
const { Op } = require("sequelize");

module.exports = function(app) {
  // GET ALL INGREDIENTS SAVED TO THE 'INGREDIENTS' TABLE
  // See all ingredients in json format via the browser by using the site url + the route specified in the GET request below.

  app.get("/api/ingredients", function(req, res) {
    let userID = process.env.NODE_ENV !== "test" ? req.user.id : 1;
    db.Ingredients.findAll({
      where: { UserId: userID }
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
      },
      include: [db.Measurements]
    }).then(function(dbIngredient) {
      res.json(dbIngredient);
    });
  });

  // POST INGREDIENT TO 'INGREDIENT' TABLE
  // You do not render data in a browser using a POST request, this route is only being used to send info to the db.
  // To view the data in the db, use the GET request for ingredients above.
  app.post("/api/ingredientsAPI", function(req, res) {
    //Variable that will save user ID
    var userID = req.user.id;
    //Variable that will store the ingredient name that will be passed to ingredientsAPIscript
    var ingredientName = req.body;
    //Variable that will tell ingredientsAPIscript what action to take once response is received
    var ingredientAction = "post_to_db";
    //Variable that saves the call back function needed by ingredientsAPIscript to perform the action needed
    var addIngredientNutrition = function(ingredient) {
      db.Ingredients.create(ingredient)
        .then(function(newIngredient) {
          res.json(newIngredient);
          // res.status(200).send("OK");
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
      userID,
      ingredientName,
      ingredientAction,
      addIngredientNutrition
    );
  });

  // GET RECIPES FROM API USING USER SELECTED INGREDIENTS
  app.post("/api/recipesAPI", function(req, res) {
    //Sequelize code that will capture all 'checked' ingredients in the db for the logged in user
    let userID = process.env.NODE_ENV !== "test" ? req.user.id : 1;
    db.Recipe.destroy({ where: { saved: false } });

    db.Ingredients.findAll({
      where: { checked: "checked", UserId: userID }
    }).then(function(ing) {
      //Variable to store the 'checked' ingredients, which will be sent to the API call
      var food = "";
      //For loop that will save the name of each 'checked' ingredient and append them together with a '+'
      for (var i = 0; i < ing.length; i++) {
        food = food + "+" + ing[i].dataValues.name;
      }
      //Log what's being saved in the 'food' variable after for loop
      console.log("In API Route: " + food);

      //Variable that hold function for handling what comes back from API call
      var sendRecipes = function(response) {
        //Cannot use .catch -- replaced with if/else statement
        // console.log(response)
        if (response.length > 0) {
          var recipes = [];
          var counteri = 0;

          for (var i = 0; i < response.length; i++) {
            recipes.push({
              label: response[i].recipe.label,
              calories: Number(
                (
                  response[i].recipe.calories / response[i].recipe.yield
                ).toFixed(0)
              ),
              url: response[i].recipe.url,
              uri: response[i].recipe.uri,
              image: response[i].recipe.image,
              RecipeIngredients: response[i].recipe.ingredients,
              UserId: req.user.id
            });
            db.Recipe.create(recipes[i], {
              include: [db.RecipeIngredient]
            }).then(function(dbResponse) {
              counteri++;
              if (counteri === response.length) {
                db.Recipe.findAll({
                  include: [db.RecipeIngredient]
                }).then(function(responsetobeSent) {
                  res.json(responsetobeSent);
                });
              }
            });
          }
        } else {
          res.status(500).send("Recipes Internal Server Error");
          console.log("Recipes - NO RESULTS FOUND");
        }
      };
      //Calling the recipessAPIscript module.export function getRecipesInfo and passing it the parameters needed
      recipesAPIscript.getRecipesInfo(food, sendRecipes);
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
    if (req.user) {
      res.redirect("/");
    }
    passport.authenticate("local", {
      successRedirect: "/LazyCupboard",
      failureRedirect: "register"
      // failureFlash: true
    })(res, req, next);
  });
  //once logged in
  app.post(
    "/users/login",
    passport.authenticate("local", {
      successRedirect: "/LazyCupboard",
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
    req.logout();
    // req.flash('success_msg', 'you are logged out')
    res.redirect("/");
  });
  //Below is our get request to find the user information page. So far it is returned as json and not as html
  app.get("/api/user", function(req, res) {
    let thisUser = process.env.NODE_ENV !== "test" ? req.user.id : 1;
    db.User.find({
      //1. Go to the models folder, use the Users table and find all data for current user
      where: { id: thisUser }
    }).then(function(dbUser) {
      //return the data to the browser as json
      res.send(dbUser);
    });
  });
  //COMMENTING THIS OUT FOR NOW_________________________________________________________
  //This is suppposed to create an update form for the user to change their information

  // app.put("api/user", function(req,res){
  //     let thisUser = process.env.NODE_ENV !== "test" ? req.user.id : 1;
  //     db.User.update({});
  //   })

  // Delete an example by id
  app.delete("/api/ingredient/:id", function(req, res) {
    db.Ingredients.destroy({ where: { id: req.params.id } }).then(function(
      dbIngredient
    ) {
      res.json(dbIngredient);
    });
  });
  app.put("/api/ingredientToRecipe", function(req, res) {
    if (req.body.checked === "true") {
      db.Ingredients.update(
        {
          checked: "checked"
        },
        {
          where: {
            id: req.body.id
          }
        }
      ).then(function() {
        res.status(200).send("OK");
      });
    } else {
      db.Ingredients.update(
        {
          checked: ""
        },
        {
          where: {
            id: req.body.id
          }
        }
      ).then(function() {
        res.status(200).send("OK");
      });
    }
  });
  app.put("/api/saveRecipe", function(req, res) {
    db.Recipe.update(
      {
        saved: true
      },
      {
        where: {
          id: req.body.id
        }
      }
    ).then(function(response) {
      res.status(200).send(req.body.id);
    });
  });
  app.get("/api/readme.json", function(req, res) {
    console.log("connection working");
    db.Recipe.findAll({
      where: {
        UserId: req.user.id,
        saved: true,
        createdAt: { [Op.gt]: startOfToday() }
      }
    })
      .then(function(responseArray) {
        var result = {
          name: "flare",
          children: [
            {
              name: "Total Calories",
              children: []
            }
          ]
        };
        for (var i = 0; i < responseArray.length; i++) {
          result.children[0].children.push({
            name: responseArray[i].label,
            size: responseArray[i].calories
          });
        }
        console.log(result);
        res.json(result);
      })
      .catch(err => {
        // console.log(err);
        return;
      });
  });
  app.delete("/api/myrecipes/:id", function(req, res) {
    console.log(req.body.id);
    db.Recipe.destroy({ where: { id: req.params.id } }).then(function(
      response
    ) {
      res.json(response);
    });
  });
};
