var db = require("../models");
var axios = require("axios")

module.exports = function(app) {

    app.get("/api/ingredients", function(req, res) {
        db.Ingredients.findAll().then(function(dbIngredient) {
          res.json(dbIngredient);
        });
    });
  
  // Get individual ingredient nutritional value info via API call to Edamam
  app.post("/api/ingredientsAPI", function(req, res) {

    //console log what we are receiving from the front end
    console.log(req.body)

    // var html = "<h1>INGREDIENT API RESPONSE(S)</h1>";

    //insert ingredient into the variable:
    var food = req.body.ingredient;
    
    //NOTE: This ID is exclusively used for individual food item lookup
    var queryID = "80dab669";

    //NOTE: This key is exclusively used for individual food item lookup
    var queryKey = "bf81be851f5f242c3a6279af40337e79";

    // Run a request with axios to the Edamam API with the food item specified by var food
    //NOTE: You can add additional parameters to this request, see documentation 
    var queryUrl = "https://api.edamam.com/api/food-database/parser?app_id=" + queryID + "&app_key=" + queryKey + "&ingr=" + food;

    // This line is just to help us debug against the actual URL.
    // console.log(queryUrl);
    axios.get(queryUrl).then(
            function (response) {
              var ingredientArray = [];

              //Push API response to ingredient array  
              ingredientArray.push("Label: " + response.data.parsed[0].food.label);
              ingredientArray.push("Cal: " + response.data.parsed[0].food.nutrients.ENERC_KCAL);
              ingredientArray.push("Protein: " + response.data.parsed[0].food.nutrients.PROCNT);
              ingredientArray.push("Fat: " + response.data.parsed[0].food.nutrients.FAT);
              ingredientArray.push("Carbs: " + response.data.parsed[0].food.nutrients.CHOCDF);

              //Send ingredient array to browser
              res.json(ingredientArray);
            }
        )
        .catch(function (error) {
            if (error) {
                console.log("NO RESULTS FOUND")
            };
        });

        
  });


  // Get recipes and nutritional info via API call to Edamam
  app.post("/recipesAPI", function(req, res) {
            // Create an empty variable for holding the movie name
            var food = "chicken";
    
            //NOTE: This ID is exclusively used for individual food item lookup
            var queryID = "fcb72d93";
        
            //NOTE: This key is exclusively used for individual food item lookup
            var queryKey = "f10388ab91215f04c2c1a28330336b8d";
        
            // Then run a request with axios to the Edamam API with the movie specified
            //NOTE: You can add additional parameters to this request, see documentation 
            var queryUrl = "https://api.edamam.com/search?q=" + food + "&app_id=" + queryID + "&app_key=" + queryKey;
        
            // This line is just to help us debug against the actual URL.
            // console.log(queryUrl);
            axios.get(queryUrl).then(
                    function (response) {
                        // Recipes array
                        var recipeArray = [];
    
                        for (let index = 0; index < response.data.hits.length; index++) {
    
                            recipeArray.push(response.data.hits[index].recipe.label);
                            recipeArray.push(response.data.hits[index].recipe.ingredientLines);
                            recipeArray.push(response.data.hits[index].recipe.totalNutrients);
                        }
                        //Send API response to browser 
                        res.json(recipeArray);
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
