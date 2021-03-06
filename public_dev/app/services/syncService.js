angular.module('services')
       .factory('SyncService', [ '$http', '$q', 'Socket', 'User', '$rootScope', 
function($http, $q, Socket, User, $rootScope){
    var _this = this;
    
    this.data = {
        states: {},
        torrents: [],
        lastChange: Date.now(),
        loading: false
    };
    
    var getAllPromise = null; //$q.defer();
    
    /**
    * Get all torrents from server
    **/
    this._getAll = function(){
        if(getAllPromise){
            if(getAllPromise.promise.$$state.status === 0){
                return getAllPromise.promise;
            }
            else{
                return $q.when(this.data.torrents);
            }
        }
        
        getAllPromise = $q.defer();
        
        $http.get('/torrents/all').then(
            function(response){
                _this.data.torrents = response.data;
                
                console.debug('get all', _this.data.torrents);
                //call SyncService to register new sync tags
                _this.updateStates(response.data);
                $rootScope.$broadcast('torrents-change', _this.data.torrents);
                
                getAllPromise.resolve(_this.data.torrents);
            },
            function(err){
                getAllPromise.reject(err);
            }
        ).finally(function(){
            _this.data.loading = false;    
        });
        
        return getAllPromise.promise;
    };
    
    /**
     * Get all torrents
     * @return promise
     */
    this.getAll = function(){
        return this._getAll();  
    };
    
    /**
    * Get one torrent
    * @param string hash Torrent hash
    * @return promise
    **/
    this.get = function(hash){
        var defer = $q.defer();
        //if we already are loading all torrents, we have to wait until the end of the request the send result to the promise
        if(this.data.loading){
            this.data.loading.then(
                function(data){
                    defer.resolve(_this.__get(hash));
                },
                function(err){
                    defer.reject(err); 
                }
            );
            
            return defer.promise;
        }
        
        var torrent = this.__get(hash);
        if(torrent)
            defer.resolve(torrent);
        else
            defer.reject(this.loading);
        
        return defer.promise;
    };
    
    /**
    * Retreive one torrent in memory
    * @return array || object || false
    **/
    this.__get = function(hash){
        var isArray = (typeof hash == 'object');
        var out = [];
        
        for(var i = 0; i < this.data.torrents.length; i++){
            if(isArray && hash.indexOf(this.data.torrents[i].hash) !== -1){
                out.push(this.data.torrents[i]);        
            }
            else if(!isArray && this.data.torrents[i].hash == hash){
                return this.data.torrents[i];
            }
        }
        
        return (isArray ? out : false);
    };
    
    /**
    * Call from server when a torrent change 
    * @param object torrent
    * @return void
    **/
    this.onChangeState = function(torrent){
        if(_this.data.states[torrent.hash] === torrent.syncTag)
            return;
        
        console.log('change sync');
        
        if(!_this.data.states[torrent.hash]){
            //insert torrent
            _this.data.torrents.push(torrent);
        }
        else{
            //update torrent
            for(var i = 0; i < _this.data.torrents.length; i++){
                if(_this.data.torrents[i].hash == torrent.hash){
                    //preserve angular $$ tags
                    for(var key in torrent){
                        _this.data.torrents[i][key] = torrent[key];   
                    }
                    
                    break;
                }
            }
        }
        
        _this.data.lastChange = Date.now();
        
        _this.data.states[torrent.hash] = torrent.syncTag;
        //no resync needed after one change notification
        //Socket.setSyncTag({ hash: torrent.hash, sync: torrent.syncTag });
        
        $rootScope.$broadcast('torrent-change', torrent);
    };
    
    /**
    * update the states of an array of torrents
    * @param array torrents
    * @return void
    **/
    this.updateStates = function(torrents){
        console.log('change State');
        var change = [];
        
        for(var i = 0; i < torrents.length; i++){
            var tag = { hash: torrents[i].hash, sync: torrents[i].syncTag };
            
            if(!_this.data.states[tag.hash] ||
                _this.data.states[tag.hash] != tag.sync){
                _this.data.states[tag.hash] = tag.sync;
                change.push(tag);
            }
        }
        
        Socket.setSyncTags(change);
    };
    
    /**
    * Resynchronize states after disconnection
    * @return void
    **/
    this.resyncStates = function(){
        console.log('resync');
        
        var ostates = [];
        
        for(var hash in _this.data.states){
            ostates.push({ hash: hash, sync: _this.data.states[hash] });   
        }
        
        Socket.setSyncTags(ostates);
    };
    
    
    /**
    * Remove a torrent from memory
    * @param string hash Torrent hash
    * @return boolean true = ok
    **/
    this.removeFromMemory = function(hash){
        var offset = -1;
        for(var i = 0; i < _this.data.torrents.length; i++){
            if(_this.data.torrents[i].hash == hash){
                offset = i;
                break;
            }    
        }
        
        if(offset > -1){
            _this.data.torrents.splice(offset, 1);
            return true;
        }
        return false;
    };
    
    /**
    * When a torrent is deleted
    * @param object { hash: TorrentHash }
    * @return void
    **/
    this.onDeleted = function(torrent){
        console.debug('SyncService.onDeleted', torrent);
        
        if(_this.removeFromMemory(torrent.hash))
            $rootScope.$broadcast('torrent-change', torrent);
    };
    
    /**
     * When the current user is updated
     * @param object user
     * @retunr void
     */
    this.updateUser = function(user){
        console.debug('SyncService.updateUser', user);  
        User.set(user);
        
        if(!$rootScope.$$phase)
            $rootScope.$digest();
    };
    
    this.onQuotaExceeded = function(torrentName){
        $rootScope.$broadcast('quota-exceeded', torrentName);  
    };
    
    Socket.io.on('torrent-change', this.onChangeState);
    Socket.io.on('torrent-deleted', this.onDeleted);
    Socket.io.on('reconnect', this.resyncStates);
    Socket.io.on('update-user', this.updateUser);
    Socket.io.on('quota-exceeded', this.onQuotaExceeded);
    
    this.data.loading = this._getAll();
    
    return this;
}]);