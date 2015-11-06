module.exports = ['DownloadService', (function(){
    var app             = require(__dirname + '/../app.js');
    var $q              = require('q');
    var path            = require('path');
    
    function DownloadService(){}
    
    
    /**
    * Retreive the filepath for a give torrent's file
    * @param callback callback node function(error, response)
    * @return void
    **/
    DownloadService.getLocalPath = function(torrentHash, hashTTL, ttl, fileId, callback){
        var defer = $q.defer();
        var assertTTLHash = this._generateExpirationHash(ttl);
        
        if(assertTTLHash != hashTTL)
            return callback('Invalid TTL');
        
        var torrent = app.services.TorrentService.getFromMemory(torrentHash);
        if(!torrent)
            return callback('Torrent not found');
        
        if(!torrent.files[fileId])
            return callback('File not found');
        
        return callback(null, path.join(
            torrent.downloadDir,
            torrent.files[fileId].name
        ));
        
    };
    
    /**
    * generate expiration hash
    * @param int expiration timestamp
    * @return string
    **/
    DownloadService._generateExpirationHash = function(expiration, useBase64){
        if(!useBase64){
            return app.services.CryptoService.createMd5Hash(expiration + app.config.secret.download);
        }
        
        return app.services.CryptoService.createMd5HashInBase64(expiration + app.config.secret.download);
    };
    
    /**
    * Generate the public file link
    **/
    DownloadService._generatePublicLink = function(torrent, fileId, user){
        return app.services.ConfigService.get('downloadTTL').then(
            function(conf){
                var downloadConf = app.config.download;
                var expiration = (parseInt(Date.now() / 1000) + parseInt(conf.value)).toString();
                var linkTTLHash = encodeURIComponent(DownloadService._generateExpirationHash(expiration, downloadConf.useServer));
                var fileSegments = torrent.files[fileId].name.split('/');
                
                var segment = '/' + torrent.hash + '/' + linkTTLHash + '/' + fileId + '/' + expiration + '/';
                if(downloadConf.useServer){ //if we are using dedicated webserver
                    
                    segment = (downloadConf.ssl ? 'https' : 'http') + '://' + 
                              downloadConf.host + 
                              (downloadConf['port'] !== undefined ? ':' + downloadConf.port : '') + 
                              (downloadConf['basepath'] !== undefined ? ':' + path.normalize(downloadConf.basepath) : '')
                              + segment + encodeURI(torrent.files[fileId].name);
                }
                else{ //else serve the files
                    segment = '/torrents/download/raw' + segment + encodeURIComponent(fileSegments[fileSegments.length-1]);  
                }
                
                return {
                    torrent: torrent,
                    fileId: fileId,
                    uri: segment, //'/' + torrent.hash + '/' + linkTTLHash + '/' + fileId + '/' + expiration + '/' + encodeURIComponent(fileSegments[fileSegments.length-1]),
                    user: user
                };
            }
        );
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
                if(user.downloadHash == userHash && user.id == userId){
                    var torrent = app.services.TorrentService.getFromMemory(torrentHash);
                    if(!torrent || !torrent.files[fileId])
                        return $q.reject('Torrent not found');
                    
                    if(torrent.files[fileId].length !== torrent.files[fileId].bytesCompleted)
                        return $q.reject('File not finished');
                        
                    //if ok we retreive the download link
                    return DownloadService._generatePublicLink(torrent, fileId, user);
                }
                else
                    return $q.reject('Invalid userHash');
            }
        )
        .then(function(linkData){ //save the download in database
            app.services.TorrentsDownloadedService.addDownload(linkData.torrent.id, linkData.user.id);
            return linkData.uri;
        });       
    };
    
    return DownloadService;
})()];
