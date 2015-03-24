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
        //onDelete: 'restrict' //if we want to delete an user, we have to clean his torrents first
      },
      tid: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
      },
      hash: {
        type: DataTypes.STRING(32),
        allowNull: false
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      allocineId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true
      },
      image: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      description: {
        type: DataTypes.STRING(255),
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
      title: { 
        type: DataTypes.STRING(255),
        allowNull: true
      },
      video: {
        type: DataTypes.STRING(255),
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


    migration.addIndex(
        'Torrents',
        ['tid'],
        {
            indexName: 'tidUnique',
            indicesType: 'UNIQUE'
        }
    );
      
    done();
  },
  down: function(migration, DataTypes, done) {
    migration.dropTable("Torrents").done(done);
  }
};