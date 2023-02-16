const express = require("express");
const db = require("../../models/index");
const { countries, license, LIMITS } = require("../../constants");
const router = express.Router();
const Company = db.company;
const Department = db.department;
const User = db.user;
const ShieldLogin = db.shield_login;
const DepartmentUserAccess = db.department_user_access;

// Add New
router.post("/add", async (req, res) => {
  try {
    console.log("====================================");
    console.log("req.body:", req.body);
    console.log("====================================");
    let response_arr = [];
    let {
      number,
      companyName,
      vatNumber,
      billingAddress1,
      billingPostCode,
      billingCity,
      billingCountry,
      industry,
    } = req.body;

    let check_exist = await Company.findOne({
      where: { name: companyName },
      attributes: [
        "id",
        "number",
        "name",
        "vatNumber",
        "visitingAddress1",
        "visitingPostCode",
        "visitingCity",
        "visitingCountry",
        "industry",
      ],
    });
    if (check_exist) {
      return res.status(200).json({
        success: false,
        msg: "Data already exist.",
        data: check_exist,
      });
    }

    let set_data = {
      number: number ? number : "",
      name: companyName ? companyName : "",
      vatNumber: vatNumber ? vatNumber : "",
      billingAddress1: billingAddress1 ? billingAddress1 : "",
      billingPostCode: billingPostCode ? billingPostCode : "",
      billingCity: billingCity ? billingCity : "",
      billingCountry: billingCountry ? billingCountry : "",
      industry: industry ? industry : "",
    };
    let new_data = await Company.create(set_data);
    return res
      .status(200)
      .json({ success: true, msg: "Data add done.", data: new_data });
  } catch (error) {
    return res.status(400).json({ success: false, msg: error.message });
  }
});

// Get List
router.get("/list", async (req, res) => {
  try {
    console.log("====================================");
    console.log("req.body:", req.body);
    console.log("====================================");
    let response_arr = [];
    let company_name = req.body.company_name ? req.body.company_name : "";
    let searchKeyword = req.query.searchKeyword ? req.query.searchKeyword : "";
    let pageFor = req.query.pageFor ? req.query.pageFor : "";
    const recordsPerPage = LIMITS.COMPANY;
    const page = req.query.current_page ? req.query.current_page : 1;

    let whereQuery = [`superUserText=0`];
    if (searchKeyword) {
      whereQuery.push(
        `name LIKE '${searchKeyword}%' OR number LIKE '${searchKeyword}%'`
      );
    }

    let whereText = whereQuery.join(` AND `);

    let getAllData = await db.sequelize.query(
      `SELECT * FROM (
        SELECT 
          DISTINCT (company.id),
          IFNULL(company.number, "" ) AS number,
          IFNULL(company.name, "" ) AS name,
          IFNULL(company.vatNumber, "" ) AS vatNumber,
          IFNULL(company.billingAddress1, "" ) AS billingAddress1,
          IFNULL(company.billingPostCode, "" ) AS billingPostCode,
          IFNULL(company.billingCity, "" ) AS billingCity,
          IFNULL(company.billingCountry, "" ) AS billingCountry,
          IFNULL(company.industry, "" ) AS industry,
          IFNULL(shield_login.superUser, 0 ) AS superUserText, 
          (SELECT COUNT(department.id) 
            FROM department 
            WHERE department.companyId = company.id) AS departmentCount, 
          (SELECT COUNT(user.id) 
            FROM user 
            WHERE user.companyId = company.id AND user.id NOT IN (SELECT shield_login.userId FROM shield_login WHERE shield_login.superUser=1)) AS userCount 
        FROM company 
        LEFT JOIN user ON user.companyId = company.id 
        LEFT JOIN shield_login ON shield_login.userId = user.id) 
      AS TEMP
      WHERE ${whereText}`,
      { type: db.sequelize.QueryTypes.SELECT }
    );

    response_arr = await Promise.all(
      getAllData.map(async (item) => {
        var __FOUND = countries.find(function (cnt, index) {
          if (cnt.name.toLowerCase() == item.billingCountry.toLowerCase())
            return true;
        });

        //======== Manage Company Total Amount ========//
        let totalAmount = 0;
        let getUsersData = await db.sequelize.query(
          `SELECT license FROM user WHERE companyId = ${item.id}`,
          { type: db.sequelize.QueryTypes.SELECT }
        );
        let hasUnlimitedSubscription = false;
        for (const user of getUsersData) {
          let licenseName = user.license;
          let findLicense = license.find(function (lc, index) {
            return (
              lc.name.toString().toLocaleLowerCase() ==
              licenseName.toString().toLowerCase()
            );
          });
          let licenseAmt = findLicense ? findLicense.amt : 0;
          if (licenseName.toString().toLowerCase() == "unlimited") {
            hasUnlimitedSubscription = true;
          }
          totalAmount += parseFloat(licenseAmt);
        }
        //======== Manage Company Total Amount ========//
        return {
          ...item,
          countryCode: __FOUND ? __FOUND.code : "",
          totalAmount: hasUnlimitedSubscription ? "infinity" : totalAmount,
        };
      })
    );

    const totalRecords = response_arr.length;
    const totalPages = Math.ceil(totalRecords / recordsPerPage);
    const limit = recordsPerPage;
    const offset = parseInt(page * limit - limit);
    if (!["companyMove"].includes(pageFor)) {
      response_arr = response_arr.slice(offset);
      response_arr = response_arr.slice(0, limit);
    }

    return res.status(200).json({
      success: true,
      msg: "Data get done.",
      data: response_arr,
      pagination: {
        currentPage: +page,
        limit,
        totalPages,
        totalRecords,
      },
    });
  } catch (error) {
    return res.status(400).json({ success: false, msg: error.message });
  }
});

