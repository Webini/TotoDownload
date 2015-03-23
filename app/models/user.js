"use strict";

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
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
    ip: {
        type: DataTypes.STRING(16),
        allowNull: true
    },
    roles: {
        type: DataTypes.INTEGER.UNSIGNED
    }
  }, {
    getterMethods   : {
        public: function(){
            return {
                email: this.email,
                id: this.id,
                nickname: this.nickname,
                createdAt: this.createdAt,
                updatedAt: this.updatedAt,
                roles: this.roles,
                ip: this.ip
            };
        }
    },
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return User;
};