module.exports = ['TorrentsDownloadedService', (function(){
    var app           = require(__dirname + '/../app.js');
    var $q            = require('q');
    
    function tdlService(){};
    
    
    /**
     * Retreive best downloads 
     * @param int userId User ID
     * @param bool withPosterOnly if we retreive only torrents with poster
     * @return promise
     */
    tdlService.getBestDownloads = function(userId, withPosterOnly, moviesOnly, limit){
        var parameters = {
            userId: userId
        };
        
        if(limit){
            parameters.limit = limit;
        }
        
        return app.orm.sequelize.query('                 \
            SELECT                                       \
                tdl.torrentId,                           \
                Torrents.hash as hash,                    \
                count(tdl.id) as downloaded              \
            FROM                                         \
                TorrentsDownloadeds AS tdl               \
            LEFT JOIN                                    \
                Torrents ON Torrents.id = tdl.torrentId  \
            WHERE                                        '
         + (moviesOnly ? 'Torrents.guessedType = \'movie\' AND' : '') + ' \
                (                                        \
                    SELECT                               \
                        mdl.torrentId                    \
                    FROM                                 \
                        TorrentsDownloadeds as mdl       \
                    WHERE                                \
                        mdl.userId = :userId AND         \
                        mdl.torrentId = tdl.torrentID    \
                    LIMIT 1                              \
                ) IS NULL                                '
            + (withPosterOnly ? ' AND Torrents.poster IS NOT NULL' : '') + '\
            GROUP BY                                     \
                tdl.torrentId                            \
            ORDER BY                                     \
                downloaded DESC,                         \
                Torrents.year DESC                       '
            + (limit ? ' LIMIT :limit' : ''), 
            { replacements: parameters, type: app.orm.sequelize.QueryTypes.SELECT });
    };
    
    /**
    * Add a download in database to userId for torrentId
    * @return promise
    **/
    tdlService.addDownload = function(torrentId, userId){
        return app.orm.TorrentsDownloaded.find({ where: { torrentId: torrentId, userId: userId } }).then(
            function(tdl){
                if(tdl == null){ //create a new entry
                    return app.orm.TorrentsDownloaded.create({
                        userId: userId,
                        torrentId: torrentId,
                        downloads: 1
                    });
                }
                else{ //update existing entry
                    tdl.downloads += 1;
                    return tdl.save();
                }
            }
        );
    };
    
    
    return tdlService;
})()];
    