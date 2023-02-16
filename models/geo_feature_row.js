/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('geo_feature_row', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    geoFeatureId: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'geo_feature',
        key: 'id'
      }
    },
    rowNumber: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    segment: {
      type: DataTypes.STRING,
      allowNull: true
    },
    action: {
      type: DataTypes.STRING,
      allowNull: true
    },
    material: {
      type: DataTypes.STRING,
      allowNull: true
    },
    amount: {
      type: DataTypes.STRING,
      allowNull: true
    },
    pricePerUnit: {
      type: "DOUBLE",
      allowNull: true
    },
    timePerUnit: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    }
  }, {
    tableName: 'geo_feature_row'
  });
};
