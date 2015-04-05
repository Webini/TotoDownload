module.exports = ['SyncService', (function(){
    var app             = require(__dirname + '/../app.js');
    var $q              = require('q');
    var crc32           = require('crc').crc32;
    var _               = require('underscore');
    
    function SyncService(){
    };
    
    var stack = {};
    var childStack = {};
    
    SyncService.ready = function(){
        app.services.TorrentService.getAllFromDb().then(function(data){
            app.logger.log(data.length + ' torrents founds in database');
            
            for(var i = 0; i < data.length; i++){
                stack[data[i].hash] = data[i];                
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
                     torrent.activityDate + torrent.isFinished + torrent.isStalled);
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
    * Save changes in database
    * @return void
    **/
    SyncService.databaseSynchronize = function(){
        var promises = [];

        for(var hash in stack){
            if(stack[hash].needSync){
                delete stack[hash].needSync;
                promises.push(app.services.TorrentService._upsertTorrent(stack[hash].dataValues));
            }
        }
        
        return $q.all(promises);
    };
    
    /**
    * Update torrents status
    * save them in database if there are change, and notify clients
    * @param array object Torrents list
    **/
    SyncService.update = function(torrents){
        SyncService._updateTags(torrents);
        
        //update & inserts
        for(var i = 0; i < torrents.length; i++){
            if(!stack[torrents[i].hash] || 
                stack[torrents[i].hash].syncTag != torrents[i].syncTag){
                
                _.extend(stack[torrents[i].hash], torrents[i]);
                stack[torrents[i].hash].needSync = true;
                
                SyncService.onChange(stack[torrents[i].hash]);
            }
        }
        
        //delete
        for(var hash in stack){
            var found = false;
            for(var i = 0; i < torrents.length; i++){
                if(torrents[i].hash == hash){
                    found = true;
                    break;
                }
            }
            
            if(!found){
                SyncService.onDeleted(stack[hash]);
            }
        }
    };
    
    /**
    * Notify when @torrent has been deleted
    * @return void
    **/
    SyncService.onDeleted = function(torrent){
        console.log('SyncService.onDelete', torrent.name);
        
        stack[torrent.hash].destroy();
        delete stack[torrent.hash];
        
        for(var sid in childStack){
            if(childStack[sid].tags[torrent.hash]){
                delete childStack[sid].tags[torrent.hash];
                childStack[sid].socket.emit('torrent-deleted', { hash: torrent.hash });
            }
        }
    };
    
    /**
    * Notify when @torrent has change
    * @return torrent
    **/
    SyncService.onChange = function(torrent){
        stack[torrent.hash] = torrent;
        
        for(var sid in childStack){
            // if we can't found the torrent in child list or
            // if the syncTag has changed
            if(!childStack[sid].tags[torrent.hash] ||
                childStack[sid].tags[torrent.hash] != torrent.syncTag){
                
                childStack[sid].tags[torrent.hash] = torrent;
                childStack[sid].socket.emit('torrent-change', torrent.public);
            }
        }
        
        return torrent;
    };
    
    /**
    * Define sync tag for an user
    * @param object socket Socket
    * @param object { hash: 'hash', sync: 'sync tag'} tag 
    * @return void
    **/
    SyncService.setSyncTag = function(socket, tag){
        console.log('SyncService.setSyncTag', socket.id, tag);
        childStack[socket.id].tags[tag.hash] = tag.sync;
        
        //if tag send by child is too old 
        if(!stack[tag.hash])
            socket.emit('torrent-deleted', { hash: tag.hash });
        else if(tag.sync != stack[tag.hash].syncTag)
            socket.emit('torrent-change', stack[tag.hash].public);
    };
    
    
    /**
    * Define sync tags for an user
    * @param object socket User socket
    * @param array[ object { hash, sync } ] Tags
    * @return void
    **/
    SyncService.setSyncTags = function(socket, tags){
        console.log('SyncService.setSyncTags', socket.id, tags);
        for(var i = 0; i < tags.length; i++){
            SyncService.setSyncTag(socket, tags[i]);
        }
    };
    
    
    /**
    * Get all torrents in stack
    * @return array
    **/
    SyncService.getAll = function(){
        return stack;    
    };
    
    /**
    * Get a torrent
    * @param string hash
    * @return object
    **/
    SyncService.get = function(hash){
        return stack[hash];
    };
    
    /**
    * Register @socket
    * @param object socket
    **/
    SyncService.register = function(socket){
        console.log('SyncService.register', socket.id);
        childStack[socket.id] = { socket: socket, tags: {} };
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