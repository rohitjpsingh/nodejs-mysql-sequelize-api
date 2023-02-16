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
        whereText += ` AND user.license = '${licenseType}'`;
      }
      else{
        whereText += ` AND user.license NOT IN ("cancelled","cancelled-expired")`;
      }
      let getUsersData = await db.sequelize.query(`SELECT license FROM user INNER JOIN company ON company.id = user.companyId INNER JOIN login ON login.userId = user.id WHERE ${whereText}`,{ type: db.sequelize.QueryTypes.SELECT });

      for (const user of getUsersData) {
        let licenseName = user.license;
        let findLicense = license.find(function (lc, index) {
          return lc.name.toString().toLocaleLowerCase() == licenseName.toString().toLowerCase();
        });
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
          whereText += ` AND user.license = '${licenseType}'`;
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

module.exports = router;