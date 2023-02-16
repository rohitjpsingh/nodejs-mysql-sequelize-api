/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('geo_estimate', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    geoProjectId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'geo_project',
        key: 'id'
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'geo_estimate'
  });
};
