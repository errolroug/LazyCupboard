// REQUIRE MODELS FOLDER WHICH CONTAIN TABLE MODELS
var db = require("../models");

// REQUIRE AXIOS FOR API CALL - Need to remove this later once API call is saved in a separate file
var axios = require("axios");

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
    var food = req.body.ingredient;
    var queryID = "80dab669";
    var queryKey = "bf81be851f5f242c3a6279af40337e79";

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
          res.status(500).send("Ingredients Internal Server Error");
          console.log("Ingredients - NO RESULTS FOUND");
        }
      });
  });

  // GET RECIPES FROM API USING USER SELECTED INGREDIENTS
  // app.get("/api/recipes/", function(req, res) {
  //   db.Recipes.findAll({}).then(function(dbRecipe) {
  //     res.json(dbRecipe);
  //   });
  // });

  app.get("/api/recipes/:id", function(req, res) {
    db.Recipes.findOne({
      where: {
        id: req.params.id
      }
    }).then(function(dbRecipe) {
      res.json(dbRecipe);
    });
  });

  app.post("/api/recipesAPI", function(req, res) {
    var food = req.body.ingredient;
    console.log("this is the ingredient" + food);
    var queryID = "fcb72d93";
    var queryKey = "f10388ab91215f04c2c1a28330336b8d";
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
        var hits = response.data.hits;
        var recipesArray = [];
        for (let index = 0; index < hits.length; index++) {
          var recipes = [];
          recipes.push(hits[index].recipe.label);
          recipes.push(hits[index].recipe.calories);
          recipes.push(hits[index].recipe.dietLabels);
          recipes.push(hits[index].recipe.ingredientLines);
          recipesArray.push(recipes);
        }
        res.json(recipesArray);
      })
      .catch(function(error) {
        if (error) {
          console.log(error);
          res.status(500).send("Recipes Internal Server Error");
          console.log("Recipes - NO RESULTS FOUND");
        }
      });
  });

  //COMMENTING THIS OUT FOR NOW_________________________________________________________
  // Will add back to the file once the first get request works
  // // Delete an example by id
  // app.delete("/api/examples/:id", function(req, res) {
  //   db.Example.destroy({ where: { id: req.params.id } }).then(function(dbExample) {
  //     res.json(dbExample);
  //   });
  // });
};
