const express = require("express");
const db = require("../../models/index");
const { countries,license,licenseRole } = require("../../constants");
const router = express.Router();
const User = db.user;
const Company = db.company;
const Department = db.department;
const DepartmentUserAccess = db.department_user_access;

// Get Total Values Of Countries
router.get("/getValues", async (req, res) => {
  try {
    console.log("====================================");
    console.log("req.body:", req.body);
    console.log("====================================");
    let response_arr = [];
    let licenseType = req.query.licenseType ? req.query.licenseType : "";
    
    let getCountriesData = await db.sequelize.query(`SELECT DISTINCT billingCountry FROM company WHERE billingCountry !=''`,
      { type: db.sequelize.QueryTypes.SELECT }
    );
    console.log("getCountriesData:",getCountriesData);
    for (const country of getCountriesData) {
      let countryName = country.billingCountry;
      let totalAmount = 0;

      let whereText = `company.billingCountry = '${countryName}'`;
      if(licenseType){
        let newlicenseType = licenseType.split(',').map(it => `'${it}'`).join(",");
        whereText += ` AND user.license IN (${newlicenseType})`;
      }
      else{
        whereText += ` AND user.license NOT IN ("cancelled","cancelled-expired")`;
      }
      let getUsersData = await db.sequelize.query(`SELECT license FROM user INNER JOIN company ON company.id = user.companyId INNER JOIN login ON login.userId = user.id WHERE ${whereText}`,{ type: db.sequelize.QueryTypes.SELECT });

      for (const user of getUsersData) {
        let licenseName = user.license;
        let newLicense = license.map((it) => {
          if(it.name == 'unlimited'){
            return {
              ...it,
              amt:0
            }
          }
          else{
            return it;
          }
        });
        let findLicense = newLicense.find(function (lc, index) {
          return lc.name.toString().toLocaleLowerCase() == licenseName.toString().toLowerCase();
        });
        // console.log('findLicense:',findLicense);
        let licenseAmt = findLicense ? findLicense.amt : 0;
        totalAmount += parseFloat(licenseAmt);
      }
    
      response_arr.push({
        label: countryName,
        value: totalAmount,
      });
    }
    return res
      .status(200)
      .json({ success: true, msg: "Data get done.", data: response_arr });
  } catch (error) {
    return res.status(400).json({ success: false, msg: error.message });
  }
});

// Get Total Users Of Countries
router.get("/getUsers", async (req, res) => {
    try {
      console.log("====================================");
      console.log("req.body:", req.body);
      console.log("====================================");
      let response_arr = [];
      let licenseType = req.query.licenseType ? req.query.licenseType : "";
    
      let getCountriesData = await db.sequelize.query(`SELECT DISTINCT billingCountry FROM company WHERE billingCountry !=''`,
        { type: db.sequelize.QueryTypes.SELECT }
      );
      console.log("getCountriesData:",getCountriesData);
      for (const country of getCountriesData) {
        let countryName = country.billingCountry;
        let totalAmount = 0;
  
        let whereText = `company.billingCountry = '${countryName}'`;
        if(licenseType){
          let newlicenseType = licenseType.split(',').map(it => `'${it}'`).join(",");
          whereText += ` AND user.license IN (${newlicenseType})`;
        }
        else{
          whereText += ` AND user.license NOT IN ("cancelled","cancelled-expired")`;
        }
        let getUsersData = await db.sequelize.query(`SELECT license FROM user INNER JOIN company ON company.id = user.companyId INNER JOIN login ON login.userId = user.id WHERE ${whereText}`,{ type: db.sequelize.QueryTypes.SELECT });
      
        response_arr.push({
          label: countryName,
          value: getUsersData.length,
        });
      }
      return res
        .status(200)
        .json({ success: true, msg: "Data get done.", data: response_arr });
    } catch (error) {
      return res.status(400).json({ success: false, msg: error.message });
    }
});

