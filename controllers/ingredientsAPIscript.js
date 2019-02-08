// REQUIRE MODELS FOLDER WHICH CONTAIN TABLE MODELS
var db = require("../models");

// REQUIRE AXIOS FOR API CALL
var axios = require("axios");

// REQUIRE API ROUTES FILE
var apiRoutes = require("../routes/apiRoutes");

//API call must be wrapped in a module.exports function to allow other files to access it
//Must also pass all required parameters to this function and assign them as variables within the {}
module.exports.getIngredientInfo = function(
  userID,
  ingredientName,
  ingredientAction,
  addIngredientNutrition
) {
  //The ingredientName being passed to this file can only be passed as an object, so we must
  //create a variable to access the property we want in that object.
  var food = ingredientName.ingredient;

  //Query ID is required by the API - see documentation on Edamam site
  var queryID = "80dab669";

  //Query ID is required by the API - see documentation on Edamam site
  var queryKey = "bf81be851f5f242c3a6279af40337e79";

  //Run a request with axios to the Edamam API with the food item specified by var food
  //NOTE: You can add additional parameters to this request, see documentation
  var queryUrl =
    "https://api.edamam.com/api/food-database/parser?app_id=" +
    queryID +
    "&app_key=" +
    queryKey +
    "&ingr=" +
    food;
  axios.get(queryUrl).then(function(response) {
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
      carbs: foodCarbs,
      checked: "",
      UserId: userID
    };

    var ingredientNutrition = ingredient;
    var action = ingredientAction;

    if (action === "post_to_db") {
      addIngredientNutrition(ingredientNutrition);
    }

    // if (action === "check_db") {
    //   addIngredientNutrition(ingredientNutrition);
    // }
  });
};
