/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
    var m = sequelize.define('user', {
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
        active: {
            type: DataTypes.INTEGER(1),
            allowNull: true,
            defaultValue: "1"
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        telephone: {
            type: DataTypes.STRING,
            allowNull: true
        },
        mobile: {
            type: DataTypes.STRING,
            allowNull: true
        },
        eMail: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        firstRegistered: {
            type: DataTypes.DATE,
            allowNull: true
        },
        loginReset: {
            type: DataTypes.DATE,
            allowNull: true
        },
        lastLogin: {
            type: DataTypes.DATE,
            allowNull: true
        },
        newsletter: {
            type: DataTypes.INTEGER(1),
            allowNull: true,
            defaultValue: "1"
        },
        importantInformation: {
            type: DataTypes.INTEGER(1),
            allowNull: true,
            defaultValue: "1"
        },
        license: {
            type: DataTypes.ENUM('trial', 'trial-expired', '30-days', '90-days', '365-days', 'developer', 'sales', 'educational', 'other', 'cancelled'),
            allowNull: true
        },
        licenseExpiryDate: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        language: {
            type: DataTypes.STRING,
            allowNull: false
        },
        contractNumber: {
            type: DataTypes.STRING,
            allowNull: true
        },
        orderNumber: {
            type: DataTypes.STRING,
            allowNull: true
        },
        licenseRole: {
            type: DataTypes.ENUM('creator', 'viewer'),
            allowNull: true
        },
        notes: {
            type: DataTypes.STRING,
            allowNll: true
        }
    }, {
        tableName: 'user',
        timestamps: false,
    });

    m.associate = function(models) {
        m.belongsTo(models.company, {foreignKey: 'companyId'});
    }
    return m;
};
