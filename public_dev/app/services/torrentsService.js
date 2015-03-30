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
        }
    };
           
    return TorrentsService;
}]);