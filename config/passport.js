/* eslint-disable prettier/prettier */
const LocalStrategy = require("passport-local");
const passport = require("passport");
const db = require("../models/index");

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passReqToCallback: true
    },
    (req, username, password, done) => {

      var criteria = (username.indexOf("@") === -1) ? { username: username } : { email: username };
      //check if user is in db
      db.User.findOne({ where: criteria }).then(user => {

        if (!user) {
          console.log("User not found");

          return done(null, false, { message: "No user found" });
        }
        // match password
        else if (!user.validPassword(password)) {
          console.log("Not user valid password");

          return done(null, false, {
            message: "Incorrest Password"
          });
        }
        return done(null, user);
      });
    }
  )
);

//Serialize will basically stored the user ID to session
passport.serializeUser(function (user, done) {
  done(null, user.dataValues.id);
});


//Deserialize will then grab the ID stored in session and get the user info when needed
passport.deserializeUser(function (id, done) {
  db.User.findById(id).then(function (user) {
    if (user) {
      done(null, user.get());
    } else {
      done(user.errors, null);

    }

  });

});

module.exports = passport;
