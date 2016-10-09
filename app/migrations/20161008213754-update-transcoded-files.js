'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
     return queryInterface.addColumn(
        'TranscodedFiles',
        'subtitlesJson',
        {
            type: Sequelize.TEXT,
            allowNull: true
        }
     );
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn(
        'TranscodedFiles',
        'subtitlesJson'
    ); 
  }
};
