module.exports = function(app){
    var moviesdb             = app.api.moviesdb;
    var TorrentService       = app.services.TorrentService;
    
    return {
        search: function(req, res){
            if(!req.body.query){
                return res.status(404)
                          .end();
            }
            
            var type = (req.body.type === 1 ? 'episode' : 'movie');
            
            moviesdb.search(req.body.query, type, 15).then(
                function(data){
                    res.json(data)
                       .end();
                },
                function(error){
                    res.status(500)
                       .end();
                }
            )
        },
        
        /**
         * When we change the torrent movieId
         */
        set: function(req, res){
            if(!req.params.movieId){
                return res.status(404)
                          .end();
            }       
            
            var movieId = parseInt(req.params.movieId);
            var type = (req.params.type == 1 ? 'episode' : 'movie');
            
            TorrentService.updateMovieId(req.torrent.hash, movieId, type).then(
                function(data){
                    res.json(1)
                       .end();
                },
                function(err){
                    console.log(err);
                    res.status(500)
                       .end();      
                }
            );
            
        }
    };
};