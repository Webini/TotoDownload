"use strict";
module.exports = function(sequelize, DataTypes) {
  var Torrent = sequelize.define("Torrent", {
      userId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true
      },
      tid: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        unique: 'tidUnique'
      },
      hash: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: 'hashUnique'
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      movieId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true
      },
      runtime: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      title: { 
        type: DataTypes.STRING(255),
        allowNull: true
      },
      genre: {
        type: DataTypes.STRING(128),
        allowNull: true
      },
      keywords: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      year: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      poster: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      synopsis: {
        type: DataTypes.STRING(2048),
        allowNull: true
      },
      synopsisShort: {
        type: DataTypes.STRING(1024)      
      },
      trailer: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      screenSize: {
        type: DataTypes.STRING(16),
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
      }
  }, {
    classMethods: {
      associate: function(models) {
      }
    }
  });
  return Torrent;
};