angular.module('services')
       .factory('SyncService', [ '$http', '$q', 'Socket', 'User', 
function($http, $q, Socket, User){
    
    function SyncService(){
    };
    
    SyncService.data = {
        states: {},
        torrents: [],
        lastChange: Date.now()
    };
    
    /**
    * Get all torrents from server
    **/
    SyncService._getAll = function(){
        return $http.get('/torrents/all').then(
            function(response){
                console.debug('get all', response);
                SyncService.data.torrents = response.data;
                
                console.debug('get all', SyncService.data.torrents);
                //call SyncService to register new sync tags
                SyncService.updateStates(response.data);
            }
        );
    };
    
    /**
    * Call from server when a torrent change 
    * @param object torrent
    * @return void
    **/
    SyncService.onChangeState = function(torrent){
        if(SyncService.data.states[torrent.hash] === torrent.syncTag)
            return;
        
        console.log('change sync');
        
        if(!SyncService.data.states[torrent.hash]){
            //insert torrent
            SyncService.data.torrents.push(torrent);
        }
        else{
            //update torrent
            for(var i = 0; i < SyncService.data.torrents.length; i++){
                if(SyncService.data.torrents[i].hash == torrent.hash){
                    SyncService.data.torrents[i] = torrent;
                    break;
                }
            }
        }
        
        SyncService.data.lastChange = Date.now();
        
        console.debug(SyncService.data.lastChange, SyncService.data.torrents[0].syncTag, SyncService.data.torrents[0].name);
        SyncService.data.states[torrent.hash] = torrent.syncTag;
        Socket.setSyncTag({ hash: torrent.hash, sync: torrent.syncTag });
    };
    
    /**
    * update the states of an array of torrents
    * @param array torrents
    * @return void
    **/
    SyncService.updateStates = function(torrents){
        console.log('change State');
        var change = [];
        
        for(var i = 0; i < torrents.length; i++){
            var tag = { hash: torrents[i].hash, sync: torrents[i].syncTag };
            
            if(!SyncService.data.states[tag.hash] ||
                SyncService.data.states[tag.hash] != tag.sync){
                SyncService.data.states[tag.hash] = tag.sync;
                change.push(tag);
            }
        }
        
        Socket.setSyncTags(change);
    };
    
    /**
    * Resynchronize states after disconnection
    * @return void
    **/
    SyncService.resyncStates = function(){
        console.log('resync');
        
        var ostates = [];
        
        for(var hash in SyncService.data.states){
            ostates.push({ hash: hash, sync: SyncService.data.states[hash] });   
        }
        
        Socket.setSyncTags(ostates);
    };
    
    Socket.io.on('torrent_change', SyncService.onChangeState);
    Socket.io.on('reconnect', SyncService.resyncStates);
    
    SyncService._getAll();
    
    return SyncService;
}]);