module.exports = function(app){
    var TorrentService       = app.services.TorrentService;
    
    function formatFiles(file){
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
                        out[files[i].name] = formatFiles(files[i]);
                    }
                    
                    res.json(out).end();
                },
                function(){ res.status(500).end() }
            );
        }
    };
};