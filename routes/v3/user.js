const express = require("express");
const db = require("../../models/index");
const { countries,userLanguages } = require("../../constants");
const mail = require('../../utils/mail');
var auth = require('../../utils/authentication');
var moment = require('moment-timezone');
const router = express.Router();
const User = db.user;
const Company = db.company;
const Login = db.login;
const Department = db.department;
const DepartmentUserAccess = db.department_user_access;

// Update Detail
router.post("/companyMoveUp", async (req, res) => {
  try {
    console.log("====================================");
    console.log("req.body:", req.body);
    console.log("====================================");
    let response_arr = [];
    const {companyId, oldCompanyId,  userId} = req.body;

    if (!userId || !companyId) {
      let errorMsg = !userId ? 'User required!' : 'Company required!';
      return res
        .status(200)
        .json({ success: false, msg: errorMsg });
    }

    // Replace Company Id
    await User.update({companyId}, {
      where: { id:userId, companyId:oldCompanyId },
    });

    // Fetch Old Company's Department Connected With User
    let getDepartmentList = await db.sequelize.query(
      `SELECT * FROM (SELECT department_user_access.userId AS dua_userId, department_user_access.departmentId AS dua_departmentId, department.id AS departmentId,department.name AS departmentName, company.id AS companyId FROM department_user_access INNER JOIN department ON department.id = department_user_access.departmentId INNER JOIN company ON company.id = department.companyId) AS TEMP WHERE companyId = '${oldCompanyId}' AND  dua_userId = '${userId}'`,
      { type: db.sequelize.QueryTypes.SELECT }
    );
    
    // Add Department to New Company and Connect Dept with User
    for (const dept of getDepartmentList) {
      const {departmentId} = dept;
      await Department.update({companyId}, {
        where: { id:departmentId, companyId:oldCompanyId },
      });
    }
    return res
      .status(200)
      .json({ success: true, msg: "Data update done.", response_arr });
  } catch (error) {
    return res.status(400).json({ success: false, msg: error.message });
  }
});

module.exports = router;