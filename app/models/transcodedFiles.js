'use strict';
module.exports = function(sequelize, DataTypes) {
    var TranscodedFiles = sequelize.define('TranscodedFiles', {
        torrentId: DataTypes.INTEGER.UNSIGNED,
        file: {
            type: DataTypes.STRING(4096),
            allowNull: false
        },
        transcoded: {
            type: DataTypes.TEXT,
            allowNull: false
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
            // associations can be defined here
            }
        }
    });
    return TranscodedFiles;
};