module.exports = function(socket){
    var app = require(__dirname + '/../../app.js');
    
    return {
        onConnect: function(){
            app.services.SyncService.register(socket);
        },
        onDisconnect: function(){
            app.services.SyncService.unregister(socket);
        }
    };
};