module.exports = function(app){
    var router              = require('express').Router();
    var roleFilter          = require(__dirname + '/../filters/expressAuthFilter.js');
    var myTorrentFilter     = require(__dirname + '/../filters/myTorrentFilter.js');
    var jwt                 = require('express-jwt');
    var userCtrl            = require(__dirname + '/../controllers/http/UserController.js')(app);
    var uploadCtrl          = require(__dirname + '/../controllers/http/UploadController.js')(app);
    var torrentCtrl         = require(__dirname + '/../controllers/http/TorrentController.js')(app);
    
    var authenticateFilter = jwt({ secret: app.config.secret.token });
    var myFilter = myTorrentFilter(); //check if the torrent is our
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
    
    router.get('/torrents/trailer/:id([0-9]+)', authenticateFilter, torrentCtrl.onGetTrailer);
    
    //when we start the download, this request will increment our downloads counter in database for userId XY
    router.get(
        '/torrents/download/:torrentHash([a-zA-Z0-9]+)/:userId([0-9]+)/:userHash([a-zA-Z0-9]+)/:fileId([0-9]+)/:fileName',
        torrentCtrl.onDownload
    );
    
    //segment after /torrents/download/raw is defined in DownloadService
    // /8d68e1fb4fdac87495531a0f8aeae2088212cecb/258a69064e58c857f236a228bfe093de/7/1428592066/P_MO14_ftype.txt
    router.get(
        '/torrents/download/raw/:torrentHash([a-zA-Z0-9]+)/:ttlHash([a-zA-Z0-9]+)/:fileId([0-9]+)/:ttl([0-9]+)/:fileName',
        torrentCtrl.onRawDownload
    );
    
    router.get('/torrents/all', torrentCtrl.onGetAll);
    
    app.http.use('/', router);
};