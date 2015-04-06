module.exports = function(app){
    var router              = require('express').Router();
    var roleFilter          = require(__dirname + '/../filters/expressAuthFilter.js');
    var myTorrentFilter     = require(__dirname + '/../filters/myTorrentFilter.js');
    var jwt                 = require('express-jwt');
    var userCtrl            = require(__dirname + '/../controllers/http/UserController.js')(app);
    var uploadCtrl          = require(__dirname + '/../controllers/http/UploadController.js')(app);
    var torrentCtrl         = require(__dirname + '/../controllers/http/TorrentController.js')(app);
    
    var authenticateFilter = jwt({ secret: app.config.secret.token });
    var myFilter = myTorrentFilter(); 
    var roleUploaderFilter = roleFilter(app.services.UserService.roles.UPLOADER);
    
    router.post('/auth/register', userCtrl.onRegister);
    router.post('/auth/login', userCtrl.onLogin);
    router.post('/auth/verify', userCtrl.onVerifyToken);
    
    router.get('/user/all', authenticateFilter, userCtrl.onGetUsers);
    router.post('/user/get', authenticateFilter, userCtrl.onGetUser);
    
    router.post('/torrents/upload/files', authenticateFilter, roleUploaderFilter,  uploadCtrl.onUploadFiles);
    router.post('/torrents/upload/link', authenticateFilter, roleUploaderFilter, uploadCtrl.onUploadLink);
    
    router.post('/torrents/remove', authenticateFilter, roleUploaderFilter, myFilter, torrentCtrl.onRemove);
    router.post('/torrents/pause', authenticateFilter, roleUploaderFilter, myFilter, torrentCtrl.onPause);
    router.post('/torrents/start', authenticateFilter, roleUploaderFilter, myFilter, torrentCtrl.onStart);
    router.get('/torrents/download/:torrentHash([a-zA-Z0-9]+)/:userId([0-9]+)/:userHash([a-zA-Z0-9]+)/:fileId([0-9]+)/:fileName');
    
    router.get('/torrents/all', authenticateFilter, torrentCtrl.onGetAll);
    
    app.http.use('/', router);
};