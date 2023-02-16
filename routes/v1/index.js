const { Router } =  require('express');
// require('../../passport');
const passport = require("passport");
const router = Router();
const authRouter = require('./auth')
const companyRouter = require('./company')
const userRouter = require('./user')
const departmentRouter = require('./department')
const commonRouter = require('./common')
const reportRouter = require('./report')
const cronRouter = require('./cron')
var cron = require('node-cron');


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
router.use('/auth', authRouter);
router.use('/company', verifyJWT(["clientJwt"]), companyRouter);
router.use('/user', verifyJWT(["clientJwt"]), userRouter);
router.use('/department', verifyJWT(["clientJwt"]), departmentRouter);
router.use('/common', verifyJWT(["clientJwt"]), commonRouter);
router.use('/report', verifyJWT(["clientJwt"]), reportRouter);

cron.schedule('0 0 */3 * * *', () => {
  console.log('running a task every three hour', new Date());
  cronRouter.saveLoginActivities();
});


module.exports = router;