const express = require("express");
const db = require("../../models/index");
const { countries, userLanguages, LIMITS } = require("../../constants");
const mail = require("../../utils/mail");
var auth = require("../../utils/authentication");
var moment = require("moment-timezone");
const router = express.Router();
const User = db.user;
const Company = db.company;
const Login = db.login;
const Department = db.department;
const DepartmentUserAccess = db.department_user_access;

// Add New
router.post("/add", async (req, res) => {
  try {
    console.log("====================================");
    console.log("req.body:", req.body);
    console.log("====================================");
    let response_arr = [];
    let {
      companyId,
      firstName,
      lastName,
      telephone,
      mobile,
      eMail,
      contractNumber,
      orderNumber,
      language,
      license,
      licenseExpiryDate,
      licenseRole,
      departments,
    } = req.body;

    let check_exist = await User.findOne({
      where: { eMail: eMail },
      attributes: [
        "id",
        "companyId",
        "firstName",
        "lastName",
        "telephone",
        "mobile",
        "eMail",
        "contractNumber",
        "orderNumber",
        "language",
      ],
    });
    if (check_exist) {
      return res.status(200).json({
        success: false,
        msg: "Email already exist.",
        data: check_exist,
      });
    }

    let set_data = {
      companyId: companyId,
      firstName: firstName ? firstName : "",
      lastName: lastName ? lastName : "",
      telephone: telephone ? telephone : "",
      mobile: mobile ? mobile : "",
      eMail: eMail ? eMail.toLowerCase() : "",
      contractNumber: contractNumber ? contractNumber : "",
      orderNumber: orderNumber ? orderNumber : "",
      language: language ? language : "",
      license: license ? license : "",
      licenseExpiryDate: licenseExpiryDate ? licenseExpiryDate : "",
      licenseRole: licenseRole ? licenseRole : "",
    };
    let newUser = await User.create(set_data);
    let newLoginData = await Login.create({
      userId: newUser.id,
      username: newUser.eMail,
    });
    // Add Departments
    for (const deptId of departments) {
      await DepartmentUserAccess.create({
        userId: newUser.id,
        departmentId: deptId,
      });
    }
    return res
      .status(200)
      .json({ success: true, msg: "Data add done.", data: newUser });
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
    let email = req.body.email ? req.body.email : "";

    let searchKeyword = req.query.searchKeyword ? req.query.searchKeyword : "";
    let companyId = req.query.companyId ? req.query.companyId : "";
    let licenseType = req.query.licenseType ? req.query.licenseType : "";
    const recordsPerPage = LIMITS.All_USER;
    const page = req.query.current_page ? req.query.current_page : 1;

    let whereQuery = [`superUserText=0`];
    if (companyId) {
      whereQuery.push(`companyId = ${companyId}`);
    }
    if (searchKeyword) {
      whereQuery.push(
        `(firstName LIKE '${searchKeyword}%' OR lastName LIKE '${searchKeyword}%' OR eMail LIKE '%${searchKeyword}%')`
      );
    }
    if (licenseType) {
      whereQuery.push(`license = '${licenseType}'`);
    }
    let whereText = whereQuery.join(` AND `);

    let getAllData = await db.sequelize.query(
      `SELECT * FROM (
        SELECT user.id,
        IFNULL(user.firstName, "" ) AS firstName,
        IFNULL(user.lastName, "" ) AS lastName,
        IFNULL(user.telephone, "" ) AS telephone,
        IFNULL(user.mobile, "" ) AS mobile,
        IFNULL(user.eMail, "" ) AS eMail,
        IFNULL(user.contractNumber, "" ) AS contractNumber,
        IFNULL(user.orderNumber, "" ) AS orderNumber,
        IFNULL(user.language, "" ) AS language,
        IFNULL(user.licenseRole, "" ) AS licenseRole,
        IFNULL(user.license, "" ) AS license,
        IFNULL(user.licenseExpiryDate, "" ) AS licenseExpiryDate,
        IFNULL(user.lastLogin, "" ) AS lastLogin,
        IFNULL(company.name, "" ) AS company_name,
        company.id AS companyId, 
        (SELECT COUNT(department_user_access.id) 
          FROM department_user_access 
          INNER JOIN department ON department.id = department_user_access.departmentId 
          INNER JOIN company ON company.id = department.companyId 
          WHERE department_user_access.userId = user.id) AS departmentCount, 
        IFNULL(shield_login.superUser, 0 ) AS superUserText 
        FROM user 
        INNER JOIN company ON company.id = user.companyId 
        LEFT JOIN shield_login ON shield_login.userId = user.id) 
      AS TEMP 
      WHERE ${whereText}`,
      { type: db.sequelize.QueryTypes.SELECT }
    );

    response_arr = getAllData.map((item) => {
      var __FOUND = userLanguages.find(function (cnt, index) {
        if (cnt.name.toLowerCase() == item.language.toLowerCase()) return true;
      });
      return {
        ...item,
        countryCode: __FOUND ? __FOUND.code : "",
      };
    });

    const totalRecords = response_arr.length;
    const totalPages = Math.ceil(totalRecords / recordsPerPage);
    const limit = recordsPerPage;
    const offset = parseInt(page * limit - limit);

    response_arr = response_arr.slice(offset);
    response_arr = response_arr.slice(0, limit);

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
      `SELECT user.id,
      IFNULL(user.firstName,"") AS firstName,
      IFNULL(user.lastName,"") AS lastName,
      IFNULL(user.eMail,"") AS eMail,
      IFNULL(user.telephone,"") AS telephone,
      IFNULL(user.mobile,"") AS mobile,
      IFNULL(user.language,"") AS language,
      IFNULL(user.contractNumber,"") AS contractNumber,
      IFNULL(user.orderNumber,"") AS orderNumber,
      IFNULL(user.license,"") AS license,
      IFNULL(user.lastLogin, "" ) AS lastLogin,
      IFNULL(user.licenseExpiryDate,"") AS licenseExpiryDate,
      IFNULL(user.licenseRole,"") AS licenseRole,
      IFNULL(user.notes,"") AS notes,
      IFNULL(company.name, "" ) AS companyName,
        company.id AS companyId, 
        (SELECT COUNT(department_user_access.id) 
          FROM department_user_access 
          INNER JOIN department ON department.id = department_user_access.departmentId 
          INNER JOIN company ON company.id = department.companyId 
          WHERE department_user_access.userId = user.id) AS deptCount 
      FROM user INNER JOIN company ON company.id = user.companyId 
      WHERE user.id=${recordId}`,
      { type: db.sequelize.QueryTypes.SELECT }
    );

    getAllData = getAllData.map((item) => {
      var __FOUND = userLanguages.find(function (cnt, index) {
        if (cnt.name.toLowerCase() == item.language.toLowerCase()) return true;
      });
      return {
        ...item,
        countryCode: __FOUND ? __FOUND.code : "",
      };
    });

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
      firstName,
      lastName,
      telephone,
      mobile,
      eMail,
      contractNumber,
      orderNumber,
      language,
      notes,
      license,
      licenseExpiryDate,
      licenseRole,
    } = req.body;

    let check_exist = await User.findOne({
      where: { id: recordId },
      attributes: [
        "id",
        "companyId",
        "firstName",
        "lastName",
        "telephone",
        "mobile",
        "eMail",
        "contractNumber",
        "orderNumber",
        "language",
      ],
    });

    if (!check_exist) {
      return res
        .status(200)
        .json({ success: false, msg: "Data not exist.", data: check_exist });
    }

    let set_data = {};
    if (req?.body?.hasOwnProperty("notes")) {
      // Edit Notes
      set_data = {
        notes: notes,
      };
    } else if (req?.body?.hasOwnProperty("license")) {
      // Edit License
      set_data = {
        license,
        licenseExpiryDate,
        licenseRole,
      };
    } else {
      set_data = {
        firstName: firstName ? firstName : "",
        lastName: lastName ? lastName : "",
        telephone: telephone ? telephone : "",
        mobile: mobile ? mobile : "",
        eMail: eMail ? eMail.toLowerCase() : "",
        contractNumber: contractNumber ? contractNumber : "",
        orderNumber: orderNumber ? orderNumber : "",
        language: language ? language : "",
      };
    }

    if (eMail) {
      let check_exist_2 = await User.findOne({
        where: {
          id: {
            [db.Sequelize.Op.ne]: recordId,
          },
          eMail: eMail,
        },
        attributes: ["id"],
      });

      if (check_exist_2) {
        return res
          .status(200)
          .json({
            success: false,
            msg: "Email already exist.",
            data: check_exist_2,
          });
      }

      let loginSet = {
        username: eMail,
      };
      let updateLoginData = await Login.update(loginSet, {
        where: { userId: recordId },
      });
    }

    let update_data = await User.update(set_data, {
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

    let check_exist = await User.findOne({
      where: { id: recordId },
      attributes: [
        "id",
        "companyId",
        "firstName",
        "lastName",
        "telephone",
        "mobile",
        "eMail",
        "contractNumber",
        "orderNumber",
        "language",
      ],
    });

    if (!check_exist) {
      return res
        .status(200)
        .json({ success: false, msg: "Data not exist.", data: check_exist });
    }

    let delete_data = await User.destroy({
      where: { id: [recordId] },
    });
    return res
      .status(200)
      .json({ success: true, msg: "Data delete done.", data: delete_data });
  } catch (error) {
    return res.status(400).json({ success: false, msg: error.message });
  }
});

