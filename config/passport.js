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
    (req, email, password, done) => {
      //check if user is in db
      db.User.findOne({
        where: {
          email: email
        }
      }).then(user => {

        if (!user) {
          console.log("User not found")

          return done(null, false, { message: "No user found" });
        }
        // match password
        else if (!user.validPassword(password)) {
          console.log("Not user valid password")

          return done(null, false, {
            message: "Incorrest Password"
          });
        }
       // console.log(user.dataValues.id)


        return done(null, user);
      });
    }
  )
);

passport.serializeUser(function(user, done) {
  done(null, user.dataValues.id); 
 // where is this user.id going? Are we supposed to access this anywhere?
});


passport.deserializeUser(function(id, done) {
  db.User.findById(id).then(function(user) {
    if (user) {
      done(null, user.get());
    } else {
      done(user.errors, null);

    }

  });

});

// // used to deserialize the user
// passport.deserializeUser(function(id, done) {
//   console.log("deserialized")
//   console.log(id)

//   db.User.findOne({where: {id: id}}, function (user, done){
//        console.log("result is coming back")

//     done(err, user);
//   });
//   // db.User.findById(id, function(err, user) {
//   // });
// });

// passport.serializeUser(function(user, cb) {
//   cb(null, user);
// });

// passport.deserializeUser(function(obj, cb) {
//   cb(null, obj);
// });

module.exports = passport;
