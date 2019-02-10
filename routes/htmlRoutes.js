var db = require("../models");
const { ensureAuthenticated } = require("../controllers/authController");

module.exports = function(app) {
  // Load index page
  app.get("/", (req, res) => {
    res.render("homepage");
  });

  app.get("/LazyCupboard", ensureAuthenticated, function(req, res) {
    //TODO : Move below findAll to a function "displayIngredients"
    db.Ingredients.findAll({
      where: { UserId: req.user.id }
    }).then(function(dbIngredient, dbMeals) {
      // data returned is an array. Need to wrap it in an object to send to handlebars
      let hbIngredients = { dbIngredient };
      res.render("index", hbIngredients);
    });
  });

  // Load example page and pass in an example by id
  app.get("/ingredient/:id", function(req, res) {
    db.Ingredients.findOne({ where: { id: req.params.id } }).then(function(
      dbExample
    ) {
      res.render("example", {
        example: dbExample
      });
    });
  });

  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404");
  });
};
