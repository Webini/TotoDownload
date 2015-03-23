module.exports = function(app){
    var router              = require('express').Router();
    var jwt                 = require('express-jwt');
    var authenticationCtrl  = require(__dirname + '/../controllers/http/AuthenticationController.js')(app);
    var uploadCtrl          = require(__dirname + '/../controllers/http/UploadController.js')(app);
    
    router.post('/register', authenticationCtrl.onRegister);
    router.post('/login', authenticationCtrl.onLogin);
    router.post('/verify', authenticationCtrl.onVerifyToken);
    router.post('/upload/torrents', jwt({ secret: app.config.secret.token }), uploadCtrl.onUploadFiles);
    
    app.http.use('/', router);
};