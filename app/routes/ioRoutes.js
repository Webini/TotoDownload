module.exports = function(app){
    app.io.sockets.on('connection', function(socket){
        var ConnectionController = require(__dirname + '/../controllers/io/ConnectionController.js')(socket);
        
        ConnectionController.onConnect();
        
        //console.log(require('util').inspect(socket.decoded_token));
        //app.io.socket.on('authenticate', RegisterController.onAuthenticate);
        app.io.sockets.on('disconnect', ConnectionController.onDisconnect);
    });
};