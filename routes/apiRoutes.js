// REQUIRE MODELS FOLDER WHICH CONTAIN TABLE MODELS
var db = require("../models");

// REQUIRE AXIOS FOR API CALL - Need to remove this later once API call is saved in a separate file
var axios = require("axios")




module.exports = function (app) {

    // GET ALL INGREDIENTS SAVED TO THE 'INGREDIENTS' TABLE 
    // See all ingredients in json format via the browser by using the site url + the route specified in the GET request below. 

    app.get("/api/ingredients/", function (req, res) {
        db.Ingredients.findAll({ //1. Go to the models folder, use the Ingredients table and find all data
            include: [db.Measurements] //2. Join the Measurements table to the Ingredients table 
        }).then(function (dbIngredient) {
            res.json(dbIngredient); //3. Send all info from 1 & 3 in a json response
        });
    });



    // GET A SINGLE INGREDIENT SAVED TO THE 'INGREDIENTS' TABLE 
    // See a single ingredient in json format vai the browser by using the site url + the route specified in the GET request below. 

    app.get("/api/ingredients/:id", function (req, res) {
        db.Ingredients.findOne({ //1. Go to the models folder, use the Ingredients table and find one record 
            where: {
                id: req.params.id //2. Record must match the id specified by the user in the url of the GET request
            },
            include: [db.Measurements]
        }).then(function (dbIngredient) { //3. Join the Measurements table to the Ingredients table 
            res.json(dbIngredient); //4. Send all info from 1 & 3 in a json response
        });
    });



    // POST INGREDIENT TO 'INGREDIENT' TABLE
    // You do not render data in a browser using a POST request, this route is only being used to send info to the db.
    // To view the data in the db, use the GET request for ingredients above.

    app.post("/api/ingredientsAPI", function (req, res) {

        var food = req.body.ingredient; //1. Save ingredient entered by user into the 'food' variable
        var queryID = "80dab669"; //2. Save ID for API call, NOTE: This ID is exclusively used for individual food item lookup
        var queryKey = "bf81be851f5f242c3a6279af40337e79"; //3. Save API key, NOTE: This key is exclusively used for individual food item lookup

        // Run a request with axios to the Edamam API with the food item specified by var food
        //NOTE: You can add additional parameters to this request, see documentation 
        var queryUrl = "https://api.edamam.com/api/food-database/parser?app_id=" + queryID + "&app_key=" + queryKey + "&ingr=" + food;

        axios.get(queryUrl).then(
                function (response) {
                    var foodLabel = response.data.parsed[0].food.label;
                    var foodLabelName = foodLabel.split(",");
                    var foodCalories = response.data.parsed[0].food.nutrients.ENERC_KCAL;
                    var foodProtein = response.data.parsed[0].food.nutrients.PROCNT;
                    var foodFat = response.data.parsed[0].food.nutrients.FAT;
                    var foodCarbs = response.data.parsed[0].food.nutrients.CHOCDF

                    //Create ingredient object to store the data being returned by the API call
                    ingredient = {
                        name: foodLabelName[0],
                        calories: foodCalories,
                        protein: foodProtein,
                        fat: foodFat,
                        carbs: foodCarbs
                    }

                    //Use the models (located in the models folder) to create a model for ingredients
                    db.Ingredients.create(ingredient).then(function (newIngredient) {
                            res.status(200).send('OK')
                        })
                        .catch(function (error) {
                            if (error) {
                                res.status(500).send('Internal Server Error')
                                console.log("Ingredient Could not be inserted into DB")
                            };
                        });

                }
            )
            .catch(function (error) {
                if (error) {
                    res.status(500).send('Internal Server Error')
                    console.log("NO RESULTS FOUND")
                };
            });


    });


    // GET RECIPES FROM API USING USER SELECTED INGREDIENTS
    app.post("/recipesAPI", function (req, res) {
        var food = "chicken"; //1. Save ingredients required for receipe search                       
        var queryID = "fcb72d93"; //2. Save ID for API call, NOTE: This ID is exclusively used for individual food item lookup
        var queryKey = "f10388ab91215f04c2c1a28330336b8d"; //3. Save API key, NOTE: This key is exclusively used for individual food item lookup

        // Then run a request with axios to the Edamam API with the movie specified
        //NOTE: You can add additional parameters to this request, see documentation 
        var queryUrl = "https://api.edamam.com/search?q=" + food + "&app_id=" + queryID + "&app_key=" + queryKey;

        axios.get(queryUrl).then(
                function (response) {

                    for (let index = 0; index < response.data.hits.length; index++) {

                        recipe = {
                            name: response.data.hits[index].recipe.label,
                            ingredients: response.data.hits[index].recipe.ingredientLines,
                            nutrition: response.data.hits[index].recipe.totalNutrients
                        }
                    }
                }
            )
            .catch(function (error) {
                if (error) {
                    console.log("NO RESULTS FOUND")
                };
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