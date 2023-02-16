
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('company', {
        id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
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
        },
        billingMethod: {
            type: DataTypes.ENUM('epost', 'brev', 'efaktura'),
            allowNull: true
        },
        billingEmail: {
            type: DataTypes.STRING,
            allowNull: true
        },
        industry: {
            type: DataTypes.ENUM('Anläggning', 'Bygg', 'Byggvaruhandel', 'El', 'Fasad', 'Golv', 'Konsult', 'Mark', 'Mattläggning', 'Måleri', 'Plattsättning', 'Rivning', 'Städ', 'Tak', 'Undertak', 'Utbildning', 'VVS', 'Övrigt'),
            allowNull: true
        },
        notes: {
            type: DataTypes.STRING,
            allowNll: true
        }
    }, {
        tableName: 'company',
        timestamps: false,
    });
};
