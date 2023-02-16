var auth = require('../utils/authentication');

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('login', {
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
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        signature: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        theKey: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        passwordHash: {
            type: "BINARY(64)",
            allowNull: true
        },
        salt: {
            type: "BINARY(64)",
            allowNull: true
        }
    }, {
        tableName: 'login',
        timestamps: false,
        hooks: {
            beforeValidate: function(login, options) {
                login.passwordHash = login.passwordHash ? auth.generateHash(login.passwordHash,login.salt) : null;
            }
        }
    });
};