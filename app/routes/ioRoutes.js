module.exports = function(app){
    var RegisterController = require(__dirname + '/../controllers/io/RegisterController.js')(app);
    var ConnectionController = require(__dirname + '/../controllers/io/ConnectionController.js')(app);
    
    app.io.sockets.on('connection', function(socket){
        ConnectionController.onConnect(socket);
        
        console.log(require('util').inspect(socket.decoded_token));
        //app.io.socket.on('authenticate', RegisterController.onAuthenticate);
        app.io.sockets.on('disconnect', ConnectionController.onDisconnect);
    });
};