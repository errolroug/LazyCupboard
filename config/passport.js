const LocalStrategy = require("passport-local");
const passport = require("passport");
const db = require("../models/index");

passport.use(
  new LocalStrategy(
    {
      usernameField: "email"
    },
    (email, password, done) => {
      //check if user is in db
      db.User.findOne({
        where: {
          email: email
        }
      }).then(user => {
        if (!user) {
          return done(null, false, { message: "No user found" });
        }
        // match password
        else if (!user.validPassword(password)) {
          return done(null, false, {
            message: "Incorrest Password"
          });
        }
        return done(null, true);
      });
    }
  )
);

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

module.exports = passport;
