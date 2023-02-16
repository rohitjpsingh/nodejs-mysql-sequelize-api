// Passport
const passport = require("passport");
const bcrypt = require("bcrypt");
const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const { ExtractJwt } = require("passport-jwt");
const db = require("./models/index");
var auth = require('./utils/authentication');

const { User } = db;
const ShieldLogin = db.shield_login;


passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

// Passport authenticaton
passport.use(
  "clientLocal",
  new LocalStrategy((username, password, done) => {
    console.log("username:",username,"password:",password);
    return ShieldLogin.findOne({ where: { username: username }, raw:true})
      .then((user) => {
        console.log("LL");
        if (!user) {
          return done(null,false,"Incorrect username.");
        }
        const validUser = auth.validatePassword(password, user.passwordHash, user.salt);
        if (!validUser) {
          return done(null,false,"Incorrect password.");
        }
        return done(null,user);
      })
      .catch((err) => done(err));
  })
);

// Passport JWT Auth
passport.use(
  "clientJwt",
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("JWT"),
      secretOrKey: process.env.JWT_SECRET,
    },
    (jwtPayload, done) => {
      console.log("jwtPayload:",jwtPayload);
      return ShieldLogin.findOne({ where: { id: jwtPayload.id }, raw: false })
        .then((user) => {
          if (!user) {
            return done(null, false, { message: "Incorrect user." });
          }
          return done(null, user);
        })
        .catch((err) => done(err));
    }
  )
);
