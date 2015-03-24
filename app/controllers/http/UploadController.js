module.exports = function(app){
    var UserManager = app.services['UserManager'];
    var TorrentManager = app.services['TorrentManager'];
    
    return {
        onUploadFiles: function(req, res){
            function respondError(code, message, status){
                if(!status)
                    status = 500;
                
                res.status(status)
                   .json({ error: code, message: message });    
            }
            
            if(!req.files || !req.files.file){
                return respondError(-1, 'file not found', 500);   
            }
            
            TorrentManager.addTorrent(req.user, req.files.file).then(
                function success(data){
                    console.log(require('util').inspect(data));
                    res.json(data);
                },
                function error(data){
                    console.log(require('util').inspect(data));      
                }
            );
                                                        
            
            /*
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

            }
            else
                respondError(-1, 'insuffisant rights', 403);   */
        }
    }
};