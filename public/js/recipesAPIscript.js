// REQUIRE MODELS FOLDER WHICH CONTAIN TABLE MODELS
var db = require("../../models");

// REQUIRE AXIOS FOR API CALL
var axios = require("axios");

module.exports = function getRecipesInfo(req, res) {
  var food = req.body.ingredient;
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
};
