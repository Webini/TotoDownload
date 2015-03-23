module.exports = function(app){
    var UserManager = app.services['UserManager'];
    return {
        onUploadFiles: function(req, res){
            function respondError(code, message, status){
                if(!status)
                    status = 500;
                
                res.status(status)
                   .json({ error: code, message: message });    
            }
            
            if(req.user.roles & UserManager.roles.UPLOADER && req.files && req.files.file){
                //req.body // req.files
                var file = req.files.file;
                app.torrents.addFile(file.path).then(
                    function success(data){
                        var guessit = require(__dirname + '/../../wrapper/guessit.js');
                        
                        guessit.parse(data.name);
                        
                        res.json(data);
                    },
                    function error(data){
                        respondError(-2, data.error, 403);    
                    }
                );
                
                /*for(var i = 0; i < req.files.length; i++){//req.files
                    console.log(require('util').inspect(req.files[i]));    
                    res.json('lala ' + req.user.nickname + "  //  " + req.user.ip);
                }*/
            }
            else
                respondError(-1, 'insuffisant rights', 403);   
        }
    }
};