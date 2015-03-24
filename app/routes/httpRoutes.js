module.exports = function(app){
    var router              = require('express').Router();
    var roleFilter          = require(__dirname + '/../filters/expressAuthFilter.js');
    var jwt                 = require('express-jwt');
    var authenticationCtrl  = require(__dirname + '/../controllers/http/AuthenticationController.js')(app);
    var uploadCtrl          = require(__dirname + '/../controllers/http/UploadController.js')(app);
    
    var authenticateFilter = jwt({ secret: app.config.secret.token });
    var roleUploaderFilter = roleFilter(app.services.UserManager.roles.UPLOADER);
    
    router.post('/register', authenticationCtrl.onRegister);
    router.post('/login', authenticationCtrl.onLogin);
    router.post('/verify', authenticationCtrl.onVerifyToken);
    router.post('/upload/torrents', authenticateFilter, roleUploaderFilter, uploadCtrl.onUploadFiles);
    
    app.http.use('/', router);
};