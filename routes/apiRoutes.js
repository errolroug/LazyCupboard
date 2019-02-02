// REQUIRE MODELS FOLDER WHICH CONTAIN TABLE MODELS
var db = require("../models");

// REQUIRE AXIOS FOR API CALL - Need to remove this later once API call is saved in a separate file
var axios = require("axios");
var db = require("../models");
const bcrypt = require("bcryptjs");
const passport = require("../config/passport");

module.exports = function(app) {
  // GET ALL INGREDIENTS SAVED TO THE 'INGREDIENTS' TABLE
  // See all ingredients in json format via the browser by using the site url + the route specified in the GET request below.

  app.get("/api/ingredients/", function(req, res) {
    db.Ingredients.findAll({
      //1. Go to the models folder, use the Ingredients table and find all data
      include: [db.Measurements] //2. Join the Measurements table to the Ingredients table
    }).then(function(dbIngredient) {
      res.json(dbIngredient); //3. Send all info from 1 & 3 in a json response
    });
  });

  // GET A SINGLE INGREDIENT SAVED TO THE 'INGREDIENTS' TABLE
  // See a single ingredient in json format vai the browser by using the site url + the route specified in the GET request below.

  app.get("/api/ingredients/:id", function(req, res) {
    db.Ingredients.findOne({
      //1. Go to the models folder, use the Ingredients table and find one record
      where: {
        id: req.params.id //2. Record must match the id specified by the user in the url of the GET request
      },
      include: [db.Measurements]
    }).then(function(dbIngredient) {
      //3. Join the Measurements table to the Ingredients table
      res.json(dbIngredient); //4. Send all info from 1 & 3 in a json response
    });
  });

  // POST INGREDIENT TO 'INGREDIENT' TABLE
  // You do not render data in a browser using a POST request, this route is only being used to send info to the db.
  // To view the data in the db, use the GET request for ingredients above.

  app.post("/api/ingredientsAPI", function(req, res) {
    var food = req.body.ingredient; //1. Save ingredient entered by user into the 'food' variable
    var queryID = "80dab669"; //2. Save ID for API call, NOTE: This ID is exclusively used for individual food item lookup
    var queryKey = "bf81be851f5f242c3a6279af40337e79"; //3. Save API key, NOTE: This key is exclusively used for individual food item lookup

    // Run a request with axios to the Edamam API with the food item specified by var food
    //NOTE: You can add additional parameters to this request, see documentation
    var queryUrl =
      "https://api.edamam.com/api/food-database/parser?app_id=" +
      queryID +
      "&app_key=" +
      queryKey +
      "&ingr=" +
      food;

    axios
      .get(queryUrl)
      .then(function(response) {
        var foodLabel = response.data.parsed[0].food.label;
        var foodLabelName = foodLabel.split(",");
        var foodCalories = response.data.parsed[0].food.nutrients.ENERC_KCAL;
        var foodProtein = response.data.parsed[0].food.nutrients.PROCNT;
        var foodFat = response.data.parsed[0].food.nutrients.FAT;
        var foodCarbs = response.data.parsed[0].food.nutrients.CHOCDF;

        //Create ingredient object to store the data being returned by the API call
        ingredient = {
          name: foodLabelName[0],
          calories: foodCalories,
          protein: foodProtein,
          fat: foodFat,
          carbs: foodCarbs
        };

        //Use the models (located in the models folder) to create a model for ingredients
        db.Ingredients.create(ingredient)
          .then(function(newIngredient) {
            res.status(200).send("OK");
          })
          .catch(function(error) {
            if (error) {
              res.status(500).send("Internal Server Error");
              console.log("Ingredient Could not be inserted into DB");
            }
          });
      })
      .catch(function(error) {
        if (error) {
          res.status(500).send("Internal Server Error");
          console.log("NO RESULTS FOUND");
        }
      });
  });

  // GET RECIPES FROM API USING USER SELECTED INGREDIENTS
  app.post("/recipesAPI", function(req, res) {
    var food = "chicken"; //1. Save ingredients required for receipe search
    var queryID = "fcb72d93"; //2. Save ID for API call, NOTE: This ID is exclusively used for individual food item lookup
    var queryKey = "f10388ab91215f04c2c1a28330336b8d"; //3. Save API key, NOTE: This key is exclusively used for individual food item lookup

    // Then run a request with axios to the Edamam API with the movie specified
    //NOTE: You can add additional parameters to this request, see documentation
    var queryUrl =
      "https://api.edamam.com/search?q=" +
      food +
      "&app_id=" +
      queryID +
      "&app_key=" +
      queryKey;

    axios
      .get(queryUrl)
      .then(function(response) {
        for (let index = 0; index < response.data.hits.length; index++) {
          recipe = {
            name: response.data.hits[index].recipe.label,
            ingredients: response.data.hits[index].recipe.ingredientLines,
            nutrition: response.data.hits[index].recipe.totalNutrients
          };
        }
      })
      .catch(function(error) {
        if (error) {
          console.log("NO RESULTS FOUND");
        }
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
    req.logout();
    // req.flash('success_msg', 'you are logged out')
    res.redirect("/users/login");
  });

  //COMMENTING THIS OUT FOR NOW_________________________________________________________
  // Will add back to the file once the first get request works
  // Delete an example by id
  app.delete("/api/ingredient/:id", function(req, res) {
    db.Ingredients.destroy({ where: { id: req.params.id } }).then(function(
      dbIngredient
    ) {
      res.json(dbIngredient);
    });
  });
};
