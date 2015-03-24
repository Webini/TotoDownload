module.exports = function(config){
    var Transmission    = require('transmission');
    var $q              = require('q');
    var app             = require(__dirname + '/../../app.js');
    
    trans = new Transmission(config);
    
    //I was trying to parse the error but the format is too fucked, so i just log the output error
    function parseError(err){
        app.logger.warn(err);   
        
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
                    defer.reject({ error: parseError(err) });
                else
                    defer.resolve({ id: response.id, hash: response.hashString, name: response.name });                
            }
            
            if(options)
                trans.addFile(path, options, responseCallback);
            else
                trans.addFile(path, responseCallback);
            
            return defer.promise;
        }
    };
};