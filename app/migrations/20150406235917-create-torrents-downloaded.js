"use strict";
module.exports = {
  up: function(migration, DataTypes, done) {
    migration.createTable("TorrentsDownloadeds", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER.UNSIGNED
      },
      torrentId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: 'Torrents',
        referenceKey: 'id',
        onDelete: 'cascade'
      },
      userId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: 'Users',
        referenceKey: 'id',
        onDelete: 'cascade'
      },
      vote: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true
      },
      downloads: {
        type: DataTypes.INTEGER.UNSIGNED,
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
        'TorrentsDownloadeds',
        ['userId'],
        {
            indexName: 'userIdIndex'
        }
    ).done(done);
  },
  down: function(migration, DataTypes, done) {
    migration.dropTable("TorrentsDownloadeds").done(done);
  }
};