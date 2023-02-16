/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('geo_feature', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    geoEstimateId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'geo_estimate',
        key: 'id'
      }
    },
    parentId: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'geo_feature',
        key: 'id'
      }
    },
    fileId: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'geo_file',
        key: 'id'
      }
    },
    page: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    geojson: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'geo_feature'
  });
};
