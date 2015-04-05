"use strict";
module.exports = {
  up: function(migration, DataTypes, done) {
    migration.createTable("Torrents", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER.UNSIGNED
      },
      userId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        references: 'Users',
        referenceKey: 'id',
        onDelete: 'restrict' //if we want to delete an user, we have to clean his torrents first
      },
      tid: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
      },
      syncTag: {
        type: DataTypes.INTEGER.UNSIGNED,
        default: 0,
        allowNull: true
      },
      hash: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      filesJson: {
        type: DataTypes.TEXT,
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
        type: DataTypes.STRING(32),
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
        allowNull: false
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
    }).then(function success(data){
        console.log(require('util').inspect(data));
    },
    function err(data){
        console.log(require('util').inspect(data));
    });
      
        
    migration.addIndex(
        'Torrents',
        ['hash'],
        {
            indexName: 'hashUnique',
            indicesType: 'UNIQUE'
        }
    );
    
    done();
  },
  down: function(migration, DataTypes, done) {
    migration.dropTable("Torrents").done(done);
  }
};