const { Router } =  require('express');
const passport = require("passport");
const router = Router();
const userRouter = require('./user')

const verifyJWT = (JWTkey) => (req, res, next) =>  {
    return passport.authenticate(JWTkey, { session: false }, function(err, user, info) {
        // If authentication failed, `user` will be set to false. If an exception occurred, `err` will be set.
        if (err || !user) {
          // PASS THE ERROR OBJECT TO THE NEXT ROUTE i.e THE APP'S COMMON ERROR HANDLING MIDDLEWARE
          console.log("err:",err);
          console.log("user:",user);
          console.log("info:",info);
          //   return next(info);
        return res
              .status(401)
              .send({ success: false, msg: "Invalid token. please login again to get fresh token!" });
        } else {
          return next();
        }
      })(req, res, next);
}

// Define Routes
router.use('/user', verifyJWT(["clientJwt"]), userRouter);




module.exports = router;