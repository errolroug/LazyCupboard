var db = require("../models");
const { ensureAuthenticated } = require("../controllers/authController");
const startOfToday = require("date-fns/start_of_today");

module.exports = function (app) {
  // Load index page
  app.get("/", ensureAuthenticated, function (req, res) {
    //TODO : Move below findAll to a function "displayIngredients"
    db.Ingredients.findAll({
      where: { UserId: req.user.id }
    }).then(function (dbIngredient, dbMeals) {
      // data returned is an array. Need to wrap it in an object to send to handlebars
      let hbIngredients = { dbIngredient };
      res.render("index", hbIngredients);
    });
  });

  // Load example page and pass in an example by id
  app.get("/ingredient/:id", ensureAuthenticated, function (req, res) {
    db.Ingredients.findOne({ where: { id: req.params.id } }).then(function (
      dbExample
    ) {
      res.render("example", {
        example: dbExample
      });
    });
  });
  app.get("/recipe/:id", ensureAuthenticated, function (req, res) {
    db.Recipe.findOne({ where: { id: req.params.id } }).then(function (ans) {
      let recipetoSend = {
        label: ans.label,
        ingredients: [
          { ingredient: "test1" },
          { ingredient: "test2" },
          { ingredient: "test3" }
        ],
        image: ans.image,
        url: ans.url
      }
      console.log(recipetoSend)
      res.render("recipe", recipetoSend);
    });
  });

  app.get("/myrecipes", ensureAuthenticated, function (req, res) {
    console.log(startOfToday())
    db.Recipe.findAll({
      where: {
        UserId: req.user.id, saved: true,
        // createdAt:startOfToday()
      }
    }).then(function (recipeList) {
      let recipetoSend = { recipeList }
      // console.log(recipetoSend)
      res.render("myrecipes", recipetoSend);
    });
  });

  // Render 404 page for any unmatched routes
  app.get("*", function (req, res) {
    res.render("404");
  });
};
