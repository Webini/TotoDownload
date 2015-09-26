angular.module('services')
       .service('TagService', [ '$http', '$q', function($http, $q){
    
    var TagService = {
        /**
        * Search for movie / serie with movietagger
        * @param string query Search keywords
        * @param int type Movie type 0 => movie, 1 => serie
        * @return promise
        **/
        search: function(query, type){
            var cancelPromise = $q.defer();
            
            var responsePromise = $http.post('/tag/search', { query: query, type: type }, { timeout: cancelPromise.promise }).then(
                function success(response){
                    return response.data;
                }
            );
            
            responsePromise.cancel = function(){
                cancelPromise.resolve();
            };
            
            return responsePromise;
        },
        
        
        /**
         * Update torrent movie information
         * @param int movieId Moviedb id
         * @param int type Movie type 
         * @param string torrentHash Torrent hash id
         */
        update: function(movieId, type, torrentHash){
            return $http.post('/tag/set/' + encodeURIComponent(movieId) + '/'
                                          + encodeURIComponent(type), 
                              { hash: torrentHash })
                        .then(
                            function(response){
                                return response.data;
                            }
                        );
        }
    };
           
    return TagService;
}]);