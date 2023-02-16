const express = require("express");
const db = require("../../models/index");
const { industries, countries, license, licenseRole, userLanguages } = require("../../constants");
const router = express.Router();
const User = db.user;
const Company = db.company;
const Department = db.department;
const DepartmentUserAccess = db.department_user_access;

// Get Static Data
router.get("/staticData", async (req, res) => {
  try {
    console.log("====================================");
    console.log("req.body:", req.body);
    console.log("====================================");

    let industryList = industries.map((item) => {
      return {
        label:item,
        value:item,
      };
    });

    let countryList = countries.map((item) => {
      return {
        label:item.name,
        value:item.name,
        code:item.code,
      };
    });

    let licenseList = license.map((item) => {
      return {
        label:item.name,
        value:item.name,
        amt:item.amt
      };
    });

    let licenseRoleList = licenseRole.map((item) => {
      return {
        label:item,
        value:item,
      };
    });

    let userLanguageList = userLanguages.map((item) => {
      return {
        label:item.name,
        value:item.name,
        code:item.code,
      };
    });

    return res
      .status(200)
      .json({ success: true, msg: "Data get done.", industryList, countryList,  licenseList,  licenseRoleList, userLanguageList });
  } catch (error) {
    return res.status(400).json({ success: false, msg: error.message });
  }
});

module.exports = router;
