'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
     return queryInterface.addColumn(
        'TranscodedFiles',
        'thumbsMeta',
        {
            type: Sequelize.TEXT,
            allowNull: true
        }
     );
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn(
      'TranscodedFiles',
      'thumbsMeta',
      {
        type: Sequelize.STRING(255),
        allowNull: true
      }
    );
  }
};
