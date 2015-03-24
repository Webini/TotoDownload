"use strict";
module.exports = function(sequelize, DataTypes) {
  var Torrent = sequelize.define("Torrent", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER.UNSIGNED
      },
      userId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      hash: {
        type: DataTypes.STRING(32),
        allowNull: false
      },
      tid: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
      },
      allocineId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true
      },
      image: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      description: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      guessedTitle: {
          type: DataTypes.STRING(255),
          allowNull: true
      },
      guessedType: {
        type: DataTypes.STRING(32),
        allowNull: true
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      video: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      zip: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      size: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true
      },
      status: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
      },
      error: {
        type: DataTypes.STRING(1024),
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
  }, {
    classMethods: {
      associate: function(models) {
      }
    }
  });
  return Torrent;
};