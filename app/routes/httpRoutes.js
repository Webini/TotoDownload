module.exports = function(app){
    var router = require('express').Router();
    var authenticationCtrl = require(__dirname + '/../controllers/http/AuthenticationController.js')(app);
    
    router.post('/register', authenticationCtrl.onRegister);
    router.post('/login', authenticationCtrl.onLogin);
    router.post('/verify', authenticationCtrl.onVerifyToken);
    
    app.http.use('/', router);
};