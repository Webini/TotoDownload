module.exports = function(app){
    var TorrentService = app.services.TorrentService;
    
    return {
        getAll: function(req, res){
            var torrents = TorrentService.getAllFromMemory();
            var out = [];
            
            for(var hash in torrents)
                out.push(torrents[hash].public);
            
            res.json(out);
        }
    }
};