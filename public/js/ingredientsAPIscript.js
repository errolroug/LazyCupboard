// REQUIRE MODELS FOLDER WHICH CONTAIN TABLE MODELS
var db = require("../../models");

// REQUIRE AXIOS FOR API CALL - Need to remove this later once API call is saved in a separate file
var axios = require("axios");

module.exports = function getIngredientInfo(req, res) {
    var food = "eggs";
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
        .then(function (response) {
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
                .then(function (newIngredient) {
                    res.status(200).send("OK");
                })
                .catch(function (error) {
                    if (error) {
                        res.status(500).send("Internal Server Error");
                        console.log("Ingredient Could not be inserted into DB");
                    }
                });
        })
        .catch(function (error) {
            if (error) {
                res.status(500).send("Internal Server Error");
                console.log("NO RESULTS FOUND");
            }
        });
};