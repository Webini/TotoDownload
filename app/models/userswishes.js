'use strict';
module.exports = function(sequelize, DataTypes) {
    var UsersWishes = sequelize.define('UsersWishes', {
        userId: DataTypes.INTEGER,
        movieId: DataTypes.INTEGER,
        type: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        season: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        episode: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        releaseDate: DataTypes.DATEONLY,
        title: DataTypes.STRING,
        keywords: DataTypes.STRING,
        poster: DataTypes.STRING,
        synopsis: DataTypes.STRING(2018),
        synopsisShort: DataTypes.STRING(1024),
    }, {
        classMethods: {
            associate: function(models) {
            // associations can be defined here
            }
        }
    });
    return UsersWishes;
};