// Get Total Companies Of Countries
router.get("/getCompanies", async (req, res) => {
    try {
      console.log("====================================");
      console.log("req.body:", req.body);
      console.log("====================================");
      let response_arr = [];
      let licenseType = req.query.licenseType ? req.query.licenseType : "";
    
      let getCountriesData = await db.sequelize.query(`SELECT DISTINCT billingCountry FROM company WHERE billingCountry !=''`,
        { type: db.sequelize.QueryTypes.SELECT }
      );
      console.log("getCountriesData:",getCountriesData);
      for (const country of getCountriesData) {
        let countryName = country.billingCountry;
        let totalCount = 0;
        let getCompaniesData = await db.sequelize.query(`
          SELECT DISTINCT company.id FROM company INNER JOIN user ON user.companyId = company.id INNER JOIN login ON login.userId = user.id WHERE company.billingCountry = '${countryName}'`,{ type: db.sequelize.QueryTypes.SELECT });
          console.log("countryName:",countryName,"TotalCompanies:",getCompaniesData.length);
          totalCount = getCompaniesData.length;           
          response_arr.push({
            label: countryName,
            value: totalCount,
          });
      }
      return res
        .status(200)
        .json({ success: true, msg: "Data get done.", data: response_arr });
    } catch (error) {
      return res.status(400).json({ success: false, msg: error.message });
    }
});

// Get Total Roles Of License
router.get("/getLicenseRoles", async (req, res) => {
  try {
    console.log("====================================");
    console.log("req.body:", req.body);
    console.log("====================================");
    let response_arr = [];
    let licenseType = req.query.licenseType ? req.query.licenseType : "";

    for (const role of licenseRole) {
      let whereText = `user.licenseRole = '${role}'`;
      if(licenseType){
        let newlicenseType = licenseType.split(',').map(it => `'${it}'`).join(",");
        whereText += ` AND user.license IN (${newlicenseType})`;
      }
      else{
        whereText += ` AND license NOT IN ("cancelled","cancelled-expired")`;
      }
      let getUserData = await db.sequelize.query(`
        SELECT user.id FROM user INNER JOIN company ON user.companyId = company.id INNER JOIN login ON login.userId = user.id WHERE ${whereText}`,{ type: db.sequelize.QueryTypes.SELECT });
        response_arr.push({
          label: role,
          value: getUserData.length,
        });
    }
    
    return res
      .status(200)
      .json({ success: true, msg: "Data get done.", data: response_arr });
  } catch (error) {
    return res.status(400).json({ success: false, msg: error.message });
  }
});

// Get Totals Of License
router.get("/getLicenses", async (req, res) => {
  try {
    console.log("====================================");
    console.log("req.body:", req.body);
    console.log("====================================");
    let response_arr = [];
    let licenseType = req.query.licenseType ? req.query.licenseType : "";

    for (const lt of license) {
      let whereText = `license = '${lt.name}'`;
      let getUserData = await db.sequelize.query(`
        SELECT user.id FROM user INNER JOIN company ON user.companyId = company.id INNER JOIN login ON login.userId = user.id WHERE ${whereText}`,{ type: db.sequelize.QueryTypes.SELECT });
        response_arr.push({
          label: lt.name,
          value: getUserData.length,
        });
    }
    
    return res
      .status(200)
      .json({ success: true, msg: "Data get done.", data: response_arr });
  } catch (error) {
    return res.status(400).json({ success: false, msg: error.message });
  }
});

// Get Totals Of License
router.get("/getLogginedUsers", async (req, res) => {
  try {
    console.log("====================================");
    console.log("req.body:", req.body);
    console.log("====================================");
    let response_arr = [];

    let getPastDateData = await db.sequelize.query(`SELECT DISTINCT la.loginDate FROM login_activities AS la where la.loginDate > current_date - interval 30 day`,{ type: db.sequelize.QueryTypes.SELECT }).catch((e) => console.log(e));

    console.log("getPastDateData:",getPastDateData);

    for (const dt of getPastDateData) {

      // Count User 
      let getCount = await db.sequelize.query(`SELECT COUNT (DISTINCT userId) AS totalUsers FROM login_activities WHERE loginDate = '${dt.loginDate}'`,{ type: db.sequelize.QueryTypes.SELECT }).catch((e) => console.log(e));
      console.log("getCountL:",getCount);

      response_arr.push({
        label:dt.loginDate,
        value:getCount && getCount.length > 0 && getCount[0]["totalUsers"] ? getCount[0]["totalUsers"] : 0,
      })
    }
    
    return res
      .status(200)
      .json({ success: true, msg: "Data get done.", data: response_arr });
  } catch (error) {
    return res.status(400).json({ success: false, msg: error.message });
  }
});
module.exports = router;