// Get Detail
router.get("/:id", async (req, res) => {
  try {
    console.log("====================================");
    console.log("req.body:", req.body);
    console.log("====================================");
    let response_arr = [];
    let recordId = req.params.id ? req.params.id : "";

    let getAllData = await db.sequelize.query(
      `SELECT * FROM (
        SELECT DISTINCT (company.id),
        IFNULL(company.number, "" ) AS number,
        IFNULL(company.name, "" ) AS name,
        IFNULL(company.vatNumber, "" ) AS vatNumber,
        IFNULL(company.billingAddress1, "" ) AS billingAddress1,
        IFNULL(company.billingPostCode, "" ) AS billingPostCode,
        IFNULL(company.billingCity, "" ) AS billingCity,
        IFNULL(company.billingCountry, "" ) AS billingCountry,
        IFNULL(company.industry, "" ) AS industry,
        IFNULL(company.notes, "" ) AS notes,
        IFNULL(shield_login.superUser, 0 ) AS superUserText, 
        (SELECT COUNT(department.id) 
          FROM department 
          WHERE department.companyId = company.id) AS departmentCount, 
        (SELECT COUNT(user.id) 
          FROM user 
          WHERE user.companyId = company.id AND user.id NOT IN (SELECT shield_login.userId FROM shield_login WHERE shield_login.superUser=1)) AS userCount
      FROM company 
      LEFT JOIN user ON user.companyId = company.id 
      LEFT JOIN shield_login ON shield_login.userId = user.id) 
      AS TEMP 
      WHERE id = ${recordId}`,
      { type: db.sequelize.QueryTypes.SELECT }
    );

    getAllData = await Promise.all(
      getAllData.map(async (item) => {
        var __FOUND = countries.find(function (cnt, index) {
          if (cnt.name.toLowerCase() == item.billingCountry.toLowerCase())
            return true;
        });
        //======== Manage Company Total Amount ========//
        let totalAmount = 0;
        let getUsersData = await db.sequelize.query(
          `SELECT license FROM user WHERE companyId = ${item.id}`,
          { type: db.sequelize.QueryTypes.SELECT }
        );
        let hasUnlimitedSubscription = false;
        for (const user of getUsersData) {
          let licenseName = user.license;
          let findLicense = license.find(function (lc, index) {
            return (
              lc.name.toString().toLocaleLowerCase() ==
              licenseName.toString().toLowerCase()
            );
          });
          let licenseAmt = findLicense ? findLicense.amt : 0;
          if (licenseName.toString().toLowerCase() == "unlimited") {
            hasUnlimitedSubscription = true;
          }
          totalAmount += parseFloat(licenseAmt);
        }
        //======== Manage Company Total Amount ========//

        return {
          ...item,
          countryCode: __FOUND ? __FOUND.code : "",
          totalAmount: hasUnlimitedSubscription ? "infinity" : totalAmount,
        };
      })
    );

    if (!getAllData.length) {
      return res.status(200).json({
        success: false,
        msg: "Data not exist.",
      });
    }

    return res.status(200).json({
      success: true,
      msg: "Data get done.",
      data: getAllData.length ? getAllData[0] : "",
    });
  } catch (error) {
    return res.status(400).json({ success: false, msg: error.message });
  }
});

