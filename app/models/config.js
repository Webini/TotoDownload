"use strict";
module.exports = function(sequelize, DataTypes) {
  var Config = sequelize.define("Config", {
      key: {
        type: DataTypes.STRING,
        allowNull: false
      },
      value: {
        type: DataTypes.STRING(1024),
        allowNull: false
      }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Config;
};