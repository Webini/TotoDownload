"use strict";
module.exports = function(sequelize, DataTypes) {
  var TorrentsDownloaded = sequelize.define("TorrentsDownloaded", {
      torrentId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
      },
      userId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
      },
      vote: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true
      }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return TorrentsDownloaded;
};