// Update Detail
router.put("/update/:id", async (req, res) => {
  try {
    console.log("====================================");
    console.log("req.body:", req.body);
    console.log("====================================");
    let response_arr = [];
    let recordId = req.params.id ? req.params.id : "";
    let {
      number,
      companyName,
      vatNumber,
      billingAddress1,
      billingPostCode,
      billingCity,
      billingCountry,
      industry,
      notes,
    } = req.body;

    let check_exist = await Company.findOne({
      where: { id: recordId },
      attributes: [
        "id",
        "number",
        "name",
        "vatNumber",
        "visitingAddress1",
        "visitingPostCode",
        "visitingCity",
        "visitingCountry",
        "industry",
      ],
    });

    if (!check_exist) {
      return res
        .status(200)
        .json({ success: false, msg: "Data not exist.", data: check_exist });
    }
    let set_data = {};
    if (req?.body?.hasOwnProperty("notes")) {
      set_data = {
        notes: notes,
      };
    } else {
      set_data = {
        number: number ? number : "",
        name: companyName ? companyName : "",
        vatNumber: vatNumber ? vatNumber : "",
        billingAddress1: billingAddress1 ? billingAddress1 : "",
        billingPostCode: billingPostCode ? billingPostCode : "",
        billingCity: billingCity ? billingCity : "",
        billingCountry: billingCountry ? billingCountry : "",
        industry: industry ? industry : "",
      };
    }
    let update_data = await Company.update(set_data, {
      where: { id: recordId },
    });
    return res
      .status(200)
      .json({ success: true, msg: "Data update done.", data: update_data });
  } catch (error) {
    return res.status(400).json({ success: false, msg: error.message });
  }
});

// Delete Detail
router.delete("/delete/:id", async (req, res) => {
  try {
    console.log("====================================");
    console.log("req.body:", req.body);
    console.log("====================================");
    let response_arr = [];
    let recordId = req.params.id ? req.params.id : "";

    let check_exist = await Company.findOne({
      where: { id: recordId },
      attributes: [
        "id",
        "number",
        "name",
        "vatNumber",
        "visitingAddress1",
        "visitingPostCode",
        "visitingCity",
        "visitingCountry",
        "industry",
      ],
    });

    if (!check_exist) {
      return res
        .status(200)
        .json({ success: false, msg: "Data not exist.", data: check_exist });
    }

    let delete_data = await Company.destroy({
      where: { id: [recordId] },
    });
    return res
      .status(200)
      .json({ success: true, msg: "Data delete done.", data: delete_data });
  } catch (error) {
    return res.status(400).json({ success: false, msg: error.message });
  }
});

module.exports = router;
