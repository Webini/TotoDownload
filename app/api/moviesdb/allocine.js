module.exports = function(config){
    var allocine        = require('allocine-api');
    var $q              = require('q');
    
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
        *   trailer: string, //link to trailer player, can be null
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
                    genre: ''
                };
                
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