module.exports = function(app){
    var router              = require('express').Router();
    var roleFilter          = require(__dirname + '/../filters/expressAuthFilter.js');
    var jwt                 = require('express-jwt');
    var userCtrl            = require(__dirname + '/../controllers/http/UserController.js')(app);
    var uploadCtrl          = require(__dirname + '/../controllers/http/UploadController.js')(app);
    var torrentCtrl         = require(__dirname + '/../controllers/http/TorrentController.js')(app);
    
    var authenticateFilter = jwt({ secret: app.config.secret.token });
    var roleUploaderFilter = roleFilter(app.services.UserService.roles.UPLOADER);
    
    router.post('/auth/register', userCtrl.onRegister);
    router.post('/auth/login', userCtrl.onLogin);
    router.post('/auth/verify', userCtrl.onVerifyToken);
    
    router.get('/user/all', authenticateFilter, userCtrl.onGetUsers);
    router.post('/user/get', authenticateFilter, userCtrl.onGetUser);
    
    router.post('/torrents/upload/files', authenticateFilter, roleUploaderFilter, uploadCtrl.onUploadFiles);
    router.post('/torrents/upload/link', authenticateFilter, roleUploaderFilter, uploadCtrl.onUploadLink);
    
    router.post('/torrents/pause', authenticateFilter, roleUploaderFilter, torrentCtrl.onPause);
    router.post('/torrents/start', authenticateFilter, roleUploaderFilter, torrentCtrl.onStart);
    router.get('/torrents/all', authenticateFilter, torrentCtrl.onGetAll);
    
    app.http.use('/', router);
};