// Get Member's Department
router.get("/departmentList/:id", async (req, res) => {
  try {
    console.log("====================================");
    console.log("req.body:", req.body);
    console.log("====================================");
    let response_arr = [];
    let recordId = req.params.id ? req.params.id : "";

    let getActiveDepartments = await db.sequelize.query(
      `SELECT department_user_access.id AS deptAccessId,
      department.id AS deptId,
      department.name AS deptName,
      user.id AS userId,
      IFNULL(user.firstName,"") AS ufirstName,
      IFNULL(user.lastName,"") AS ulastName,
      (SELECT COUNT(department_user_access.id) 
        FROM department_user_access 
        INNER JOIN user ON user.id = department_user_access.userId 
        INNER JOIN company ON company.id = user.companyId 
        WHERE department_user_access.departmentId = department.id) AS userCount 
      FROM department_user_access 
      INNER JOIN user ON user.id = department_user_access.userId 
      INNER JOIN department ON department.id = department_user_access.departmentId 
      INNER JOIN company ON company.id = department.companyId
      WHERE department_user_access.userId = ${recordId} AND user.companyId=department.companyId`,
      { type: db.sequelize.QueryTypes.SELECT }
    );

    let getNotActiveDepartments = await db.sequelize.query(
      `SELECT * FROM (
        SELECT department.id AS deptId, 
        IFNULL(department.name,"") AS deptName, 
        (SELECT user.id FROM user WHERE user.id = ${recordId}) AS userId,
        (SELECT user.firstName FROM user WHERE user.id = ${recordId}) AS ufirstName
        FROM department 
        INNER JOIN company ON department.companyId = company.id 
        WHERE department.companyId IN 
          (SELECT user.companyId FROM user WHERE user.id = ${recordId}) 
        AND department.id NOT IN 
          (SELECT department.id 
            FROM department_user_access 
            WHERE department_user_access.userId = ${recordId} 
            AND department_user_access.departmentId =  department.id)
      ) AS TEMP`,
      { type: db.sequelize.QueryTypes.SELECT }
    );

    return res
      .status(200)
      .json({
        success: true,
        msg: "Data get done.",
        exist: getActiveDepartments,
        not_exist: getNotActiveDepartments,
      });
  } catch (error) {
    return res.status(400).json({ success: false, msg: error.message });
  }
});

