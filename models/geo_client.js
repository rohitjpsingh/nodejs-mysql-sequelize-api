/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('geo_client', {
        id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        companyId: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            references: {
                model: 'company',
                key: 'id'
            }
        },
        number: {
            type: DataTypes.STRING,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        vatNumber: {
            type: DataTypes.STRING,
            allowNull: true
        },
        visitingAddress1: {
            type: DataTypes.STRING,
            allowNull: true
        },
        visitingAddress2: {
            type: DataTypes.STRING,
            allowNull: true
        },
        visitingPostCode: {
            type: DataTypes.STRING,
            allowNull: true
        },
        visitingCity: {
            type: DataTypes.STRING,
            allowNull: true
        },
        visitingCountry: {
            type: DataTypes.STRING,
            allowNull: true
        },
        billingAddress1: {
            type: DataTypes.STRING,
            allowNull: true
        },
        billingAddress2: {
            type: DataTypes.STRING,
            allowNull: true
        },
        billingPostCode: {
            type: DataTypes.STRING,
            allowNull: true
        },
        billingCity: {
            type: DataTypes.STRING,
            allowNull: true
        },
        billingCountry: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        tableName: 'geo_client',
        timestamps: false,
    });
};
