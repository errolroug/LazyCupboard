var db = require("../models");
const { ensureAuthenticated } = require("../controllers/authController");
const startOfToday = require("date-fns/start_of_today");
const getRecipebyURI = require("../controllers/recipeIngredientsAPIscript");
const { Op } = require('sequelize')

module.exports = function (app) {
  // Load index page
  app.get("/", (req, res) => {
    res.render("homepage");
  });

  app.get("/LazyCupboard", ensureAuthenticated, function (req, res) {
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
    db.Recipe.findOne({
      where: {
        id: req.params.id
      },
      include: [db.RecipeIngredient]
    }).then(function (recipetoSend) {
      res.render("recipe", recipetoSend);
    });
  });

  app.get("/myrecipes", ensureAuthenticated, function (req, res) {
    console.log(startOfToday());
    db.Recipe.findAll({
      where: {
        UserId: req.user.id,
        saved: true,
        createdAt: { [Op.gt]: startOfToday() }
      },
      include: [db.RecipeIngredient]
    }).then(function (recipeList) {
      let responsetobeSent = { recipeList };
      res.render("myrecipes", responsetobeSent);
    });
  });

  // Render 404 page for any unmatched routes
  app.get("*", function (req, res) {
    res.render("404");
  });
};
