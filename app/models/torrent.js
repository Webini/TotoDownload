"use strict";
module.exports = function(sequelize, DataTypes) {
  var Torrent = sequelize.define("Torrent", {
    name: DataTypes.STRING,
    hash: DataTypes.STRING,
    tid: DataTypes.INTEGER,
    allocineId: DataTypes.INTEGER,
    image: DataTypes.STRING,
    description: DataTypes.STRING,
    title: DataTypes.STRING,
    video: DataTypes.STRING,
    uploader: DataTypes.INTEGER,
    zip: DataTypes.BOOLEAN,
    size: DataTypes.INTEGER,
    status: DataTypes.INTEGER,
    error: DataTypes.STRING,
    type: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Torrent;
};