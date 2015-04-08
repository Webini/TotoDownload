"use strict";

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    nickname: {
        type: DataTypes.STRING(32),
        allowNull: false,
        validate: {
            len: [ 2, 32 ]
        }
    },
    email: {
        type: DataTypes.STRING(64),
        allowNull: false,
        validate: {
            isEmail: true
        }
    },                        
    salt: {
        type: DataTypes.STRING(32),
        allowNull: false
    },
    passwordC: {
        type: DataTypes.VIRTUAL,
        allowNull: false,
        validate: {
            len: [ 4, 64 ]
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    uploadRatio: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    ip: {
        type: DataTypes.STRING(16),
        allowNull: true
    },
    roles: {
        type: DataTypes.INTEGER.UNSIGNED
    },
    downloadHash: {
        allowNull: false,
        type: DataTypes.STRING(32)
    },
    diskSpace: {
        allowNull: false,
        type: DataTypes.INTEGER.UNSIGNED
    }, 
    diskUsage: {
        allowNull: false,
        type: DataTypes.INTEGER.UNSIGNED
    }
  }, 
  {
      getterMethods   : {
          public: function(){
              return {
                  id: this.id,
                  nickname: this.nickname,
                  roles: this.roles,
                  uploadRatio: this.uploadRatio,
                  diskSpace: this.diskSpace,
                  diskUsage: this.diskUsage
              };
          }
      },
      classMethods: {
        associate: function(models) {
          //  models['User'].hasMany(models['Torrent'], { as: 'torrents', through: 'uid' });
        }
      }
  });
  return User;
};