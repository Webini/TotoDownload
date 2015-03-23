"use strict";
module.exports = {
  up: function(migration, DataTypes, done) {
    migration.createTable("Torrents", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      name: {
        type: DataTypes.STRING
      },
      hash: {
        type: DataTypes.STRING
      },
      tid: {
        type: DataTypes.INTEGER
      },
      allocineId: {
        type: DataTypes.INTEGER
      },
      image: {
        type: DataTypes.STRING
      },
      description: {
        type: DataTypes.STRING
      },
      title: {
        type: DataTypes.STRING
      },
      video: {
        type: DataTypes.STRING
      },
      uploader: {
        type: DataTypes.INTEGER
      },
      zip: {
        type: DataTypes.BOOLEAN
      },
      size: {
        type: DataTypes.INTEGER
      },
      status: {
        type: DataTypes.INTEGER
      },
      error: {
        type: DataTypes.STRING
      },
      type: {
        type: DataTypes.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    }).done(done);
  },
  down: function(migration, DataTypes, done) {
    migration.dropTable("Torrents").done(done);
  }
};