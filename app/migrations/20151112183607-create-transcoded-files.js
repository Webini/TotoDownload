'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('TranscodedFiles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED
      },
      torrentId: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        references: { model: 'Torrents', key: 'id' },
        onDelete: 'cascade'
      },
      name: {
        type: Sequelize.STRING(4096),
        allowNull: false
      },
      transcoded: {
          type: Sequelize.TEXT,
          allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    },{
        "charset": "utf8",
        "collate": "utf8_general_ci"
    }).then(function(){  
        return queryInterface.addColumn(
            'Torrents',
            'transcodableState',
            {
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: true,
                defaultValue: 0
            }
        );
    });
  },
  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('TranscodedFiles').then(function(){
        return Sequelize.removeColumn(
            'Torrents',
            'transcodableState'
        );
    });
  }
};
