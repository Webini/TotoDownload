module.exports = ['TorrentsDownloadedService', (function(){
    var app           = require(__dirname + '/../app.js');
    var $q            = require('q');
    
    function tdlService(){};
    
    
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
    