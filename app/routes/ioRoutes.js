module.exports = function(app){
    app.io.sockets.on('connection', function(socket){
        var ConnectionController = require(__dirname + '/../controllers/io/ConnectionController.js')(socket);
        var SyncController = require(__dirname + '/../controllers/io/SyncController.js')(socket);
        
        ConnectionController.onConnect();
        app.io.sockets.on('disconnect', ConnectionController.onDisconnect);
        
        //console.log(require('util').inspect(socket.decoded_token));
        //app.io.socket.on('authenticate', RegisterController.onAuthenticate);
        socket.on('updateTag', SyncController.onUpdateTag);
        socket.on('updateTags', SyncController.onUpdateTags);
        
    });
};