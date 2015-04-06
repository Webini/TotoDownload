module.exports = ['DownloadService', (function(){
    var app             = require(__dirname + '/../app.js');
    var $q              = require('q');
    var path            = require('path');
    
    function DownloadService(){}
    
    DownloadService._getDownloadLink = function(torrent, file, user){
        return {
            torrent: torrent,
            segment: //segment d'url a dl, on doit passer au moins un hash pour éviter qu'un mec puisse deviner l'url via le hash torrent, 
                     //mais il doit être constant pour qu'il downloader a la flashget marche sans faire chier
        
        };
    };
    
    /**
    * Retreive the download link 
    * Set in database that the torrent was downloaded
    * @return promise
    **/
    DownloadService.getDownloadLink = function(torrentHash, userId, userHash, fileId){
        return app.services.UserService.get(userId).then(
            //check if this user is valid
            function success(user){
                if(user.downloadHash == userHash){
                    var torrent = app.services.TorrentService.getFromMemory(torrentHash);
                    if(!torrent || !torrent.files[fileId])
                        return $q.reject('Torrent not found');
                    
                    //if ok we retreive the download link
                    return DownloadService._getDownloadLink(torrent, torrent.files[fileId], user);
                }
                else   
                    return $q.reject('Invalid userHash');
            }
        ).then(
            //if we have the download link, we update database with one new download from this user for the torrent X
            function success(result){
                
                
            }
        );
    };
    
    /**
    * Retreive the local file link 
    * @return promise
    **/
    DownloadService.getLocalFileLink = function(torrentHash, fileId){
        
        
    };
    
})];