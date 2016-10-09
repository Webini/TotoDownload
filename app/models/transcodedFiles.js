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
        subtitlesJson: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        createdAt: {
            allowNull: false,
            type: DataTypes.DATE
        },
        thumbsMeta: {
            allowNull: true,
            type: DataTypes.STRING(255)
        }
    }, {
        timestamps: false,
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
            },
            thumbs: function(){
                try{
                    return JSON.parse(this.thumbsMeta);    
                }
                catch(e){
                    return {};
                }
            },
            subtitles: function(){
                try{
                    return JSON.parse(this.subtitlesJson);    
                }
                catch(e){
                    return {};
                }
            }
        },
        setterMethods: {
            transcoded: function(data){
                this.transcodedJson = JSON.stringify(data);    
            },
            thumbs: function(data){
                this.thumbsMeta = JSON.stringify(data);
            },
            subtitles: function(data) {
                this.subtitlesJson = JSON.stringify(data);
            }
        }
    });
    return TranscodedFiles;
};