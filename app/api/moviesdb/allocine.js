module.exports = function(config){
    var allocine        = require('allocine-api');
    var $q              = require('q');
    var http            = require('http');
    
    return {
         
        /**
        * Search a movie and get informations about it
        * @param string name Movie / Serie name
        * @param string type Movie Type: "episode" || "movie"
        * @return promise if success must return at least an object with a field id
        **/
        match: function(name, type){
            var defer = $q.defer();
            var filter = (type == 'episode' ? 'tvseries' : 'movie');
            
            allocine.api('search', {
                q: name,
                count: 1,
                filter: filter
            },
            function(error, results){
                if(error){
                    console.log(require('util').inspect(error));
                    defer.reject('Api error');
                    return;    
                }
                
                if(results.feed.totalResults <= 0){
                    defer.reject('Result not found');
                    return;
                }
                
                if(!results.feed[filter] || results.feed[filter].length <= 0){
                    defer.reject('Invalid result');
                    return;
                }
                
                results.feed[filter][0].id = results.feed[filter][0].code;
                delete results.feed[filter][0].code;
                
                defer.resolve(results.feed[filter][0]);
            });
            
            return defer.promise;
        },
        
        
        
        /**
         * Get direct trailer links
         * @param int id TrailerID
         */
        getTrailerLink: function(id){
            var defer = $q.defer();
            
            http.get({
                hostname: 'www.allocine.fr',
                path: '/ws/AcVisiondataV4.ashx?media=' + encodeURIComponent(id),
                agent: false,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0; MSAppHost/1.0)'
                }
            }, function(res){
                if(res.statusCode !== 200){
                    defer.reject('Invalid result');
                    return;
                }
                //console.log(res);
                var data = '';
                
                res.on('data', function(chunk) {
                    data += chunk;
                });
        
                res.on('end', function(){
                    var result = {
                        ld_path: null,
                        md_path: null,
                        hd_path: null
                    };
                    
                    var matches = null;
                    if((matches = /AcVisionVideo [\s\S]*ld_path="(.*)"/ig.exec(data)) !== null){
                        result.ld_path = matches[1];    
                    }
                    
                    if((matches = /AcVisionVideo [\s\S]*md_path="(.*)"/ig.exec(data)) !== null){
                        result.md_path = matches[1];
                    }
                    
                    if((matches = /AcVisionVideo [\s\S]*hd_path="(.*)"/ig.exec(data)) !== null){
                        result.hd_path = matches[1];
                    }
                    
                    if(result.ld_path || result.md_path || result.hd_path){
                        defer.resolve(result);
                    }
                    
                    defer.reject('Result not found');
                });
            })
            .on('error', function(err){
                defer.reject('Request error'); 
            });
            
            return defer.promise;
        },
        
        /**
        * Retreive movies information 
        * @param int id Movie / Serie ID
        * @param string type Movie Type: "episode" || "movie"
        * @return promise
        * if success must return object
        * {
        *   runtime: int, //movie runtile, can be null
        *   title: string, //movie title
        *   genre: string, //genre string, can be null
        *   keywords: string, //movie keywords set to movie title if not available
        *   year: int, //movie production year, can be null
        *   poster: string //movie poster link, separated by ", " can be null
        *   synopsis: string, //movie synopsis
        *   synopsisShort: string, //short synopsis
        *   trailer: string, //trailer ID, can be null
        *   directors: string, //movie directors nullable
        *   actors: string, //movie small casting nullable
        *   bluRayReleaseDate: date //blueray release date nullable
        *   releaseDate: date //movie theaters release date nullable
        * }
        **/
        getMovie: function(id, type){
            var defer = $q.defer();
            var filter = (type == 'episode' ? 'tvseries' : 'movie');
            
            allocine.api(filter, {
                code: id,
                profile: 'medium'
            },
            function(error, results){
                if(error){
                    defer.reject('Api error'); 
                    return;
                }
                
                if(results.error){
                    defer.reject(results.error.$ ? results.error.$ : 'Result error');
                    return;
                }
                
                var result = results[filter];
                
                var out = {
                    runtime: result.runtime ? result.runtime : null,
                    title: result.title,
                    keywords: result.keywords,
                    year: result.productionYear ? result.productionYear : null,
                    poster: result.poster ? result.poster.href : null,
                    synopsis: result.synopsis,
                    synopsisShort: result.synopsisShort,
                    trailer: result.trailer ? result.trailer.href : null,
                    release: result.release ? new Date(result.release.releaseDate) : null,
                    bluRayReleaseDate: result.bluRayReleaseDate ? new Date(result.bluRayReleaseDate) : null,
                    directors: (result.castingShort ? result.castingShort.directors : null),
                    actors: (result.castingShort ? result.castingShort.actors : null),
                    genre: ''
                };
                
                var trailerId = null;
                if(out.trailer && (trailerId = /([0-9]+)/.exec(out.trailer)) !== null){
                    out.trailer = trailerId[1]
                }
                
                //dsplay genders
                for(var i = 0, len = result.genre.length; i < len; i++){
                    out.genre += result.genre[i]['$'];
                    if(i < len-1)
                        out.genre += ', ';     
                }
                
                defer.resolve(out);
            });
            
            return defer.promise;
        }
    };
};