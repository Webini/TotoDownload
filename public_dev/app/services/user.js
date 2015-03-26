angular.module('services')
       .factory('User', [ '$http', '$q', 'UsersService', 
function factoryUser($http, $q, UsersService){
    var user = {
        roles: {
            LEETCHI: 0,
            UPLOADER: 1,
            ADMIN: 2,
            SUPER_ADMIN: 4 
        },
        
        _loggedUser: null,
        /**
        * Save the user in localStorage
        * @param user
        * @return void
        **/        
        set: function(user){
            this._loggedUser = user;
            window.localStorage.setItem('_localUser', JSON.stringify(user));
            this._defineFunctions(this._loggedUser);
        },
        
        /**
        * Define user fn
        * @return void
        **/
        _defineFunctions: function(user){
            user.is = function(role){
                return (this.roles & role);    
            };
        },
        
        /**
        * Retreive the user from the local storage
        * @return user
        **/
        get: function(){
            if(!this._loggedUser){
                try {
                    this._loggedUser = JSON.parse(window.localStorage.getItem('_localUser'));
                    this._defineFunctions(this._loggedUser);
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
        * Log out current user
        * @param string redirect Redirect url
        **/
        logout: function(redirect){
            this.remove();
            window.location = redirect;
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
            
            $http.post('/auth/verify', { token: this._loggedUser.token }).then(
                function success(response){
                    console.debug(response.data);
                    if(response.data)
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