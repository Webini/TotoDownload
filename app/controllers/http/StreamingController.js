module.exports = function(app){
    var TorrentService             = app.services.TorrentService;
    var DownloadService            = app.services.DownloadService;
    
    function formatQualities(file){
        var ret = [];
        for(var key in file.transcoded){
            ret.push(key);
        }
        return ret;
    };
        
    return {
        onGetFiles: function(req, res){
            var torrent = null;
            if(!req.params.torrentHash || !(torrent = TorrentService.getFromMemory(req.params.torrentHash))){
                return res.status(404).end();
            }
            
            torrent.getTranscodedFiles().then(
                function(files){
                    var out = {};
                    for(var i = 0; i < files.length; i++){
                        out[files[i].name] = { qualities: formatQualities(files[i]), id: files[i].id };
                    }
                    
                    res.json(out).end();
                },
                function(){ res.status(500).end() }
            );
        },
        
        onDownload: function(req, res){
            if(!req.params.torrentHash || !req.params.userId || !req.params.userHash || 
                !req.params.fileId || !req.params.fileName || !req.params.quality)
                return res.status(404).end();
            
            DownloadService.getStreamLink(
                req.params.torrentHash, 
                req.params.userId, 
                req.params.userHash, 
                req.params.fileId,
                req.params.quality
            ).then(
                function(location){
                    res.redirect(302, location);    
                },
                function (err, code){
                    res.status(code ? code : 500)
                       .json(err)
                       .end();
                }
            );
        },
        
        onRawDownload: function(req, res){
            if(!req.params.torrentHash || !req.params.quality || !req.params.ttlHash || 
                !req.params.fileId || !req.params.ttl || !req.params.fileName)
                return res.status(404).end();
        
            DownloadService.getStreamLocalPath(
                req.params.torrentHash, 
                req.params.ttlHash, 
                req.params.ttl, 
                req.params.fileId,
                req.params.quality
            ).then(
                function(result){
                    res.download(result.path, result.name);
                },
                function(err, code){
                    res.status(code ? code : 500)
                       .json(err)
                       .end();
                }
            );
        },
        
        onGetFilePlaylist: function(req, res){
            if(!req.params.torrentHash || !req.params.userId || !req.params.userHash || 
                !req.params.fileId || !req.params.fileName || !req.params.quality)
                return res.status(404).end();
            
            DownloadService.getStreamLink(
                req.params.torrentHash, 
                req.params.userId, 
                req.params.userHash, 
                req.params.fileId,
                req.params.quality,
                true
            ).then(
                function(location){
                    res.redirect(302, location);    
                },
                function (err, code){
                    res.status(code ? code : 500)
                       .json(err)
                       .end();
                }
            );
        },
        
        onGetMasterPlaylist: function(req, res){
            var torrent = null;
            if(!req.params.torrentHash || !req.params.fileId || !req.params.userId || !req.params.userHash ||
                !(torrent = TorrentService.getFromMemory(req.params.torrentHash))){
                return res.status(404).end();
            } 
            
            torrent.getTranscodedFile(req.params.fileId).then(
                function(file){
                    var out = "#EXTM3U\n";
                    var transcoded = file.transcoded;
                    for(var quality in transcoded){
                        out += '#EXT-X-STREAM-INF:PROGRAM-ID=1,' +
                               'BANDWIDTH=' + transcoded[quality].bandwidth + ',' + 
                               'RESOLUTION=' + transcoded[quality].resolution + ',' + 
                               'CODECS="' + transcoded[quality].audio_codec + ',' + transcoded[quality].video_codec + '",' + 
                               'NAME="' + quality + "\"\n";
                        out += '/torrents/stream/hls/' + torrent.hash + '/file/' + req.params.userId + '/' + req.params.userHash + '/' + file.id + '/' + quality + '/' + encodeURIComponent(file.name) + ".m3u8\n";
                    }

                    res.send(out).end();
                }
            ).catch(function(e){
                res.json(e.stack);
                res.status(500).end(); 
            });         
        }
    };
};