module.exports = ['UserService', (function(){
    var jwt           = require("jsonwebtoken");
    var app           = require(__dirname + '/../app.js');
    var $q            = require('q');
    var crypt         = require('crypto');
    
    function hashPassword(password, salt){
        var hash = crypt.createHash('sha512')
                        .update(password + salt + app.config.secret.salt)
                        .digest('hex');
        return hash;
    };
    
    function random(length){
        var abc = 'abcdefghijklmnopqrstuvwxyz0123456789';
        var out = '';    

        for(var i = 0; i < length; i++)
            out += abc[Math.floor(Math.random() * (abc.length - 1))];

        return out;
    };
    
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
                    
                    var cPass = hashPassword(data.password, user.salt);
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
            var salt = random(32);
            
            var user = app.orm['User'].create({
                nickname: data.nickname,
                email: data.email,
                ip: data.ip,
                roles: this.roles.UPLOADER,
                passwordC: data.password,
                password: hashPassword(data.password, salt),
                salt: salt
            }).then(function success(data){
                deferred.resolve({ ok: 1 });
            }, function error(err){
                deferred.reject({ errors: app.services['ErrorSerializer'].format(err) });
            });
            
            return deferred.promise;
        }
        
    };
})()];