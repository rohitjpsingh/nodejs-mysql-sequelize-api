/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('geo_project_client_contact', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    geoProject: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'geo_project',
        key: 'id'
      }
    },
    geoClientContact: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'geo_client_contact',
        key: 'id'
      }
    }
  }, {
    tableName: 'geo_project_client_contact'
  });
};
