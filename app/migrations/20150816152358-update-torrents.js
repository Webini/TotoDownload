'use strict';

module.exports = {
  up: function(migration, DataTypes) {
    return migration.changeColumn(
      'Torrents',
      'filesJson',
      {
        type: DataTypes.TEXT('MEDIUM'),
        allowNull: true
      }
    );
  },

  down: function(migration, DataTypes) {
    return migration.changeColumn(
      'Torrents',
      'filesJson',
      {
        type: DataTypes.TEXT,
        allowNull: true
      }
    );
  }
};
