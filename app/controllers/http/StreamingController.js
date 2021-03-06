module.exports = function(app){
    var TorrentService             = app.services.TorrentService;
    var TorrentsTranscoderService  = app.services.TorrentsTranscoderService;
    var DownloadService            = app.services.DownloadService;
    
    function formatQualities(file){
        var ret = [];
        for(var key in file.transcoded){
            ret.push(key);
        }
        return ret;
    };
    
    function getDuration(file){
        for(var key in file.transcoded){
            return Math.floor(file.transcoded[key].duration);
        }
        return 0;
    }
        
    return {
        onGetFiles: function(req, res){
            var torrent = null;
            if(!req.params.torrentHash || !(torrent = TorrentService.getFromMemory(req.params.torrentHash))){
                return res.status(404).end();
            }
            
            torrent.getTranscodedFiles({ order: [['name',  'ASC']] }).then(
                function(files){
                    var out = [];

                    for (var i = 0, sz = files.length; i < sz; i++) {
                        const file = files[i];
                        out.push({
                            qualities: formatQualities(file), 
                            id: file.id, 
                            duration: getDuration(file),
                            name: file.name,
                            thumbs: file.thumbs,
                            subtitles: (file.subtitles ? file.subtitles.map((subtitle) => {
                                subtitle.file = DownloadService.getThumbPath(subtitle.file);
                                return subtitle;
                            }) : []),
                            thumbsImg: (file.thumbs.file ? 
                                            DownloadService.getThumbPath(file.thumbs.file) : 
                                            DownloadService.getThumbPath(file.name, torrent) + '.jpg')
                        });
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
            if(!req.params.torrentHash || !req.params.fileName || !req.params.segmenter)
                return res.status(404).end();
            
            DownloadService.getPlaylistLink(
                req.params.torrentHash, 
                req.params.fileId,
                req.params.segmenter
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
        }
    };
};