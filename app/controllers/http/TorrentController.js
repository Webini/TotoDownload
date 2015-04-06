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
            var torrent = req.torrent;
            
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
            var torrent = req.torrent;
            
            TorrentService.start(torrent.hash).then(
                function(data){
                    res.json(data);
                },
                function(err){
                    res.status(403)
                       .json(err);      
                }
            );
        },
        
        onRemove: function(req, res){
            var torrent = req.torrent;
            
            TorrentService.removeTorrent(torrent.hash).then(
                function(data){
                    res.json(1);    
                },
                function(err){
                    res.status(500)
                       .json(err);
                }
            );
        }
    }
};