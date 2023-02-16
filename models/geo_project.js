/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('geo_project', {
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
    projectNumber: {
      type: DataTypes.STRING,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    address1: {
      type: DataTypes.STRING,
      allowNull: true
    },
    address2: {
      type: DataTypes.STRING,
      allowNull: true
    },
    postCode: {
      type: DataTypes.STRING,
      allowNull: true
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false
    },
    deleted: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      defaultValue: "0"
    },
    geoClientId: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'geo_client',
        key: 'id'
      }
    },
    projectLeaderId: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    currency: {
      type: DataTypes.ENUM('SEK','DKK','NOK','EUR','USD'),
      allowNull: true
    },
    units: {
      type: DataTypes.ENUM('metric','imperial'),
      allowNull: false,
      defaultValue: "metric"
    }
  }, {
    tableName: 'geo_project'
  });
};
