"use strict";
module.exports = function(sequelize, DataTypes) {
  var _ = require('underscore');
    
  var Torrent = sequelize.define("Torrent", {
      userId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true
      },
      tid: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
      },
      hash: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
      },
      syncTag: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        default: 0
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      filesJson: {
        type: DataTypes.TEXT('MEDIUM'),
        allowNull: true
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
      guessedEpisode: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      guessedSeason: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      zip: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      eta: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true
      },
      status: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: true
      },
      error: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true
      },
      errorString: {
        type: DataTypes.STRING(1024),
        allowNull: true
      },
      downloadDir: {
        type: DataTypes.STRING(512),
        allowNull: true
      },
      isFinished: {
        type: DataTypes.BOOLEAN,
        defaults: false,
        allowNull: true
      },
      isStalled: {
        type: DataTypes.BOOLEAN,
        defaults: false,
        allowNull: true
      },
      desiredAvailable: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true
      },
      leftUntilDone: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true,
      },
      sizeWhenDone: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true
      },
      totalSize: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true
      },
      magnetLink: {
        type: DataTypes.STRING(2048),
        allowNull: true
      },
      uploadedEver: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      seedRatioLimit: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      seedRatioMode: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      uploadRatio: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
      trackersJson: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      peersConnected: {
         type: DataTypes.INTEGER.UNSIGNED,
         allowNull: true
      },
      peersSendingToUs: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true
      },
      peersGettingFromUs: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true
      },
      rateDownload: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true
      },
      rateUpload: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true
      },
      activityDate: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true
      },
      files: DataTypes.VIRTUAL,
      trackers: DataTypes.VIRTUAL
  }, {
    classMethods: {
      associate: function(models) {
      }
    },
    getterMethods: {
        trackers: function(){
            return JSON.parse(this.trackersJson);
        },
        files: function(){
          try{
            return JSON.parse(this.filesJson);    
          }
          catch(e){
            return [ { 
              'name': 'Limit exceeded',
              'bytesCompleted': 0,
              'length': 426976
            } ];
          }
        },
        public: function(){
            //maybe perf issues
            var values = _.extend({
                trackers: this.trackers,
                files: this.files
            }, this.dataValues);
            
            delete values['filesJson'];
            delete values['trackersJson'];
            return values;
        }
    },
    setterMethods: {
        trackers: function(data){
            this.trackersJson = JSON.stringify(data);    
        },
        files: function(data){
            this.filesJson = JSON.stringify(data);    
        }
    }
  });
  return Torrent;
};