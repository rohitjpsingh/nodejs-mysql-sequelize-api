const express = require("express");
const db = require("../../models/index");
const bcrypt = require("bcrypt");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
var auth = require("../../utils/authentication");
const Company = db.company;
const User = db.user;
const ShieldLogin = db.shield_login;
const saltRounds = 10;

// Register API
router.post("/adminSignup", async (req, res) => {
  try {
    console.log("====================================");
    console.log("req.body:", req.body);
    console.log("====================================");

    let response_arr = [];
    let companyName = req.body.companyName ? req.body.companyName : "";
    let companyNumber = req.body.companyNumber ? req.body.companyNumber : "";

    let userFirstName = req.body.userFirstName ? req.body.userFirstName : "";
    let userLastName = req.body.userLastName ? req.body.userLastName : "";
    let userEmail = req.body.userEmail ? req.body.userEmail : "";
    let userLanguage = req.body.userLanguage ? req.body.userLanguage : "";

    // let username = req.body.username ? req.body.username : "";
    let password = req.body.password ? req.body.password : "";

    let companyData = await Company.create({
      name: companyName,
      number: companyNumber,
    });
    let userData = await User.create({
      companyId: companyData.id,
      firstName: userFirstName,
      lastName: userLastName,
      eMail: userEmail,
      language: userLanguage,
    });
    // const hash = password ? bcrypt.hashSync(password, saltRounds) : "";
    const newShieldHash = password;
    const newShieldSalt = auth.generateSaltShield(64);

    let shieldLoginData = await ShieldLogin.create({
      userId: userData.id,
      username: userEmail,
      passwordHash: newShieldHash,
      salt: newShieldSalt,
      lastEditedBy: userData.id,
      createdBy: userData.id,
      lastPasswordReset: new Date(),
      superUser: 1,
    });

    const payload = { id: userData.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET);
    return res
      .status(200)
      .json({ success: true, msg: "Data add done.", data: userData, token });
  } catch (error) {
    return res.status(400).json({ success: false, msg: error.message });
  }
});

// Admin Login
router.get("/adminLogin", (req, res, done) => {
  try {
    console.log("====================================");
    console.log("req.body:", req.body);
    console.log("====================================");
    let response_arr = [];
    let username = req.body.username ? req.body.username : "";
    let password = req.body.password ? req.body.password : "";

    passport.authenticate("clientLocal", (err, user, info) => {
      if (err) {
        return done(err); // will generate a 500 error
      }
      // Generate a JSON response reflecting authentication status
      if (!user) {
        return res.status(200).json({ success: false, msg: info});
      }
      req.login(user, (loginErr) => {
        if (loginErr) {
          return done(loginErr);
        }
        const payload = { id: req.user.id };
        const token = jwt.sign(payload, process.env.JWT_SECRET,{
          expiresIn: process.env.JWT_EXPIRES_IN,
        });
        return res.json({ success: true, msg: "Login done.", user:{userId:user.userId, username:user.username}, token });
      });
    })(req, res, done);
  } catch (error) {
    return res.status(400).json({ success: false, msg: error.message });
  }
});

module.exports = router;
