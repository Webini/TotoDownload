module.exports = function(app){
    var TorrentService             = app.services.TorrentService;
    var DownloadService            = app.services.DownloadService;
    var TorrentsDownloadedService  = app.services.TorrentsDownloadedService;
    
    return {
        onGetAll: function(req, res){
            var torrents = TorrentService.getAllFromMemory();
            var out = [];
            
            for(var hash in torrents)
                out.push(torrents[hash].public);
            
            res.json(out)
               .end();
        },
        
        onGetBestDownloads: function(req, res){
            req.user
            TorrentsDownloadedService.getBestDownloads(req.user.id, true, true, 25).then(
                function(data){
                    res.json(data)
                       .end();
                },
                function(err){
                    res.status(500)
                       .end();
                }
            )
        },
        
        onGetTrailer: function(req, res){
            if(!req.params.id){
                return res.status(404).end();
            }
            
            app.api.moviesdb.getTrailerLink(req.params.id).then(
                function(data){
                    res.json(data)
                       .end();
                },
                function(err){
                    res.status(500)
                       .end();
                }
            )
        },
        
        onPause: function(req, res){
            var torrent = req.torrent;
            
            TorrentService.pause(torrent.hash).then(
                function(data){
                    res.json(data).end();
                },
                function(err){
                    res.status(403)
                       .json(err)
                       .end();      
                }
            );
        },
        
        onStart: function(req, res){
            var torrent = TorrentService.getFromMemory(req.torrent.hash);
            
            if(!torrent.isFinished){
                TorrentService.start(torrent.hash).then(
                    function(data){
                        res.json(data)
                           .end();
                    },
                    function(err){
                        res.status(403)
                           .json(err)
                           .end();      
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
                    res.json(1)
                       .end();    
                },
                function(err){
                    res.status(500)
                       .json(err)
                       .end();
                }
            );
        },
        
        //'/torrents/download/:torrentHash([a-zA-Z0-9]+)/:userId([0-9]+)/:userHash([a-zA-Z0-9]+)/:fileId([0-9]+)/:fileName'
        onDownload: function(req, res){
            if(!req.params.torrentHash || !req.params.userId || !req.params.userHash || !req.params.fileId || !req.params.fileName)
                return res.status(404).end();
            
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
                       .json(err)
                       .end();
                }
            );
        },
        
        onRawDownload: function(req, res){
            if(!req.params.torrentHash || !req.params.ttlHash || !req.params.fileId || !req.params.ttl || !req.params.fileName)
                return res.status(404).end();
        
            DownloadService.getLocalPath(
                req.params.torrentHash, 
                req.params.ttlHash, 
                req.params.ttl, 
                req.params.fileId,
                function(err, filePath){
                    if(err){
                        res.status(404)
                           .json(err)
                           .end();
                    }
                    else{
                        res.download(filePath);
                    }
                }
            );
        }
    };
};