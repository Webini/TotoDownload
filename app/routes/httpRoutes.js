module.exports = function(app){
    var router              = require('express').Router();
    var roleFilter          = require(__dirname + '/../filters/expressAuthFilter.js');
    var jwt                 = require('express-jwt');
    var authenticationCtrl  = require(__dirname + '/../controllers/http/AuthenticationController.js')(app);
    var uploadCtrl          = require(__dirname + '/../controllers/http/UploadController.js')(app);
    var torrentCtrl          = require(__dirname + '/../controllers/http/TorrentController.js')(app);
    
    var authenticateFilter = jwt({ secret: app.config.secret.token });
    var roleUploaderFilter = roleFilter(app.services.UserService.roles.UPLOADER);
    
    router.post('/auth/register', authenticationCtrl.onRegister);
    router.post('/auth/login', authenticationCtrl.onLogin);
    router.post('/auth/verify', authenticationCtrl.onVerifyToken);
    
    router.post('/torrents/upload/files', authenticateFilter, roleUploaderFilter, uploadCtrl.onUploadFiles);
    router.post('/torrents/upload/link', authenticateFilter, roleUploaderFilter, uploadCtrl.onUploadLink);
    
    router.get('/torrents/all', authenticateFilter, torrentCtrl.getAll);
    
    app.http.use('/', router);
};