var db = require("../models");

module.exports = function(app) {
  
  // Get individual ingredient nutritional value info via API call to Edamam
  app.get("/ingredientsAPI", function(req, res) {
    var html = "<h1>INGREDIENT API RESPONSE(S)</h1>";

    var food = "chicken";
    
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



  //COMMENTING THIS OUT FOR NOW_________________________________________________________
  // Will add back to the file once the first get request works
  
  
  // // Create a new example
  // app.post("/api/examples", function(req, res) {
  //   db.Example.create(req.body).then(function(dbExample) {
  //     res.json(dbExample);
  //   });
  // });

  // // Delete an example by id
  // app.delete("/api/examples/:id", function(req, res) {
  //   db.Example.destroy({ where: { id: req.params.id } }).then(function(dbExample) {
  //     res.json(dbExample);
  //   });
  // });
};
