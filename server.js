require("dotenv").config();
var express = require("express");
var exphbs = require("express-handlebars");
// const path = require("path");
var db = require("./models");
var app = express();
const passport = require("passport");
// const flash = require("connect-flash");
// const session = require("express-session");
var PORT = process.env.PORT || 3000;
// Passport config
require("./config/passport")(passport);

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));

// app.use(express.static(path.join(_dirname, "public")));
// Routes

// app.use(flash());
// app.use(passport.initialize());
// app.use(passport.session);
// Handlebars
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");
require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);
//express session middleware

app.set("trust proxy", 1); // trust first proxy
// app.use(
//   session({
//     secret: "secret",
//     resave: true,
//     saveUninitialized: true
//   })
// );

//Global variables
// app.use(function(req, res, next) {
//   // res.locals.sucess_msg = req.flash("success_msg");
//   // res.locals.error_msg = req.flash("error_msg");
//   res.locals.user = req.user || null;
//   next();
// });
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
