"use strict";
module.exports = {
  up: function(migration, DataTypes, done) {
    migration.createTable("Users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER.UNSIGNED
      },
      nickname: {
        type: DataTypes.STRING(32),
        allowNull: false
      },
      email: {
        type: DataTypes.STRING(64),
        allowNull: false
      },
      salt: {
        type: DataTypes.STRING,
        allowNull: false
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      ip: {
        type: DataTypes.STRING(16),
        allowNull: true
      },
      roles: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0
      },
      uploadRatio: {
        type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 1
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    },{
        "charset": "utf8",
        "collate": "utf8_general_ci"
    });
      
    migration.addIndex(
        'Users',
        ['email'],
        {
            indexName: 'emailUnique',
            indicesType: 'UNIQUE'
        }
    );
      
    migration.addIndex(
        'Users',
        ['nickname'],
        {
            indexName: 'nicknameUnique',
            indicesType: 'UNIQUE'
        }
    );
      
    done();
  },
  down: function(migration, DataTypes, done) {
    migration.dropTable("Users").done(done);
  }
};