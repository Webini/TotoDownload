module.exports = function(config){
    var Transmission    = require('transmission');
    var $q              = require('q');
    var app             = require(__dirname + '/../../app.js');
    
    var S4 = function() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    
    var uuid = function() {
        return (S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4());
    };

    trans = new Transmission(config);
    
    //I was trying to parse the error but the format is too fucked, so i just log the output error
    function parseError(err, path){
        app.logger.log(err, path);   
        
        if(typeof err == 'string')
            return err;
        return 'Unknown error';
    }
    
    return {
        /**
        * Add a new file
        * @param path File path
        * @param options Option for the torrent currently accept only { 'download-dir': DIR } 
        * success callback must return an object
        * { id: TorrentId, hash: TorrentHash, name: Torrent name }
        * error callback must return an object
        * { error: message }
        * @return promise
        **/
        addFile: function(path, options){
            var defer = $q.defer();
            
            function responseCallback(err, response){
                if(err)
                    defer.reject({ error: parseError(err, path) });
                else
                    defer.resolve({ id: response.id, hash: response.hashString, name: response.name });                
            }
            
            if(options)
                trans.addFile(path, options, responseCallback);
            else
                trans.addFile(path, responseCallback);
            
            return defer.promise;
        },
        
        /**
        * Remove the torrent & torrent's files
        * @param hash Torrent's hash
        * @return promise
        **/
        remove: function(hash){
            var defer = $q.defer();

            function responseCallback(err, response){
                if(err) 
                    defer.reject({ error: parseError(err, 'undef') });
                else
                    defer.resolve(response);                
            }

            trans.remove([hash], true, responseCallback);

            return defer.promise;
        },
        
        /**
        * Add a new torrent url
        * @param string url Url
        * @param object options Option for the torrent currently accept only { 'download-dir': DIR } 
        * success callback must return an object
        * { id: TorrentId, hash: TorrentHash, name: Torrent name }
        * error callback must return an object
        * { error: message }
        * @return promise
        **/
        addUrl: function(url, options){
            var defer = $q.defer();
            
            function responseCallback(err, response){
                if(err)
                    defer.reject({ error: parseError(err, 'undef') });
                else
                    defer.resolve({ id: response.id, hash: response.hashString, name: response.name });                
            }
            
            if(options)
                trans.addUrl(url, options, responseCallback);
            else
                trans.addUrl(url, responseCallback);
            
            return defer.promise;
        },
        
        
        /**
        * Retreive all torrents 
        * @return promise
        **/
        getAll: function(){
            var defer = $q.defer();
            
            var options = {
                arguments : {
                    fields : ['activityDate', 'desiredAvailable', 'downloadDir', 'error', 'errorString', 'eta', 'files', 'hashString', 'id', 'isFinished', 'isStalled', 'leftUntilDone', 'metadataPercentComplete', 'name', 'peersConnected', 'peersGettingFromUs', 'peersSendingToUs', 'percentDone', 'queuePosition', 'rateDownload', 'magnetLink', 'rateUpload', 'recheckProgress', 'uploadedEver', 'seedRatioLimit', 'seedRatioMode', 'sizeWhenDone', 'status', 'totalSize', 'trackers', 'uploadedEver', 'uploadRatio']
                },
                method : trans.methods.torrents.get,
                tag : uuid()
            };
            
            trans.callServer(options, function(err, response){
                if(err){
                    defer.reject({ error: parseError(err, 'undef') });
                }
                else{
                    response = response.torrents;
                    //replace key hashString by hash
                    for(var i = 0; i < response.length; i++){
                        response[i]['hash'] = response[i]['hashString'];
                        response[i]['tid'] = response[i]['id'];
                        delete response[i]['hashString'];
                        delete response[i]['id'];
                    }
                    
                    defer.resolve(response);
                }
            });
            
            return defer.promise;
        },
        
        /***
        * Define new configuration for the torrent
        * @param array ids Torrents ids
        * @param object options { seedRatioLimit } (only one param for now)
        * @return promise
        **/
        set: function(ids, options){
            var defer = $q.defer();
            
            function responseCallback(err, response){
                if(err)
                    defer.reject({ error: parseError(err, 'undef') });
                else
                    defer.resolve(response);                
            }
            
            if(options['seedRatioLimit'])
                options['seedRatioMode'] = 1; //seedRatioMode = Use global (0), torrent (1), or unlimited (2) limit.  
            
            trans.set(ids, options, responseCallback);
            
            return defer.promise;
        },
        
        /**
        * retreive torrents with id @ids
        * @param array ids Torrents ids, if transmission restart ID can change so don't use id to identify torrent, prefer hash 
        * @return promise
        **/
        get: function(ids){
            var defer = $q.defer();
            
            function responseCallback(err, response){
                if(err)
                    defer.reject({ error: parseError(err, 'undef') });
                else
                    defer.resolve(response);                
            }
            
            if(ids)
                trans.get(ids, responseCallback);
            else
                trans.get(responseCallback);
            
            return defer.promise;
        },
        
        /**
        * Pause a torrent
        * @param string Hash Torrent hash
        * @return promise
        **/
        pause: function(id){
            var defer = $q.defer();
            
            trans.stop([id], function(err, response){
                if(err)
                    defer.reject({ error: parseError(err, 'undef') });
                else
                    defer.resolve(response);    
            });
            
            return defer.promise;
        },
        
        /**
        * Start a torrent
        * @param string Hash Torrent hash
        * @return promise
        **/
        start: function(id){
            var defer = $q.defer();
            
            trans.start([id], function(err, response){
                if(err)
                    defer.reject({ error: parseError(err, 'undef') });
                else
                    defer.resolve(response);    
            });
            
            return defer.promise;
        }
    };
};