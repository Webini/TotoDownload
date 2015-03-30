angular.module('services')
       .service('TorrentsService', [ '$http', '$q', function($http, $q){
    
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
        } 
    };
           
    return TorrentsService;
}]);