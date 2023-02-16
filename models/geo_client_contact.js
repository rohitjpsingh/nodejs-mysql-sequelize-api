/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('geo_client_contact', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    geoClientId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'geo_client',
        key: 'id'
      }
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true
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
      allowNull: true
    }
  }, {
    tableName: 'geo_client_contact'
  });
};
