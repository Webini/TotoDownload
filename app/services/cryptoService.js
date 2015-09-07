module.exports = ['CryptoService', (function(){
    var app           = require(__dirname + '/../app.js');
    var crypt         = require('crypto');
    
    function Crypto(){};
    
    Crypto.hashPassword = function(password, salt){
        var hash = crypt.createHash('sha512')
                        .update(password + salt + app.config.secret.salt)
                        .digest('hex');
        return hash;
    };
    
    Crypto.createMd5Hash = function(data){
        var hash = crypt.createHash('md5')
                        .update(data)
                        .digest('hex');
        
        return hash;
    };
    
    Crypto.createMd5HashInBase64 = function(data){
        var hash = crypt.createHash('md5')
                        .update(data)
                        .digest('base64');
                        
        return hash;
    }
    
    Crypto.random = function(length){
        var abc = 'abcdefghijklmnopqrstuvwxyz0123456789';
        var out = '';    

        for(var i = 0; i < length; i++)
            out += abc[Math.floor(Math.random() * (abc.length - 1))];

        return out;
    };
    
    return Crypto;
    
})()];