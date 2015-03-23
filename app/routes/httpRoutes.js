module.exports = function(app){
    var router = require('express').Router();
    var authenticationCtrl = require(__dirname + '/../controllers/http/AuthenticationController.js')(app);
    var uploadCtrl = require(__dirname + '/../controllers/http/UploadController.js')(app);
    
    router.post('/register', authenticationCtrl.onRegister);
    router.post('/login', authenticationCtrl.onLogin);
    router.post('/verify', authenticationCtrl.onVerifyToken);
    router.post('/upload', uploadCtrl.onUpload);
    
    app.http.use('/', router);
};