
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('company_industry', {
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
        industry: {
            type: DataTypes.ENUM('Anläggning', 'Bygg', 'Byggvaruhandel', 'El', 'Fasad', 'Golv', 'Konsult', 'Mark', 'Mattläggning', 'Måleri', 'Plattsättning', 'Rivning', 'Städ', 'Tak', 'Undertak', 'Utbildning', 'VVS', 'Övrigt'),
            allowNull: false
        }
    }, {
        tableName: 'company_industry',
        timestamps: false,
    });
};
