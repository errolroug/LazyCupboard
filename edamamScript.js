// Store all of the arguments in an array
var nodeArgs = process.argv;

// Operation to execute
var operation = process.argv[2];

// Search term/phrase
var search = "";

// Include the axios npm package (Don't forget to run "npm install axios" in this folder first!)
var axios = require("axios");

// User's entry will be captured using this loop function and saved in the 'search' variable
function userEntry() {
    for (var i = 3; i < nodeArgs.length; i++) {

        if (i > 3 && i < nodeArgs.length) {
            search = search + "%20" + nodeArgs[i];
        } else {
            search += nodeArgs[i];

        }
    }

    //Test value saved in search
    // console.log(search);
}

userEntry();


// FIND NUTIRTIONAL FACTS FOR A SINGLE INGREDIENT________________________________________________________________________________
function findFood() {
    // Create an empty variable for holding the movie name
    var food = search;

    //NOTE: This ID is exclusively used for individual food item lookup
    var queryID = "80dab669";

    //NOTE: This key is exclusively used for individual food item lookup
    var queryKey = "bf81be851f5f242c3a6279af40337e79";

    // Then run a request with axios to the Edamam API with the movie specified
    //NOTE: You can add additional parameters to this request, see documentation 
    var queryUrl = "https://api.edamam.com/api/food-database/parser?app_id=" + queryID + "&app_key=" + queryKey + "&ingr=" + food;

    // This line is just to help us debug against the actual URL.
    // console.log(queryUrl);
    axios.get(queryUrl).then(
            function (response) {
                //Log query to test what's being sent
                console.log(queryUrl);
                //Log general nutrients
                //NOTE: You can add additional nutritional facts to this request (i.e. sodium, vitamins, sugar)
                //However, if the food iteam in the response does not have a property matching the parameter, it will be returned undefined
                //The properties included below seem to be available for all foods.
                console.log("\nNUTRITIONAL INGREDIENT FACTS:\n\nResult Description\n"+ response.data.parsed[0].food.label +
                    "\n\nCal " + response.data.parsed[0].food.nutrients.ENERC_KCAL +
                    "\nProtein " + response.data.parsed[0].food.nutrients.PROCNT +
                    "\nFat " + response.data.parsed[0].food.nutrients.FAT +
                    "\nCarbs " + response.data.parsed[0].food.nutrients.CHOCDF +
                    "\n\nSUGGESTED MEALS:");
                //Log recommended meals
                for (let index = 0; index < response.data.hints.length; index++) {
                    console.log(index + 1 + "." + response.data.hints[index].food.label);
                    // console.log(index + 1 + "." + response.data.hints[index].measures[3].uri);
                }

            }
        )
        .catch(function (error) {
            if (error) {
                console.log("NO RESULTS FOUND")
            };
        });
}

findFood();


// FIND NUTIRTIONAL FACTS FOR A SUGGESTED RECIPES________________________________________________________________________________
// function findRecipes() {
//     // Create an empty variable for holding the movie name
//     var food = search;

//     //NOTE: This ID is exclusively used for individual food item lookup
//     var queryID = "fcb72d93";

//     //NOTE: This key is exclusively used for individual food item lookup
//     var queryKey = "f10388ab91215f04c2c1a28330336b8d";

//     // Then run a request with axios to the Edamam API with the movie specified
//     //NOTE: You can add additional parameters to this request, see documentation 
//     var queryUrl = "https://api.edamam.com/search?q=" + food + "&app_id=" + queryID + "&app_key=" + queryKey;

//     // This line is just to help us debug against the actual URL.
//     // console.log(queryUrl);
//     axios.get(queryUrl).then(
//             function (response) {
//                 for (let index = 0; index < response.data.hits.length; index++) {
//                     console.log(response.data.hits[index].recipe.label);
//                 }
//             }
//         )
//         .catch(function (error) {
//             if (error) {
//                 console.log("NO RESULTS FOUND")
//             };
//         });
// }

// findRecipes();