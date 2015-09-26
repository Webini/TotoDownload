module.exports = function(allowedRoles){
    var app = require('../app.js');
    var TorrentService = app.services.TorrentService;
    var UserService = app.services.UserService;
    
    if(!allowedRoles)
        allowedRoles = 0;
    /**
    * Check if it's our torrent
    **/
    return function(req, res, next){
        var torrent = TorrentService.getFromMemory(req.body.hash);
        
        if(!torrent || torrent.userId != req.user.id && !(req.user.roles & (UserService.roles.ADMIN | allowedRoles))){
            res.sendStatus(403);
        }
        else{
            req.torrent = torrent;
            return next();        
        }
    };
};