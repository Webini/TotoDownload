'use strict';

module.exports = {
  up: function(migration, DataTypes) {
    return migration.changeColumn(
      'Torrents',
      'eta',
      {
        type: DataTypes.BIGINT,
        allowNull: true
      }
    ).then(function() {
      return migration.changeColumn(
        'Torrents',
        'uploadedEver',
        {
          type: DataTypes.BIGINT,
          allowNull: true
        }
      );
    });
  },

  down: function(migration, DataTypes) {
    return migration.changeColumn(
      'Torrents',
      'eta',
      {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true
      }
    ).then(function() {
      return migration.changeColumn(
        'Torrents',
        'uploadedEver',
        {
          type: DataTypes.INTEGER,
          allowNull: true
        }
      );
    });
  }
};
