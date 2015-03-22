module.exports = function(app){
    return {
        onRegister: function(req, res){
            req.body.ip = req.ip;
            
            app.services['UserManager'].create(req.body).then(
                function success(data){
                    res.json(data);
                }, 
                function error(err){
                    res.json(err); 
                }
            );
        },
        
        onLogin: function(req, res){
            app.services['UserManager'].login(req.body).then(
                function success(user){
                    if(user.ip != req.ip){
                        user.updateAttributes({
                            ip: req.ip
                        });
                    }
                    
                    var ouser = user.public;
                    ouser['token'] = app.services['UserManager'].getToken(user);
                    res.json(ouser);
                },
                function error(err){
                    res.json({ error: err });
                }
            );
        },
        
        onVerifyToken: function(req, res){
            app.services['UserManager'].verifyToken(req.body.token).then(
                function success(){
                    res.json(true);
                },
                function error(){
                    res.json(false);
                }
            );
        }
    };
};