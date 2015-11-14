'use strict';
module.exports = function(sequelize, DataTypes) {
    var TranscodedFiles = sequelize.define('TranscodedFiles', {
        torrentId: DataTypes.INTEGER.UNSIGNED,
        name: {
            type: DataTypes.STRING(4096),
            allowNull: false
        },
        transcodedJson: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        createdAt: {
            allowNull: false,
            type: DataTypes.DATE
        }
    }, {
        classMethods: {
            associate: function(models) {
                TranscodedFiles.belongsTo(models.Torrent, {
                    onDelete: "CASCADE"
                });
            }
        },
        getterMethods: {
            transcoded: function(){
                try{
                    return JSON.parse(this.transcodedJson);    
                }
                catch(e){
                    return [];
                }
            }
        },
        setterMethods: {
            transcoded: function(data){
                this.transcodedJson = JSON.stringify(data);    
            }
        }
    });
    return TranscodedFiles;
};