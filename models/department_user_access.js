module.exports = function (sequelize, DataTypes) {
    var m = sequelize.define('department_user_access', {
        id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        departmentId: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            references: {
                model: 'department',
                key: 'id'
            }
        },
        userId: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            references: {
                model: 'user',
                key: 'id'
            }
        }
    }, {
        tableName: 'department_user_access',
        timestamps: false,
    });

    m.associate = function(models) {
        m.belongsTo(models.department, {foreignKey: 'departmentId'});
        m.belongsTo(models.user, {foreignKey: 'userId'});
    }
    return m;
};
