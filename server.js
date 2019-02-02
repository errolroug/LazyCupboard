require("dotenv").config();
var express = require("express");
var exphbs = require("express-handlebars");

var db = require("./models");
const passport = require("passport");
var app = express();
var PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));
app.use(require("body-parser").urlencoded({ extended: true }));
app.use(
  require("express-session")({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true
  })
);
require("./config/passport");
app.use(passport.initialize());
app.use(passport.session());

//this are Global Variables. The one for the user needs to be explicit right after
//the middleware of session and before any route is called:
app.use(function(req, res, next) {
  // res.locals.sucess_msg = req.flash("success_msg");
  // res.locals.error_msg = req.flash("error_msg");

  //this MUST be declared before any route otherwise the user won't be send to the front end
  res.locals.user = req.user || null;
  next();
});

// Handlebars
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

// Routes
require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);

var syncOptions = { force: false };

// If running a test, set syncOptions.force to true
// clearing the `testdb`
if (process.env.NODE_ENV === "test") {
  syncOptions.force = true;
}

// Starting the server, syncing our models ------------------------------------/
db.sequelize.sync(syncOptions).then(function() {
  app.listen(PORT, function() {
    console.log(
      "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
      PORT,
      PORT
    );
  });
});

module.exports = app;
