'use strict';

/**
 * 
                    release: result.release ? new Date(result.release.releaseDate) : null,
                    bluRayReleaseDate: result.bluRayReleaseDate ? new Date(result.bluRayReleaseDate) : null,
                    directors: (result.castingShort ? result.castingShort.directors : null),
                    actors: (result.castingShort ? result.castingShort.actors : null),
 */

module.exports = {
    up: function(migration, DataTypes, done) {
        return migration.addColumn(
            'Torrents',
            'release',
            {
                type: DataTypes.DATEONLY,
                allowNull: true
            }
        ).then(function(){
            return migration.addColumn(
                'Torrents',
                'bluRayReleaseDate',
                {
                    type: DataTypes.DATEONLY,
                    allowNull: true
                }
            );
        }).then(function(){
            return migration.addColumn(
                'Torrents',
                'directors',
                {
                    type: DataTypes.STRING(255),
                    allowNull: true
                }
            );
        }).then(function(){
            return migration.addColumn(
                'Torrents',
                'actors',
                {
                    type: DataTypes.STRING(255),
                    allowNull: true
                }
            );
        });
    },
    
    down: function(migration, DataTypes, done) {
        return migration.removeColumn(
            'Torrents',
            'release'
        ).then(function(){
            return migration.removeColumn(
                'Torrents',
                'bluRayReleaseDate'
            );
        }).then(function(){
            return migration.removeColumn(
                'Torrents',
                'directors'
            );
        }).then(function(){
            return migration.removeColumn(
                'Torrents',
                'actors'
            );
        });
    }
};
