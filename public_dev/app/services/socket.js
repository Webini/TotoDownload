angular.module('totodl')
       .factory('Socket', [ '$http', '$location', '$q', 'User', 
function factoryUser($http, $location, $q, User){
    
    var socket = io.connect('http://' + $location.host() + ':' + $location.port(), {
      'query': 'token=' + User.get().token 
    }); 

    var ret = {
        io: socket,
        connected: false
    };
    
    socket.on('connect', function(){
        ret.connected = true;
        console.debug('conn', socket);
        
        socket.on('reconnect', function(){
            ret.connected = true;
            socket.emit('authenticate', { token: User.get().token });
        });
        
        socket.on('reconnecting', function(){
            ret.connected = false;    
        });
        
        socket.on('error', function(error) {
            console.debug("SOCKET ERROR => ", error);
            if(error.type == "UnauthorizedError" || error.code == "invalid_token") {
                User.remove();
                window.location = '/index.html#/login?down=true';
            }
        });
    });
     
    return ret;
}]);