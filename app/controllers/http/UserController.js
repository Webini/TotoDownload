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
        },
        
        /**
        * get all users
        **/
        onGetUsers: function(req, res){
            app.services.UserService.getAll().then(
                function(users){
                    var out = [];
                    for(var i = 0; i < users.length; i++)
                        out.push(users[i].public);
                    
                    res.json(out);
                },
                function(e){
                    app.logger.log('onGetUsers error', e);
                    res.sendStatus(403);      
                }
            );
                                                   
        },
        
        /**
        * Get one user
        **/
        onGetUser: function(req, res){
            if(!req.body.id)
                return res.sendStatus(403);
            
            app.services.UserService.get(req.body.id).then(
                function(user){
                    res.json(user.public);
                },
                function(e){
                    app.logger.log('onGetUsers error', e);
                    res.sendStatus(403);   
                }
            );
        }
    };
};