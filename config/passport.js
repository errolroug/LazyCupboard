const LocalStrategy = require("passport-local");
const db = require("../models/index");
const bcrypt = require("bcryptjs");

//Load user model
const User = require("../models/User").User;

module.exports = function(passport) {
  passport.use(
    new LocalStrategy(
      { usernameField: "email", passReqToCallback: true },
      (email, password, done) => {
        //check if user is in db
        db.User.findOne({
          email: email
        }).then(user => {
          if (!user) {
            return done(null, false, { message: "No user found" });
          }
          //match password
          bcrypt.compare(password, User.password, (error, isMatch) => {
            if (error) throw error;
            if (isMatch) {
              // if user is returned password is matched
              return done(null, user);
            } else {
              return done(null, false, { message: "Incorrect Password" });
            }
          });
        });
      }
    )
  );
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    db.User.findById(id, function(err, user) {
      done(err, user);
    });
  });
};
