var auth = require('../utils/authentication');

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('shield_login', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true
    },
    passwordHash: {
      type: "BINARY(64)",
      allowNull: true
    },
    salt: {
      type: "BINARY(64)",
      allowNull: true
    },
    userId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'user',
        key: 'id'
      }
    },
    webToken: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    webTokenSign: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    lastEdited: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    lastEditedBy: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    created: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    createdBy: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    resetToken: {
      type: "BINARY(64)",
      allowNull: true
    },
    resetExpiryDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    superUser: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      defaultValue: "0"
    }
  }, {
    tableName: 'shield_login',
      timestamps: false,
      hooks: {
          beforeValidate: function(shieldLogin, options) {
              shieldLogin.passwordHash = shieldLogin.passwordHash ? auth.generateShieldHash(shieldLogin.passwordHash,shieldLogin.salt) : null;
          }
      }
  });
};
