const express = require("express");
const db = require("../../models/index");
const { countries, LIMITS } = require("../../constants");
const router = express.Router();
const User = db.user;
const Company = db.company;
const Department = db.department;
const DepartmentUserAccess = db.department_user_access;

// Add New
router.post("/add", async (req, res) => {
  try {
    console.log("====================================");
    console.log("req.body:", req.body);
    console.log("====================================");
    let response_arr = [];
    let { companyId, deptName } = req.body;
    
    let check_exist = await Department.findOne({
      where: { name:deptName, companyId:companyId },
      attributes: [
        "id",
        "companyId",
        "name",
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
      companyId: companyId,
      name: deptName  
    };
    let new_data = await Department.create(set_data);
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
    let companyId = req.query.companyId ? req.query.companyId : "";
    const recordsPerPage = LIMITS.DEPARTMENT;
    const page = req.query.current_page ? req.query.current_page : 1;

    let whereQuery = [`1=1`];
    if(companyId){
      whereQuery.push(`department.companyId = ${companyId}`);
    }
    let whereText = whereQuery.join(` AND `);
     response_arr = await db.sequelize.query(
      `SELECT department.id,department.name,(SELECT COUNT(department_user_access.id) 
      FROM department_user_access 
      INNER JOIN user ON user.id = department_user_access.userId 
      INNER JOIN company ON company.id = user.companyId 
      WHERE department_user_access.departmentId = department.id AND user.id NOT IN (SELECT shield_login.userId FROM shield_login WHERE shield_login.superUser=1)) AS userCount FROM department WHERE ${whereText}`,
      { type: db.sequelize.QueryTypes.SELECT }
    );

    const totalRecords = response_arr.length;
    const totalPages = Math.ceil(totalRecords / recordsPerPage);
    const limit = recordsPerPage;
    const offset = parseInt(page * limit - limit);

    response_arr = response_arr.slice(offset);
    response_arr = response_arr.slice(0, limit);

    return res
      .status(200)
      .json({ 
        success: true, 
        msg: "Data get done.", 
        data: response_arr,
        pagination: {
          currentPage: + page ,
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
      `SELECT 
      department.id,department.name,
      company.name AS companyName,
      company.id AS companyId,
      (SELECT COUNT(department_user_access.id) 
        FROM department_user_access 
        INNER JOIN user ON user.id = department_user_access.userId 
        INNER JOIN company ON company.id = user.companyId 
        WHERE department_user_access.departmentId = department.id AND user.id NOT IN (SELECT shield_login.userId FROM shield_login WHERE shield_login.superUser=1)) AS userCount 
      FROM department INNER JOIN company ON company.id = department.companyId WHERE department.id=${recordId}`,
      { type: db.sequelize.QueryTypes.SELECT }
    );
    
    return res
      .status(200)
      .json({ success: true, msg: "Data get done.", data: getAllData.length ? getAllData[0] : "" });
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
      deptName
    } = req.body;
    
    let check_exist = await Department.findOne({
      where: { id: recordId },
      attributes: [
        "id",
        "companyId",
        "name",
      ],
    });

    if (!check_exist) {
      return res
        .status(200)
        .json({ success: false, msg: "Data not exist.", data: check_exist });
    }

    let set_data = {
        name: deptName,
    };
    let update_data = await Department.update(set_data, {
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

    let check_exist = await Department.findOne({
      where: { id: recordId },
      attributes: [
        "id",
        "companyId",
        "name",
      ],
    });

    if (!check_exist) {
      return res
        .status(200)
        .json({ success: false, msg: "Data not exist.", data: check_exist });
    }

    let delete_data = await Department.destroy({
      where: { id: [recordId] },
    });
    return res
      .status(200)
      .json({ success: true, msg: "Data delete done.", data: delete_data });
  } catch (error) {
    return res.status(400).json({ success: false, msg: error.message });
  }
});

// Get Department Members
router.get("/memberList/:id", async (req, res) => {
  try {
    console.log("====================================");
    console.log("req.body:", req.body);
    console.log("====================================");
    let response_arr = [];
    let recordId = req.params.id ? req.params.id : "";

    let getActiveMembers = await db.sequelize.query(
      `SELECT * FROM (SELECT department_user_access.id AS deptAccessId,
      department.id AS deptId,
      department.name AS deptName,
      user.id AS userId,
      IFNULL(user.firstName,"") AS ufirstName,
      IFNULL(user.lastName,"") AS ulastName,
      IFNULL(shield_login.superUser, 0 ) AS superUserText,
      IFNULL(user.telephone, "" ) AS utelephone,
      IFNULL(user.mobile, "" ) AS umobile,
      IFNULL(user.eMail, "" ) AS ueMail,
      IFNULL(user.contractNumber, "" ) AS ucontractNumber,
      IFNULL(user.orderNumber, "" ) AS uorderNumber,
      IFNULL(user.language, "" ) AS ulanguage,
      IFNULL(user.licenseRole, "" ) AS ulicenseRole,
      IFNULL(user.license, "" ) AS ulicense,
      IFNULL(user.licenseExpiryDate, "" ) AS ulicenseExpiryDate,
      IFNULL(user.lastLogin, "" ) AS ulastLogin,
      (SELECT COUNT(department_user_access.id) 
          FROM department_user_access 
          INNER JOIN department ON department.id = department_user_access.departmentId 
          INNER JOIN company ON company.id = department.companyId 
          WHERE department_user_access.userId = user.id) AS departmentCount     
      FROM department_user_access 
      INNER JOIN user ON user.id = department_user_access.userId 
      LEFT JOIN shield_login ON shield_login.userId = user.id
      INNER JOIN department ON department.id = department_user_access.departmentId 
      INNER JOIN company ON company.id = user.companyId 
      WHERE department_user_access.departmentId = ${recordId}) AS TEMP WHERE superUserText=0`,
      { type: db.sequelize.QueryTypes.SELECT }
    );

    let getNotActiveMembers = await db.sequelize.query(
      `SELECT * FROM (
        SELECT user.id AS userId, 
        IFNULL(user.firstName,"") AS ufirstName, 
        IFNULL(user.lastName,"") AS ulastName ,
        IFNULL(shield_login.superUser, 0 ) AS superUserText ,
        (SELECT department.id FROM department WHERE department.id = ${recordId}) AS deptId,
        (SELECT department.name FROM department WHERE department.id = ${recordId}) AS deptName
        FROM user 
        INNER JOIN company ON user.companyId = company.id 
        LEFT JOIN shield_login ON shield_login.userId = user.id 
        WHERE user.companyId IN 
          (SELECT department.companyId FROM department WHERE department.id = ${recordId}) 
        AND user.id NOT IN 
          (SELECT user.id 
            FROM department_user_access 
            WHERE department_user_access.departmentId = ${recordId} 
            AND department_user_access.userId =  user.id)
      ) AS TEMP WHERE superUserText=0`,
      { type: db.sequelize.QueryTypes.SELECT }
    );


    getActiveMembers = getActiveMembers.map((item) => {
      var __FOUND = countries.find(function(cnt, index) {
        if(cnt.name.toLowerCase() == item.ulanguage.toLowerCase())
          return true;
      });
      return {
        ...item,
        ucountryCode: __FOUND ? __FOUND.code : "",
      }
    });
    
    return res
      .status(200)
      .json({ success: true, msg: "Data get done.", exist: getActiveMembers, not_exist:getNotActiveMembers });
  } catch (error) {
    return res.status(400).json({ success: false, msg: error.message });
  }
});

// Add/Remove Members
router.post("/addRemoveMember", async (req, res) => {
  try {
    console.log("====================================");
    console.log("req.body:", req.body);
    console.log("====================================");
    let response_arr = [];
    let recordId = req.body.deptId ? req.body.deptId : "";
    let userId   = req.body.userId ? req.body.userId : "";
    let action   = req.body.action ? req.body.action : "";

    if(action == 'remove') {
      let delete_data = await DepartmentUserAccess.destroy({
        where: { departmentId: recordId, userId:userId },
      });
      return res
      .status(200)
      .json({ success: true, msg: "Data delete done.", data: delete_data });
    }
    else if(action == 'add') {
      let check_exist = await DepartmentUserAccess.findOne({
        where: {
          departmentId: recordId, 
          userId:userId
        }
      });
  
      if (check_exist) {
        return res
          .status(200)
          .json({ success: false, msg: "Data exist.", data: check_exist });
      }

      let set_data = {
        departmentId: recordId, 
        userId:userId
      };
      let new_data = await DepartmentUserAccess.create(set_data);
      return res
        .status(200)
        .json({ success: true, msg: "Data add done.", data: new_data });
    }
    else {
      return res
      .status(400)
      .json({ success: false, msg: "Data information wrong."});
    }
    
  } catch (error) {
    return res.status(400).json({ success: false, msg: error.message });
  }
});
module.exports = router;