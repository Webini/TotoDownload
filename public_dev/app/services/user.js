angular.module('services')
       .service('User', [ '$http', '$q', '$rootScope', 'UsersService', 
function($http, $q, $rootScope, UsersService){
    var UserClass = {
        roles: {
            LEETCHI: 0,
            UPLOADER: 1,
            ADMIN: 2,
            SUPER_ADMIN: 4 
        },
        _users: null,
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
            var _this = this;
            
            user.is = function(role){
                return (this.roles & role);    
            };

            //define the token for http requests
            $http.defaults.headers.common.authorization = 'Bearer ' + user.token; 
                
            //once we are logged we can retreive all users list
            this.getAll();
        },
        
        /**
        * Retreive current logged user from the local storage
        * or if @id is set, return user with @id
        * @return user
        **/
        get: function(id){
            if(!id){
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
            }
            else {
                if(this._users[id])
                    return this._users[id];
                return null;
            }
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
        },
        
        /**
        * Retreive all users from database
        * @return void
        **/
        getAll: function(){ 
            var _this = this;
            
            if(this._users){
                return $q(function(resolve){
                    resolve(_this._users);   
                });
            }
            
            return $http.get('/user/all').then(
                function (response){
                    _this._users = {};
                    //save users
                    for(var i = 0; i < response.data.length; i++){
                        _this._users[response.data[i].id] = response.data[i];
                    }
                    
                    return _this._users;
                }
            );
        },
        
    };
    
    /**
    * When we have a new user
    * @return void
    **/
    UserClass._onNewUser = function(user){
        console.debug('UserService.onNewUser', user);
        UserClass._users[user.id] = user;
        $rootScope.$broadcast('new-user', user);
    };
    
    //retreive the user if available in localstorage
    UserClass.get();
    return UserClass;
}]);