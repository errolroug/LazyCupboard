var keys = require("../keys");

// REQUIRE MODELS FOLDER WHICH CONTAIN TABLE MODELS
var db = require("../models");

// REQUIRE AXIOS FOR API CALL
var axios = require("axios");

// REQUIRE API ROUTES FILE
var apiRoutes = require("../routes/apiRoutes");

//API call must be wrapped in a module.exports function to allow other files to access it
//Must also pass all required parameters to this function and assign them as variables within the {}

module.exports.getRecipesInfo = function(food, sendRecipes) {
  var food = food;
  // console.log("In API Call: " + food);
  var queryID = "fcb72d93";
  var queryKey = keys.edamam.recipes_key;
  var queryUrl =
    "https://api.edamam.com/search?q=" +
    food +
    "&app_id=" +
    queryID +
    "&app_key=" +
    queryKey;
  axios.get(queryUrl).then(function(response) {
    var recipes = response.data.hits;
    sendRecipes(recipes);
    // console.log(recipes);
  });
};
