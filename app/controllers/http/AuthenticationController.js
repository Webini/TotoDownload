module.exports = function(app){
    return {
        onRegister: function(req, res){
            req.body.ip = req.ip;
            
            app.services.UserService.create(req.body).then(
                function success(data){
                    res.json(data);
                }, 
                function error(err){
                    res.json(err); 
                }
            );
        },
        
        onLogin: function(req, res){
            app.services.UserService.login(req.body).then(
                function success(user){
                    if(user.ip != req.ip){
                        user.updateAttributes({
                            ip: req.ip
                        });
                    }
                    
                    var ouser = user.public;
                    ouser['token'] = app.services.UserService.getToken(user);
                    res.json(ouser);
                },
                function error(err){
                    res.json({ error: err });
                }
            );
        },
        
        onVerifyToken: function(req, res){
            app.services.UserService.verifyToken(req.body.token).then(
                function success(){
                    res.json(1);
                },
                function error(){
                    res.json(0);
                }
            );
        }
    };
};