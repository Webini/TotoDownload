'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn(
      'Torrents',
      'magnetLink',
      {
        type: Sequelize.STRING(8096),
        allowNull: true
      }
    );
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn(
      'Torrents',
      'magnetLink',
      {
        type: Sequelize.STRING(8096),
        allowNull: true
      }
    );
  }
};
