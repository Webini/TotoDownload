"use strict";
module.exports = {
  up: function(migration, DataTypes, done) {
    migration.createTable("Configs", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      key: {
        type: DataTypes.STRING,
        allowNull: false
      },
      value: {
        type: DataTypes.STRING(1024),
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
    },{
        "charset": "utf8",
        "collate": "utf8_general_ci"
    }).then(function(){
        return migration.addIndex(
            'Configs',
            ['key'],
            {
                indexName: 'keyIndex'
            }
        );       
    }).then(function(){
        migration.sequelize.query("INSERT INTO Configs(`key`, `value`) values('downloadTTL', '172800');"); 
        migration.sequelize.query("INSERT INTO Configs(`key`, `value`) values('diskSpaceProtected', '50');"); 
        migration.sequelize.query("INSERT INTO Configs(`key`, `value`) values('downloadDir', '/home/download');"); 
    }).done(done);
  },
  down: function(migration, DataTypes, done) {
    migration.dropTable("Configs").done(done);
  }
};