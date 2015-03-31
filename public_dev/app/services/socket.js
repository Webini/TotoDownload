angular.module('services')
       .factory('Socket', [ '$http', '$location', '$q', 'User',
function($http, $location, $q, User){
    
    var socket = io.connect('http://' + $location.host() + ':' + $location.port(), {
      'query': 'token=' + User.get().token 
    }); 

    var ret = {
        io: socket,
        connected: false,
        
        /**
        * Define new torrent sync tag
        * @param object { hash: 'hash', sync: 'sync tag'} tag 
        * @return void
        **/
        setSyncTag: function(tag){
            socket.emit('updateTag', tag);    
        },
        
        /**
        * Define new torents sync tag
        * @param array[ object { hash, sync } ] Tags
        * @return void
        **/
        setSyncTags: function(tags){
            socket.emit('updateTags', tags);                
        }
    };
    
    socket.on('connect', function(){
        ret.connected = true;
        console.debug('conn', socket);
        
        socket.on('reconnect', function(){
            ret.connected = true;
        });
        
        socket.on('reconnecting', function(){
            ret.connected = false;    
        });
        
        socket.on('error', function(error) {
            console.debug("SOCKET ERROR => ", error);
            if(error.type == "UnauthorizedError" || error.code == "invalid_token") {
                User.logout('/index.html#/login?down=true');
            }
        });
    });
    
    //bind UsersServices routes
    socket.on('new-user', User._onNewUser);  
    
    return ret;
}]);