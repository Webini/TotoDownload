module.exports = ['TorrentManager', (function(){
    var app             = require(__dirname + '/../app.js');
    var $q              = require('q');
    var guessit         = require(__dirname + '/../wrapper/guessit.js');
    var allocine        = require('allocine-api');
    
    return {
        
        /**
        * Add a torrent
        * @param object user User object with { id, roles, etc... }
        * @param object torrent Torrent objec with { id, hash, name }
        **/
        addTorrent: function(user, file){
            var UserManager  = app.services.UserManager;
            var defer        = $q.defer();
            
            if(!(user.roles & UserManager.roles.UPLOADER)){
                defer.reject({ code: 0, error: 'insuffisant rights' });
                return defer.promise;
            }
            
            //if the client has successfully added the .torrent
            function addFile(next){
                app.torrents.addFile(file.path).then(
                    function success(torrent){
                        //set the torrent uid with our user id 
                        torrent.userId = user.id;
                        torrent.tid = torrent.id;
                        delete torrent.id;
                        
                        next(torrent, saveTorrent);
                    },
                    function error(data){
                        defer.reject({ code: -2, error: data.error });
                    }
                );
            };
            
            //parse torrents informations thank to allocine
            //ca serait plus logique de le faire après ca...
            function allocineParse(data, next){
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
                });
            };
            
            //retreive the torrent name 
            function getTorrentName(data, next){
                guessit.parse(data.name).then(
                    function success(parsed){
                        data.guessedType = parsed.type.value;
                        
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
                        
                        allocineParse(data, next);
                    },
                    function error(err){
                        next(data);      
                    }
                );
            };
    
            function saveTorrent(torrent){
                console.log(" OBJECT TORRENT BEFORE INS => ", require('util').inspect(torrent));
                
                app.orm['Torrent']
                   .findOrCreate({ where: { tid: torrent.id, hash: torrent.hash }, defaults: torrent })
                   .spread(function(torrent, created){
                        defer.resolve(torrent);
                   });
            };
            
            //addFile then getTorrentName [ if ok => allocineParse => ] then saveTorrent
            addFile(getTorrentName);
            
            return defer.promise;
        }
        
    };
})()];