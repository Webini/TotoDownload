module.exports = function(app){
    var TorrentService = app.services.TorrentService;
    var UserService = app.services.UserService;
    
    return {
        onGetAll: function(req, res){
            var torrents = TorrentService.getAllFromMemory();
            var out = [];
            
            for(var hash in torrents)
                out.push(torrents[hash].public);
            
            res.json(out);
        },
        
        onPause: function(req, res){
            var torrent = TorrentService.getFromMemory(req.body.hash);
            
            if(!torrent || torrent.userId != req.user.id && !(req.user.roles & UserService.roles.ADMIN)){
                app.logger.log('Trying to pause torrent ', req.body, req.user, torrent);
                return res.sendStatus(403);
            }
            
            TorrentService.pause(torrent.hash).then(
                function(data){
                    res.json(data);
                },
                function(err){
                    res.status(403)
                       .json(err);      
                }
            );
        },
        
        onStart: function(req, res){
            var torrent = TorrentService.getFromMemory(req.body.hash);
            
            if(!torrent || torrent.userId != req.user.id && !(req.user.roles & UserService.roles.ADMIN)){
                app.logger.log('Trying to start torrent ', req.body, req.user, torrent);
                return res.sendStatus(403);
            }
            
            TorrentService.start(torrent.hash).then(
                function(data){
                    res.json(data);
                },
                function(err){
                    res.status(403)
                       .json(err);      
                }
            );
        }
    }
};