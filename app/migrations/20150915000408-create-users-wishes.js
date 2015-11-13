'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('UsersWishes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED
      },
      userId: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        references: { model: 'Users', key: 'id'},
        onDelete: 'restrict' //if we want to delete an user, we have to clean his torrents first
      },
      movieId: {
        type: Sequelize.INTEGER
      },
      type: {
          type: Sequelize.INTEGER,
          allowNull: false
      },
      season: {
          type: Sequelize.INTEGER,
          allowNull: true
      },
      episode: {
          type: Sequelize.INTEGER,
          allowNull: true
      },
      releaseDate: {
        type: Sequelize.DATEONLY
      },
      title: {
        type: Sequelize.STRING
      },
      keywords: {
        type: Sequelize.STRING
      },
      poster: {
        type: Sequelize.STRING
      },
      synopsis: {
        type: Sequelize.STRING(2018)
      },
      synopsisShort: {
        type: Sequelize.STRING(1024)
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    },{
        "charset": "utf8",
        "collate": "utf8_general_ci"
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('UsersWishes');
  }
};