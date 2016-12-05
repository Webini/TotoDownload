module.exports = function(app){
    var TorrentService = app.services.TorrentService;
    var UserService = app.services.UserService;
    
    function respondError(res, code, message, status){
        if(!status)
            status = 500;

        res.status(status)
           .json({ error: code, message: message });    
    }
    
    return {
        /**
        * When we upload .torrent
        **/
        onUploadFiles: function(req, res){ 
            if(!req.files || !req.files.file){
                return respondError(res, -1, 'file not found', 500);   
            }
            
            TorrentService.addTorrent(req.user, req.files.file).then(
                function success(data){
                    res.json(data.dataValues);
                },
                function error(data){ 
                    app.logger.log(data, req.user, req.files);
                    res.sendStatus(500);
                }
            );
        },
        
        /**
        * When we send magnet / http torrent link
        **/
        onUploadLink: function(req, res){
            if(!req.body.link || req.body.link.length <= 0){
                return respondError(res, -1, 'link not found', 500);
            }
            
            /**
            * Ne pas utiliser les data de la token c'est fucké
            if(req.user.diskSpace <= req.user.diskUsage && req.user.roles < UserService.roles.ROLE_ADMIN){
                return respondError(res, -3, 'Quotas exceeded', 403);
            }*/
            
            TorrentService.addUrl(req.user, req.body.link).then(
                function success(data){
                    res.json(data.dataValues);   
                },
                function error(data){
                    app.logger.log(data, req.user, req.body);
                    respondError(res, -2, 'Unknown error', 500);    
                }
            );
            
        }
    }
};