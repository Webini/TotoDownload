module.exports = ['TorrentService', (function(){
    var app             = require(__dirname + '/../app.js');
    var $q              = require('q');
    var guessit         = require(__dirname + '/../wrapper/guessit.js');
    var _               = require('underscore');
    var utils           = require('util');
    var events          = require('events');
    var SyncService     = null;
    
    function TorrentService(){
    };
    
    
    TorrentService.ready = function(){
        SyncService = app.services.SyncService;      
    };
    
    /**
    * Remove all special chars from @title
    * @todo purify title crap from filename
    * @param string title 
    * @return string
    **/
    TorrentService._getKeywordsFromTitle = function(title){
        var keywords = title.match(/[a-zA-Z0-9]+/img);
        
        if(!keywords){
            keywords = [ title ];   
        }
        
        return keywords.join(' ');
    };
    
    /**
    * Add a torrent with magnet / http link
    * @param string url
    * @param object User user object
    * @return promise
    **/
    TorrentService._addUrl = function(url, user){
        console.log('_addLink'.toUpperCase());
        return app.api.torrents.addUrl(url).then(
            function success(torrent){
                torrent.userId = user.id;
                torrent.tid = torrent.id;
                delete torrent.id;
                
                return torrent;
            },
            function error(data){
                return $q.reject({ code: -1, error: data.error });      
            }
        );
    };

    /**
    * Add a torrent file
    * @param string file File 
    * @param object User user object
    * @return promise
    **/
    TorrentService._addFile = function(file, user){
        console.log('_addFile'.toUpperCase());
        return app.api.torrents.addFile(file.path).then(
            function success(torrent){
                //set the torrent uid with our user id 
                torrent.userId = user.id;
                torrent.tid = torrent.id;
                delete torrent.id;

                return torrent;
            },
            function error(data){
                return $q.reject({ code: -1, error: data.error });
            }
        );
    };
                          
    TorrentService._addExtension = function(filename){
        if(filename.charAt(filename.length - 4) != '.'){
            return filename + '.avi';
        }
        return filename;
    };
    
    /**
    * Try to guess real name from torrent name
    * @param object torrent { tid: torrentId, hash: torrentHash, name: torrentName } 
    * @return promise
    **/
    TorrentService._getTorrentName = function(torrent){
        console.log('_getTorrentName'.toUpperCase(), TorrentService._addExtension(torrent.name));
        
        return guessit.parse(TorrentService._addExtension(torrent.name)).then(
            function success(parsed){
                torrent.guessedType = parsed.type.value;
                torrent.screenSize = (parsed.screenSize ? parsed.screenSize.value : null);
                
                //if we have 1080p or 720p, etc... and an unknown type we can affirm that this file is a movie
                if(torrent.screenSize && torrent.guessedType == 'unknown') 
                    torrent.guessedType = 'movie';
                
                if(torrent.guessedType == 'unknown'){
                    return $q.resolve(torrent);
                }

                if(torrent.guessedType === 'movie'){
                    torrent.guessedTitle = parsed.title.value;
                }
                else if(torrent.guessedType === 'episode'){
                    torrent.guessedTitle = parsed.series.value;
                    
                    if(parsed.episodeNumber || parsed.season)
                        torrent.guessedEpisode = parsed.episodeNumber.value || parsed.season.value;
                }
                
                return TorrentService._moviesdbParse(torrent);
            },
            function error(err){
                console.log('GET NAME ERR => ', err);
                return $q.resolve(torrent);      
            }
        );
    };

    /**
    * Retrieve informations about our torrent
    * @return promise
    **/
    TorrentService._moviesdbParse = function(torrent){
        console.log('_moviesdbParse'.toUpperCase(), torrent.guessedTitle);
        var moviesdb = app.api.moviesdb;

        function err(e){ 
            torrent.guessedType = 'unknown';
            return $q.resolve(torrent); 
        }
        
        //search for a movie
        return moviesdb.match(torrent.guessedTitle, torrent.guessedType).then(
            function success(response){
                //retreive movie info
                torrent.movieId = response.id;
                return moviesdb.getMovie(response.id, torrent.guessedType).then(
                    function success(rtot){
                        return _.extend(torrent, rtot);
                    },
                    err
                );
            },
            err
        );
    };

    /**
    * If torrent not exist create it in database else return existing row 
    * @param object Torrent object
    * @return promise
    **/
    TorrentService._upsertTorrent = function(torrent){
        if(!torrent.keywords){
            torrent.keywords = TorrentService._getKeywordsFromTitle(torrent.name);
        }
        
        return app.orm.Torrent.upsert(torrent).then(
            function success(ok){
                return app.orm.Torrent.find({ where: { hash: torrent.hash } });
            },
            function err(e){
                app.logger.log('Cannot add torrent', torrent, e);
                return $q.reject('Cannot add torrent', torrent, e);
            }
        );
    };
    
    
    /**
    * Add a torrent
    * @param object user User object with { id, roles, etc... }
    * @param string file Path to the .torrent
    * @return promise
    **/
    TorrentService.addTorrent = function(user, file){
        console.log('addTorrent'.toUpperCase());
        
        return TorrentService._addFile(file, user)
                             .then(TorrentService._getTorrentName)
                             .then(SyncService.updateOne);
    };
    
    /**
    * Add a torrent with link / magnet
    * @param object user User object with { id, roles, etc... }
    * @param string url Http link / magnet
    * @return promise
    **/
    TorrentService.addUrl = function(user, url){
        console.log('addUrl'.toUpperCase());

        return TorrentService._addUrl(url, user)
                             .then(TorrentService._getTorrentName)
                             .then(SyncService.updateOne);
    };
    
    /**
    * Retreive torrent from client torrent ( transmission, uTorrent, ... ) 
    **/
    TorrentService.getAll = function(){
        return app.api.torrents.getAll();
    };
    
    /**
    * Retreive torrents from database
    * @todo
    **/
    TorrentService.getAllFromDb = function(){
        return app.orm.Torrent.all();
    };
    
    /**
    * Retreive torrents from memory
    * @return array
    **/
    TorrentService.getAllFromMemory = function(){
        return app.services.SyncService.getAll();    
    };
    
    /**
    * Retreive a torrent from memory
    * @param string hash Torrent hash
    * @return object
    **/
    TorrentService.getFromMemory = function(hash){
        return app.services.SyncService.get(hash);    
    };
    
    /**
    * Pause a torrent
    * @param string hash Torrent hash
    * @return promise
    **/
    TorrentService.pause = function(hash){
        return app.api.torrents.pause(hash);    
    };
    
    /**
    * Start a torrent
    * @param string hash Torrent hash
    * @return promise
    **/
    TorrentService.start = function(hash){
        return app.api.torrents.start(hash);    
    };
    
    // @todo same with database
    
    return TorrentService;
})()];