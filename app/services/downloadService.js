module.exports = ['DownloadService', (function(){
    var app                       = require(__dirname + '/../app.js');
    var $q                        = require('q');
    var path                      = require('path');
    var _                         = require('underscore');
    var TranscodingService        = null;
    var TorrentsTranscoderService = null;
    
    var config = {
        "useServer": false,
        "host": "localhost", 
        "port": 80, 
        "ssl": false, 
        "dlBasepath": null, 
        "streamBasepath": null,
        "hlsBasepath": null
    };
    
    _.extend(config, app.config.download);
    
    function DownloadService(){}
    
    DownloadService.ready = function(){
        TranscodingService        = app.services.TranscodingService;
        TorrentsTranscoderService = app.services.TorrentsTranscoderService;
    };
    
    /**
    * Retreive the filepath for a give torrent's file
    * @param callback callback node function(error, response)
    * @return void
    **/
    DownloadService.getLocalPath = function(torrentHash, hashTTL, ttl, fileId, callback){
        var defer = $q.defer(); //<= LOL
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
     * Retreive local stream path
     * @return promise
     */
    DownloadService.getStreamLocalPath = function(torrentHash, hashTTL, ttl, fileId, quality){
        var assertTTLHash = this._generateExpirationHash(ttl);
        
        if(assertTTLHash != hashTTL)
            return $q.reject('Invalid TTL', 404);
        
        var torrent = app.services.TorrentService.getFromMemory(torrentHash);
        if(!torrent)
            return $q.reject('Torrent not found', 404);
        
        return torrent.getTranscodedFile(fileId)
                      .then(function(file){
                          var fileInfos = file.transcoded[quality];
                          if(!fileInfos){
                              return $q.reject('Quality not found', 403);
                          }
                            
                          return {
                              path: TorrentsTranscoderService.getFullPath(fileInfos.path),
                              name: file.name + '.' + quality + '.mp4'
                          };
                      });       
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
                var expiration = (parseInt(Date.now() / 1000) + parseInt(conf.value)).toString();
                var linkTTLHash = encodeURIComponent(DownloadService._generateExpirationHash(expiration, config.useServer));
                
                var segment = '/' + torrent.hash + '/' + linkTTLHash + '/' + fileId + '/' + expiration + '/';
                if(config.useServer){ //if we are using dedicated webserver
                    
                    segment = (config.ssl ? 'https' : 'http') + '://' + 
                              config.host + 
                              (config.port == 80 ? '' : ':' + config.port) + 
                              (config.dlBasepath ? path.normalize('/' + config.dlBasepath) : '')
                              + segment + encodeURI(torrent.files[fileId].name);
                }
                else{ //else serve the files
                    var fileSegments = torrent.files[fileId].name.split('/');
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
    * Generate the public stream link
    * @return promise
    **/
    DownloadService._generatePublicStreamLink = function(torrent, file, quality, user, hls){
        if(!file.transcoded[quality]){
            return $q.reject('Quality not found', 404);
        }
        
        return app.services.ConfigService.get('downloadTTL').then(
            function(conf){
                var expiration = (parseInt(Date.now() / 1000) + parseInt(conf.value)).toString();
                var linkTTLHash = encodeURIComponent(DownloadService._generateExpirationHash(expiration, config.useServer));
                
                var segment = '/' + torrent.hash + '/' + linkTTLHash + '/' + file.id + '/' + quality + '/' + expiration + '/';
                if(config.useServer){ //if we are using dedicated webserver
                    var basepath = (hls ? config.hlsBasepath : config.streamBasepath);
                    
                    segment = (config.ssl ? 'https' : 'http') + '://' + 
                              config.host + 
                              (config.port == 80 ? '' : ':' + config.port) + 
                              (basepath ? path.normalize('/' + basepath) : '')
                              + segment + encodeURI(file.name) + (hls ? '.m3u8' : '');
                }
                else{ //else serve the files
                    var fileSegments = file.name.split('/');
                    segment = '/torrents/stream/download/raw' + segment + encodeURIComponent(fileSegments[fileSegments.length-1]);  
                }
                
                return {
                    torrent: torrent,
                    file: file,
                    uri: segment, //'/' + torrent.hash + '/' + linkTTLHash + '/' + fileId + '/' + expiration + '/' + encodeURIComponent(fileSegments[fileSegments.length-1]),
                    user: user
                };
            }
        );
    };   
    
    /**
    * Retreive the download link for a stream file
    * @return promise
    **/
    DownloadService.getStreamLink = function(torrentHash, userId, userHash, fileId, quality, hls){
        return app.services.UserService.get(userId).then(
            //check if this user is valid
            function success(user){
                if(user.downloadHash == userHash && user.id == userId){
                    var torrent = app.services.TorrentService.getFromMemory(torrentHash);
                    if(!torrent)
                        return $q.reject('Torrent not found', 404);
                        
                    if(!TranscodingService.qualityExists(quality)){
                        return $q.rejec('Quality not found', 404);
                    }
                    
                    return torrent.getTranscodedFile(fileId)
                                  .then(function(file){
                                      return DownloadService._generatePublicStreamLink(torrent, file, quality, user, hls);
                                  }); 
                }
                else
                    return $q.reject('Invalid userHash', 403);
            }
        )
        .then(function(linkData){ //save the download in database
            app.services.TorrentsDownloadedService.addDownload(linkData.torrent.id, linkData.user.id);
            return linkData.uri;
        });        
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
                        return $q.reject('Torrent not found', 404);
                    
                    if(torrent.files[fileId].length !== torrent.files[fileId].bytesCompleted)
                        return $q.reject('File not finished', 403);
                        
                    //if ok we retreive the download link
                    return DownloadService._generatePublicLink(torrent, fileId, user);
                }
                else
                    return $q.reject('Invalid userHash', 403);
            }
        )
        .then(function(linkData){ //save the download in database
            app.services.TorrentsDownloadedService.addDownload(linkData.torrent.id, linkData.user.id);
            return linkData.uri;
        });       
    };
    
    return DownloadService;
})()];
