module.exports = ['UserService', (function(){
    var jwt           = require("jsonwebtoken");
    var app           = require(__dirname + '/../app.js');
    var $q            = require('q');
    
    return {  
        roles: {
            LEETCHI: 0,
            UPLOADER: 1,
            ADMIN: 2,
            SUPER_ADMIN: 4
        },
        
        /**
        * Log user
        * @param object data { email, password }
        * @return deferred, if error return: -1 => not found, -2 => wrong password
        **/
        login: function(data){
            var deferred = $q.defer();
            
            app.orm['User'].find({ where: { email: data.email } }).then(
                function success(user){
                    if(user == null)
                        return deferred.reject(-1);
                    
                    var cPass = app.services.CryptoService.hashPassword(data.password, user.salt);
                    if(cPass != user.password)
                        deferred.reject(-2);
                    else
                        deferred.resolve(user);
                },
                function error(data){
                    deferred.reject(-1);
                }
            );
            
            return deferred.promise;
        },
        
        /**
        * Get token for user
        * @param Model\user user
        * @return string
        **/
        getToken: function(user){
            return jwt.sign(user.public, app.config.secret.token, { expiresInMinutes: app.config.sessionExpiration });
        },
        
        /**
        * Verify the token
        * @return boolean
        **/
        verifyToken: function(token){
            var defer = $q.defer();
            
            jwt.verify(token, app.config.secret.token, {}, function(err, token){
                if(err)
                    defer.reject();
                defer.resolve(token);
            });
            
            return defer.promise;
        },
        
        /**
        * create a new user
        * @param object data { nickname, email, password, ip }
        * @todo Password bug if 0 chars 'cause of the hash
        **/
        create: function(data){
            var deferred = $q.defer();
            var crypto = app.services.CryptoService;
            var salt = crypto.random(32);
            
            app.orm['User'].create({
                nickname: data.nickname,
                email: data.email,
                ip: data.ip,
                roles: this.roles.UPLOADER,
                passwordC: data.password,
                password: crypto.hashPassword(data.password, salt),
                downloadHash: crypto.createMd5Hash(crypto.random(32) + app.config.download),
                salt: salt
            }).then(function success(user){
                app.io.sockets.emit('new-user', user.public);
                deferred.resolve({ ok: 1 });
            }, function error(err){
                deferred.reject({ errors: app.services['ErrorSerializer'].format(err) });
            });
            
            return deferred.promise;
        },
        
        /**
        * Récupère tous les users
        * @return promise
        **/
        getAll: function(){
            return app.orm.User.all();
        },
        
        /**
        * Récupère un user grace a son ID
        * @return promise
        **/
        get: function(id){
            return app.orm.User.find( { id: id } );    
        }
    };
})()];