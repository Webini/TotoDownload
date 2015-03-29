module.exports = ['SyncService', (function(){
    var app             = require(__dirname + '/../app.js');
    var $q              = require('q');
    var crc32           = require('crc').crc32;
    
    function SyncService(){
    };
    
    var stack = {};
    var childStack = {};
    
    SyncService.ready = function(){
        app.services.TorrentService.getAllFromDb().then(function(data){
            app.logger.log(data.length + ' torrents founds in database');
            
            for(var i = 0; i < data.length; i++){
                stack[data[i]] = data[i];                
            }
        });
    };
    
    /**
    * genere le tag de synchro du torrent
    * @return string
    **/
    SyncService.generateSyncTag = function(torrent){
        return crc32(torrent.hash + torrent.status +
                     torrent.leftUntilDone + torrent.error +
                     torrent.peersSendingToUs + torrent.peersGettingFromUse +
                     torrent.rateDownload + torrent.rateUpload + torrent.eta +
                     torrent.activityDate);
    };
    
    /**
    * Update the sync tag
    * @param array Torrents
    * @return void
    **/
    SyncService._updateTags = function(torrents){
        for(var i = 0; i < torrents.length; i++){
            torrents[i].syncTag = SyncService.generateSyncTag(torrents[i]); 
        }
    };
    
    /**
    * Update only one torrent and sync it
    * @return promise
    **/
    SyncService.updateOne = function(torrent){
        console.log('_updateOne');
        
        if(!torrent.syncTag)
            torrent.syncTag = SyncService.generateSyncTag(torrent);
        
        return app.services.TorrentService._upsertTorrent(torrent)
                                          .then(SyncService.onChange);
    };
    
    /**
    * Update torrents status
    * save them in database if there are change, and notify clients
    * @param array object Torrents list
    **/
    SyncService.update = function(torrents){
        SyncService._updateTags(torrents);
       
        for(var i = 0; i < torrents.length; i++){
            if(!stack[torrents[i].hash] || 
                stack[torrents[i].hash].syncTag != torrents[i].syncTag){
                app.services.TorrentService._upsertTorrent(torrents[i])
                                           .then(SyncService.onChange, function(a, b, c){ console.log(a, b, c); });
            }
        }
    };
    
    /**
    * Notify @when torrent has change
    * @return torrent
    **/
    SyncService.onChange = function(torrent){
        stack[torrent.hash] = torrent;
        for(var sid in childStack){
            // if we can't found the torrent in child list or
            // if the syncTag has changed
            if(!childStack[sid].list[torrent.hash] ||
                childStack[sid].list[torrent.hash] != torrent.syncTag){
                
                childStack[sid].list[torrent.hash] = torrent;
                childStack[sid].socket.emit('change', torrent);
            }
        }
        
        return torrent;
    };
    
    /**
    * Register @socket with @torrentsList
    * @param object socket 
    * @param array[Object { 'hash': 'syncTag' }] Register to this torrents updates
    **/
    SyncService.register = function(socket, list){
        childStack[socket.id] = { socket: socket, list: list };
    };
    
    /**
    * Unregister @socket
    **/
    SyncService.unregister = function(socket){
        if(childStack[socket.id])
            delete childStack[socket.id];
    };
    
    return SyncService;
})()];