// Add/Remove Department
router.post("/addRemoveDept", async (req, res) => {
  try {
    console.log("====================================");
    console.log("req.body:", req.body);
    console.log("====================================");
    let response_arr = [];
    let recordId = req.body.userId ? req.body.userId : "";
    let deptId = req.body.deptId ? req.body.deptId : "";
    let action = req.body.action ? req.body.action : "";

    if (action == "remove") {
      let delete_data = await DepartmentUserAccess.destroy({
        where: { departmentId: deptId, userId: recordId },
      });
      return res
        .status(200)
        .json({ success: true, msg: "Data delete done.", data: delete_data });
    } else if (action == "add") {
      let check_exist = await DepartmentUserAccess.findOne({
        where: {
          departmentId: deptId,
          userId: recordId,
        },
      });

      if (check_exist) {
        return res
          .status(200)
          .json({ success: false, msg: "Data exist.", data: check_exist });
      }

      let set_data = {
        departmentId: deptId,
        userId: recordId,
      };
      let new_data = await DepartmentUserAccess.create(set_data);
      return res
        .status(200)
        .json({ success: true, msg: "Data add done.", data: new_data });
    } else {
      return res
        .status(400)
        .json({ success: false, msg: "Data information wrong." });
    }
  } catch (error) {
    return res.status(400).json({ success: false, msg: error.message });
  }
});

// Send Reset Password
router.post("/sendResetPassword", async (req, res) => {
  try {
    console.log("====================================");
    console.log("req.body:", req.body);
    console.log("====================================");
    let response_arr = [];
    let userId = req.body.userId ? req.body.userId : "";

    const newHash = auth.generatePassword();
    const newSalt = auth.generateSalt(64);

    await Login.update(
      { passwordHash: newHash, salt: newSalt },
      { where: { userId: userId } }
    );
    await User.update({ loginReset: new Date() }, { where: { id: userId } });
    const usr = await User.findByPk(userId);
    mail.sendMailNew(usr.eMail, newHash, usr.language); //usr.language
    return res
      .status(200)
      .json({ success: true, msg: "Mail has been sent successfully!" });
  } catch (error) {
    return res.status(400).json({ success: false, msg: error.message });
  }
});

// Get User's Login Activities
router.get("/loginActivitiesList/:id", async (req, res) => {
  try {
    console.log("====================================");
    console.log("req.body:", req.body);
    console.log("====================================");
    let response_arr = [];
    let recordId = req.params.id ? req.params.id : "";
    var timezone = req.query.timezone ? req.query.timezone : "Etc/UTC";

    let getData = await db.sequelize.query(
      `SELECT * FROM login_activities WHERE userId = ${recordId}`,
      { type: db.sequelize.QueryTypes.SELECT }
    );

    getData = getData.map((item) => {
      return {
        ...item,
        newLoginDateTime: item.loginDateTime
          ? moment(item.loginDateTime).tz(timezone).format("YYYY-MM-DD HH:mm A")
          : "",
      };
    });
    return res
      .status(200)
      .json({ success: true, msg: "Data get done.", list: getData });
  } catch (error) {
    return res.status(400).json({ success: false, msg: error.message });
  }
});

module.exports = router;
