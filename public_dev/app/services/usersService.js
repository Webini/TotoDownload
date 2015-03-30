angular.module('services')
       .service('UsersService', [ '$http', '$q', function($http, $q){
    
    var UsersServices = { 
        /**
        * Register a new user
        * @param Object user { nickname, email, password }
        * @return deferred
        **/
        register: function(user){
            var deferred = $q.defer();
            
            $http.post('/auth/register', user).then(
                function success(response){
                    console.debug(response.data, response.data.errors);
                    if(response.data.errors)
                        deferred.reject(response.data.errors);
                    else
                        deferred.resolve(response.data);
                },
                function error(data){
                    deferred.reject([{path: 'unk', type: 'unk'}]);
                }
            );
            
            return deferred.promise;
        },
        
        
        /**
        * Log the user
        * @param Object user { email, password }
        * @return deferred
        **/
        login: function(user){
            var def = $q.defer();
            
            $http.post('/auth/login', user).then(
                function success(response){
                    if(!response.data.error)
                        def.resolve(response.data);
                    else
                        def.reject(response.data.error);
                },
                function error(data){
                    def.reject(-3);
                }
            );
            
            return def.promise;
        }
    };
    
    
    return UsersServices;
}]);