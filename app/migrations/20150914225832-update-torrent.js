'use strict';

module.exports = {
    up: function(migration, DataTypes) {
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
    
    down: function(migration, DataTypes) {
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
