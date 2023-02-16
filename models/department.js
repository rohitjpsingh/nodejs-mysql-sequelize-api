
module.exports = function (sequelize, DataTypes) {
    var m = sequelize.define('department', {
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
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        tableName: 'department',
        timestamps: false
    });
    m.associate = function(models) {
        m.belongsTo(models.company, {foreignKey: 'companyId'});
    }
    return m;
};
