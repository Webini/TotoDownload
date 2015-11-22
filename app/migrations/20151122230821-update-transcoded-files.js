'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
     return queryInterface.addColumn(
        'TranscodedFiles',
        'thumbsMeta',
        {
            type: Sequelize.STRING(255),
            allowNull: true
        }
     );
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn(
        'TranscodedFiles',
        'thumbsMeta'
    ); 
  }
};
