'use strict';

module.exports = {
  up: function(migration, DataTypes) {
    return migration.changeColumn(
      'Torrents',
      'uploadedEver',
      {
        type: DataTypes.BIGINT,
        allowNull: true
      }
    );
  },

  down: function(migration, DataTypes) {
    return migration.changeColumn(
      'Torrents',
      'uploadedEver',
      {
        type: DataTypes.BIGINT,
        allowNull: true
      }
    );
  }
};
