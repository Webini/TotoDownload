module.exports = function(config){
    var Transmission    = require('transmission');
    var $q              = require('q');
    var app             = require(__dirname + '/../../app.js');
    
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
                    defer.reject({ error: parseError(err, path) });
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
            return this.get();
        },
        
        /**
        * retreive torrents with id @ids
        * @param array ids Torrents ids
        * @return promise
        **/
        get: function(ids){
            var defer = $q.defer();
            
            function responseCallback(err, response){
                if(err)
                    defer.reject({ error: parseError(err, path) });
                else
                    defer.resolve(response);                
            }
            
            if(ids)
                trans.get(ids, responseCallback);
            else
                trans.get(responseCallback);
            
            return defer.promise;
        }
    };
};