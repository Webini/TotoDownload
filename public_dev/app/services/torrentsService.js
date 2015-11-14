angular.module('services')
       .service('TorrentsService', [ '$http', '$q', function($http, $q){
    //cache best dowloads
    var bestDownloads = null;
    var streamCache = {};
    
    var TorrentsService = {
        /**
        * Upload torrent link / magnet
        * @return promise
        **/
        sendLink: function(link){
            var deferred = $q.defer();
            
            $http.post('/torrents/upload/link', { link: link }).then(
                function success(response){
                    deferred.resolve(response.data);   
                },
                function err(e){
                    deferred.reject(e);    
                }
            );
            
            return deferred.promise;
        },
        
        /**
         * Retreive torrent trailer
         * @param int trailerId
         * @return promise
         */
        getTrailer: function(trailerId){
            return $http.get('/torrents/trailer/' + trailerId).then(
                function(response){
                    return response.data;
                }
            );
        },
        
        /**
         * Retreive files availables for streaming
         * @return promise
         */
        getStreamingFiles: function(torrentHash){
            if(streamCache[torrentHash]){
                return $q.resolve(streamCache);
            }
            
            return $http.get('/torrents/' + encodeURIComponent(torrentHash) + '/stream/files').then(
                function(response){
                    streamCache[torrentHash] = response.data;
                    return response.data;
                }
            )
        },
        
        /**
         * Retreive best downloads
         * @return promise
         */
        getBestDownloads: function(){
            if(bestDownloads !== null){
                return $q.when(bestDownloads);
            }
            
            return $http.get('/torrents/bestDownloads').then(
                function(response){
                    bestDownloads = response.data;
                    return bestDownloads;
                }
            );
        },
        
        /**
        * Pause a torrent
        * @param string hash Torrent hash
        * @return promise
        **/
        pause: function(hash){
            return $http.post('/torrents/pause', { hash: hash }).then(
                function success(response){
                    return response.data;
                }
            );
        },
        
        /**
        * Start a torrent
        * @param string hash Torrent hash
        * @return promise
        **/
        start: function(hash){
            return $http.post('/torrents/start', { hash: hash }).then(
                function success(response){
                    return response.data;   
                }
            );
        },
        
        /**
        * Remove a torrent
        * @param string hash Torrent hash
        * @return promise
        **/
        remove: function(hash){
            return $http.post('/torrents/remove', { hash: hash }).then(
                function(response){
                    return response.data;      
                }
            );
        }
    };
           
    return TorrentsService;
}]);