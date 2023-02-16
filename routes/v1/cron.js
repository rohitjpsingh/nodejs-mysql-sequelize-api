const express = require("express");
const db = require("../../models/index");
const { countries,license,licenseRole } = require("../../constants");
const router = {};

// Get Login Activities
router.saveLoginActivities = async () => {
  try {
    console.log("====================================");
    console.log("saveLoginActivities");
    console.log("====================================");
   
    // Get All Users Who have last login
    let getAllData = await db.sequelize.query(
        `SELECT * FROM (
          SELECT user.id,
          IFNULL(user.lastLogin, "" ) AS lastLogin,
          DATE_FORMAT(lastLogin,'%Y-%m-%d') AS loginDate,
          IFNULL(shield_login.superUser, 0 ) AS superUserText 
          FROM user LEFT JOIN shield_login ON shield_login.userId = user.id
        ) AS TEMP WHERE superUserText=0 AND lastLogin!=''`,
        { type: db.sequelize.QueryTypes.SELECT }
      );
      
      console.log("getAllData:",getAllData);

      for (const user of getAllData) {
        let userId     = user.id;
        let loginDate  = user.loginDate;
        let lastLogin  = user.lastLogin;

        // Check Same User On Same Date
        let getLoginActivities = await db.sequelize.query(
            `SELECT id FROM login_activities WHERE userId = '${userId}' AND loginDate = '${loginDate}'`,
        { type: db.sequelize.QueryTypes.SELECT }
        );
        // If available then update
        console.log("getLoginActivitiesL:",getLoginActivities.length);
        if(getLoginActivities.length > 0) {
            for (const lt of getLoginActivities) {
                // console.log("lt:",lt);
                let updateLoginActivities = await db.sequelize.query(`UPDATE login_activities SET loginDateTime='${lastLogin}' WHERE id='${lt.id}'`,
                    { type: db.sequelize.QueryTypes.UPDATE }
                );
                // console.log("updateLoginActivities:",updateLoginActivities);
            }           
        }
        // Not Available then insert
        else {
            let addLoginActivities = await db.sequelize.query(
                `INSERT INTO login_activities SET userId='${userId}',loginDate='${loginDate}',loginDateTime='${lastLogin}'`,
                { type: db.sequelize.QueryTypes.INSERT }
            );
        }
      }
  } catch (error) {
    console.log("error.message:",error.message);
  }
};
module.exports = router;