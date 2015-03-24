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
                    res.json(data.dataValues);
                },
                function error(data){ 
                    res.sendStatus(500);
                }
            );
        }
    }
};