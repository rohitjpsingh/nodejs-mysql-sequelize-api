var auth = require('../utils/authentication');

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('login_activities', {
        id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            references: {
                model: 'user',
                key: 'id'
            }
        },
        loginDate: {
            type: DataTypes.DATEONLY                    ,
            allowNull: true
        },
        loginDateTime: {
            type: DataTypes.DATE,
            allowNull: true
        },
        created: {
            type: DataTypes.DATE,
            allowNull: false
        }
    }, {
        tableName: 'login_activities',
        timestamps: false,
    });
};