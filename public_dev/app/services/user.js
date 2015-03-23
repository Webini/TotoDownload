angular.module('factories')
       .factory('User', [ '$http', '$q', 'UsersService', 
function factoryUser($http, $q, UsersService){
    var user = {
        _loggedUser: null,
        /**
        * Save the user in localStorage
        * @param user
        * @return void
        **/        
        set: function(user){
            this._loggedUser = user;
            window.localStorage.setItem('_localUser', JSON.stringify(user));
        },
        /**
        * Retreive the user from the local storage
        * @return user
        **/
        get: function(){
            if(!this._loggedUser){
                try {
                    this._loggedUser = JSON.parse(window.localStorage.getItem('_localUser'));    
                }
                catch(e){
                    this._loggedUser = null;
                }
            }
            return this._loggedUser;
        },
        /**
        * Remove user from localStoragee
        **/
        remove: function(){
            this._loggedUser = null;
            window.localStorage.setItem('_localUser', null);    
        },
        /**
        * Check if current user has a valid token
        **/
        isValid: function(){
            var deferred = $q.defer();
            var _this = this;
            
            if(!this._loggedUser){
                deferred.reject();
                return deferred.promise;
            }
            
            $http.post('/verify', { token: this._loggedUser.token }).then(
                function success(data){
                    if(data)
                        deferred.resolve();
                    else{
                        _this.remove();
                        deferred.reject();
                    }
                },
                function error(data){
                    _this.remove();
                    deferred.reject();
                }
            );
            
            return deferred.promise;
        }
    };
    
    //retreive the user if available in localstorage
    user.get();
    return user;
}]);