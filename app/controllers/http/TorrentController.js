module.exports = function(app){
    var TorrentService = app.services.TorrentService;
    var DownloadService = app.services.DownloadService;
    
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
            var torrent = TorrentService.getFromMemory(req.torrent.hash);
            
            if(!torrent.isFinished){
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
            else{
                res.status(403)
                   .json('Torrent already seeded');
            }
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
        },
        
        //'/torrents/download/:torrentHash([a-zA-Z0-9]+)/:userId([0-9]+)/:userHash([a-zA-Z0-9]+)/:fileId([0-9]+)/:fileName'
        onDownload: function(req, res){
            if(!req.params.torrentHash || !req.params.userId || !req.params.userHash || !req.params.fileId || !req.params.fileName)
                return res.status(404);
            
            DownloadService.getDownloadLink(
                req.params.torrentHash, 
                req.params.userId, 
                req.params.userHash, 
                req.params.fileId
            ).then(
                function(location){
                    res.redirect(302, location);    
                },
                function (err){
                    res.status(404)
                       .json(err);
                }
            );
        },
        
        onRawDownload: function(req, res){
            if(!req.params.torrentHash || !req.params.ttlHash || !req.params.fileId || !req.params.ttl || !req.params.fileName)
                return res.status(404);
        
            DownloadService.getLocalPath(
                req.params.torrentHash, 
                req.params.ttlHash, 
                req.params.ttl, 
                req.params.fileId,
                function(err, filePath){
                    if(err){
                        res.status(404)
                           .json(err);
                    }
                    else{
                        res.download(filePath);
                    }
                }
            );
        }
    };
};