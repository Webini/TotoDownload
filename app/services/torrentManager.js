module.exports = ['TorrentManager', (function(){
    var app             = require(__dirname + '/../app.js');
    var $q              = require('q');
    var guessit         = require(__dirname + '/../wrapper/guessit.js');
    var _               = require('underscore');
    
    function getKeywordsFromTitle(title){
        var keywords = title.match(/[a-zA-Z]+/img);
        console.log("KEYWORDS ===> ", require('util').inspect(keywords));
        
        if(!keywords){
            keywords = title;   
        }
        
        return keywords.join(' ');
    }

    return {
        /**
        * Add a torrent
        * @param object user User object with { id, roles, etc... }
        * @param object torrent Torrent objec with { id, hash, name }
        **/
        addTorrent: function(user, file){
            var defer        = $q.defer();
            
            //if the client has successfully added the .torrent
            function addFile(next){
                app.api.torrents.addFile(file.path).then(
                    function success(torrent){
                        //set the torrent uid with our user id 
                        torrent.userId = user.id;
                        torrent.tid = torrent.id;
                        delete torrent.id;
                        
                        next(torrent, saveTorrent);
                    },
                    function error(data){
                        defer.reject({ code: -1, error: data.error });
                    }
                );
            };
            
            //parse torrents informations thank to allocine
            //ca serait plus logique de le faire après ca...
            function moviesdbParse(data, next){
                var moviesdb = app.api.moviesdb;
                
                function onError(data){
                    next(data);   
                }
                //search for a movie
                moviesdb.match(data.guessedTitle, data.guessedType).then(
                    function success(response){
                        //retreive movie info
                        moviesdb.getMovie(response.id).then(
                            function success(rtot){
                                next(_.extend(data, rtot));
                            },
                            onError
                        );
                    },
                    onError
                );
                    /*
                
                var filter = (data.guessedType == 'episode' ? 'tvseries' : 'movie');
                console.log('FILTER => ', filter);
                allocine.api('search', {
                    q: data.guessedTitle,
                    count: 1,
                    filter: filter
                },
                function(error, results){
                    if(!error)
                        console.log(require('util').inspect(results));
                    
                    console.log(require('util').inspect(error), require('util').inspect(results.feed[filter]));
                    next(data);   
                });*/
            };
            
            //retreive the torrent name 
            function getTorrentName(data, next){
                //crapy but guessit will guess the data only if movie has an extension
                if(data.name.charAt(data.name.length - 4) == '.')
                    data.name += '.avi';
                
                //remove the ext after guessit
                //@TODO bug 
                function remExt(data){
                    if(data.name.charAt(data.name.length - 4) == '.')
                        data.name = data.name.substr(0, data.name.length - 4);
                    data.guessedType = parsed.type.value;
                }
                
                guessit.parse(data.name).then(
                    function success(parsed){
                        remExt(data);
                        
                        if(data.guessedType == 'unknown'){
                            next(data);
                            return;
                        }
                        
                        if(data.guessedType === 'movie'){
                            data.guessedTitle = parsed.title.value;
                        }
                        else if(data.guessedType === 'episode'){
                            data.guessedTitle = parsed.series.value;
                        }
                        
                        if(parsed.screenSize){
                            data.screenSize = parsed.screenSize.value;    
                        }
                        
                        moviesdbParse(data, next);
                    },
                    function error(err){
                        remExt(data);
                        next(data);      
                    }
                );
            };
    
            function saveTorrent(torrent){
                if(!torrent.keywords){
                    torrent.keywords = getKeywordsFromTitle(torrent.name);
                }

                app.orm['Torrent']
                   .findOrCreate({ where: torrent })
                   .spread(function(result, created){
                        defer.resolve(result);
                   }).fail(function err(e){
                        app.logger.warn('Cannot add torrent', torrent, e);
                        defer.reject('Cannot add torrent');
                   });
            };
            
            //addFile then getTorrentName [ if ok => allocineParse => ] then saveTorrent
            addFile(getTorrentName);
            
            return defer.promise;
        }
    };
})()];