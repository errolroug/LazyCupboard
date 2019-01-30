var db = require("../models");

module.exports = function(app) {
  // Load index page
  app.get("/", function(req, res) {
        db.Ingredients.findAll()
        .then(function(dbIngredient) {
          // data returned is an array. Need to wrap it in an object to send to handlebars
          let hbIngredients = {dbIngredient};  
          res.render("index", hbIngredients)
        }); 
  });


  // Load example page and pass in an example by id
  app.get("/ingredient/:id", function(req, res) {
    db.Ingredients.findOne({ where: { id: req.params.id } }).then(function(dbExample) {
      res.render("example", {
        example: dbExample
      });
    });
  });

  app.get("/users/register", function(req, res) {
    res.render("register");
  });

  app.get("/users/login", function(req, res) {
    res.render("login");
  });

  
  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404");
  });


};


