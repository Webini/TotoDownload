module.exports = function(socket){
    var app = require(__dirname + '/../../app.js');
    
    return {
        onConnect: function(){
            
        },
        onDisconnect: function(){
            app.services.SyncService.unregister(socket);
        }
    };
};