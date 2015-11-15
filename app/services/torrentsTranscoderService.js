module.exports = ['TorrentsTranscoderService', (function(){
    var app                    = require(__dirname + '/../app.js');
    var $q                     = require('q');
    var _                      = require('underscore');
    var events                 = require('events');
    var path                   = require('path');
    var util                   = require('util');
    var rmiraf                 = require('rimraf');
    var TranscodingService     = null;
    var SyncService            = null;
    var TorrentService         = null;
    var states                 = {};
    
    var config = {
        "enable": false,
        "types": [ "avi", "mkv", "mp4" ],
        "maxSimult": 1,
        "output": "/var/tmp"
    };
    _.extend(config, app.config.transcoder);
    
    //queue of torrents waiting for processing
    var queue = [];
    //transcoders instances
    var transcoders = [];
    for(var i = 0; i < config.maxSimult; i++){
        transcoders.push({ processing: false });    
    }
    
    function TorrentsTranscoderService(){
    };
    

    TorrentsTranscoderService.ready = function(){
        TranscodingService = app.services.TranscodingService;
        SyncService        = app.services.SyncService; 
        TorrentService     = app.services.TorrentService;
        states             = TorrentService.transcodableStates;
        
        if(config.enable){
            //retreive pending torrent for transcoding
            TorrentService.getAllTranscodableFromDb(
                states.TRANSCODABLE | states.TRANSCODING,
                true
            ).then(function(torrents){
                for(var i = 0; i < torrents.length; i++){
                    TorrentsTranscoderService.addToQueue(torrents[i]);
                }
            });
            
            SyncService.on('download-complete', function(torrent){
                TorrentsTranscoderService.addToQueue(torrent);
            });
            
            SyncService.on('deleted', function(torrent){
                TorrentsTranscoderService.deleteTranscodedFiles(torrent);
            });
        }
    };
    
    /**
     * Retreive full path for the @transcodedFilePath
     * @param string transcodedFilePath relative path
     * @return string
     */
    TorrentsTranscoderService.getFullPath = function(transcodedFilePath){
        return path.join(config.output, transcodedFilePath);
    };
    
    
    /**
     * Check if torrent is transcodable
     * @return boolean
     */
    TorrentsTranscoderService.isTranscodable = function(torrent){
        if(!torrent.files || !torrent.movieId){
            return false;
        }
        
        for(var i = 0; i < torrent.files.length; i++){
            var ext = path.extname(torrent.files[i].name);
            if(config.types.indexOf(ext.substr(1).toLowerCase()) > -1){
                return true;
            }
        }
        
        return false;
    };
    
    /**
     * Remove files from a transcoded torrent
     * @param Torrent torrent
     * @return void
     */
    TorrentsTranscoderService.deleteTranscodedFiles = function(torrent){
        if(!(torrent.transcodableState & (states.TRANSCODABLE | states.TRANSCODING | states.TRANSCODED))){
            return;
        }
        
        if(torrent.transcodableState & (states.TRANSCODABLE | states.TRANSCODING)){
            //remove this torrent from transcoding queue
            for(var i = 0; i < queue.length; i++){
                if(queue[i] == torrent.hash){
                    queue.splice(i, 1);
                    break;
                }
            }
        }
        
        //if torrent is transcoding, we are going to kill ffmpeg instance 
        if(torrent.transcodableState == states.TRANSCODING){
            for(var i = 0; i < transcoders.length; i++){
                if(transcoders[i].torrent == torrent.hash){
                    if(transcoders[i].transObj){
                        transcoders[i].transObj.kill();
                    }
                    break;
                }
            }
        }   
            
        rmiraf(path.join(config.output, torrent.hash), function(err){
            app.logger.log('Delete transcoded files error', err);
        });

    };
    
    /**
     * Add a torrent to the transcoding queue
     * @return boolean True if added else false
     */
    TorrentsTranscoderService.addToQueue = function(torrent){
        if(torrent.leftUntilDone > 0 || !config.enable){ //torrent is downloading or this module is disabled
            return false;
        }
        
        if(TorrentsTranscoderService.isTranscodable(torrent)){
            TorrentsTranscoderService._updateState(torrent, states.TRANSCODABLE);
            queue.push(torrent.hash);
            TorrentsTranscoderService.process();
            return true;
        }
        else{
            TorrentsTranscoderService._updateState(torrent, states.UNTRANSCODABLE);
            return false;
        }
    };
    
    /**
     * Update the @torrent state
     * @return promise
     */
    TorrentsTranscoderService._updateState = function(torrent, newState){
        if(torrent.transcodableState == newState){
            return $q.resolve(torrent);
        }
        
        torrent.transcodableState = newState;
        return SyncService.updateOne(torrent.dataValues);
    };    
    
    /**
     * Process the queue
     */
    TorrentsTranscoderService.process = function(){
        var transcoder = TorrentsTranscoderService._findInactiveTranscoder();
        if(!transcoder || queue.length <= 0){
            return;
        }
        
        //we will work only with torrent hash and then request the data to SyncService to avoid sync problems with database
        transcoder.torrent = queue.splice(0, 1)[0];
        var torrent = TorrentService.getFromMemory(transcoder.torrent);
        
        console.log('TorrentsTranscoderService.process ', torrent.name, torrent.hash);
        
        transcoder.done = [];
        transcoder.processing = true;
        transcoder.original = {
            id: torrent.id,
            files: _.clone(torrent.files),
            path: torrent.downloadDir
        };
        
        transcoder.files = TorrentsTranscoderService._getTranscodableFiles(torrent.files);
        
        return TorrentsTranscoderService._updateState(torrent, states.TRANSCODING)
                                        //remove allready transcoded files (if the transcoding is resumed)
                                        .then(function(torrent) { return TorrentsTranscoderService._removeTranscodedFiles(torrent, transcoder); })
                                        .then(TorrentsTranscoderService._transcodeNextFile)
                                        .then(TorrentsTranscoderService._finalizeTranscoding)
                                        .then(function(){
                                            //to avoid callstack problems
                                            setImmediate(TorrentsTranscoderService.process);
                                        });  
    };
    
    /**
     * Recursive call
     * @return promise
     */
    TorrentsTranscoderService._transcodeNextFile = function(transcoder){
        if(transcoder.files.length <= 0 || transcoder.killed){
            return $q.resolve(transcoder); //TorrentsTranscoderService._finalizeTranscoding(transcoder);
        }
        
        var file = transcoder.files.splice(0, 1)[0];
        console.log('TorrentsTranscoderService._transcodeNextFile', file.name);
        
        var subtitleFile = TorrentsTranscoderService._findSubtitle(transcoder.original.files, file.name);
        var subtitle = null;
        
        //if subtitleFile not found, transcodingService will try to use mkv subtitles
        if(subtitleFile){
            var subfile = path.join(transcoder.original.path, subtitleFile.name);
            var ext     = path.extname(subfile).substr(1).toLowerCase();
            var codec   =((ext == 'ssa' || ext == 'ass') ? 'ass' : 'srt');
            
            subtitle = {
                file: subfile,
                codec: codec
            };
            console.log('TorrentsTranscoderService subtitles founds', subfile, codec);
        }
        
        transcoder.transcoding = file;
        
        return TranscodingService.prepare({
            input: path.join(transcoder.original.path, file.name),
            output: path.join(config.output, transcoder.torrent, file.name),
            subtitle: subtitle
        }).then(
            function(transObj){
                return TorrentsTranscoderService._onTranscoderObjectReady(transObj, transcoder);
            },
            function(err, stdout, stderr){
                app.logger.log('Prepare transcoding error', util.inspect(err), stdout, stderr);
                console.log('Prepare transcoding error', util.inspect(err), stdout, stderr);
                return transcoder;
            }
        ).then(TorrentsTranscoderService._transcodeNextFile);
    };
    
    /**
     * Transcode object and add transcoded file in database
     */
    TorrentsTranscoderService._onTranscoderObjectReady = function(transObj, transcoder){
        transcoder.transObj = transObj;
        return transObj.transcode().then(
            function(result){
                var defer = $q.defer();
                console.log('TorrentsTranscoderService._onTranscoderObjectReady');
                
                app.orm.TranscodedFiles.create({
                    torrentId: transcoder.original.id,
                    name: transcoder.transcoding.name,
                    transcoded: TorrentsTranscoderService._convertToRelativePath(result),
                    createdAt: new Date()
                }).then(function(file){
                    transcoder.done.push(file);
                }).finally(function(){ 
                    defer.resolve(transcoder) 
                });
                
                return defer.promise;
            }, 
            function(err, stdout, stderr){
                app.logger.log('Transcoding error', util.inspect(err), stdout, stderr);
                console.log('Transcoding error', util.inspect(err), stdout, stderr);
                
                if(err == 'killed'){
                    transcoder.killed = true;
                }
                
                return transcoder;  
            }
       );
    };
    
    /**
     * Transformat absolute path from TranscodingService results to relative path
     * @return result array
     */
    TorrentsTranscoderService._convertToRelativePath = function(result){ 
        console.log('TorrentsTranscoderService._convertToRelativePath => ', result);
        var out = {};
        
        for(var quality in result){
            out[quality] = { 
                fullPath: result[quality].fullPath,
                path: result[quality].fullPath.substr(config.output.length) 
            };
        }
        
        return out;
    }
    
    /**
     * Finilize transcoding
     * Set state & clean transcoder object
     * @return transcoder
     */
    TorrentsTranscoderService._finalizeTranscoding = function(transcoder){
        if(!transcoder.killed){
            var state = states.TRANSCODED;
            
            if(transcoder.done.length <= 0){
                state = states.TRANSCODING_ERR;    
            }
            
            var torrent = TorrentService.getFromMemory(transcoder.torrent);
            console.log('TorrentsTranscoderService._finalizeTranscoding', torrent.name, state);
            
            TorrentsTranscoderService._updateState(torrent, state);
        }
        else{
            console.log('TorrentsTranscoderService._finalizeTranscoding instance killed');
        }
        
        delete transcoder.transObj;
        delete transcoder.killed;
        delete transcoder.files;
        delete transcoder.done;
        delete transcoder.original;
        delete transcoder.transcoding;
        delete transcoder.torrent;
        transcoder.processing = false;
        
        return transcoder;
    };
    
    /**
     * Try to find subtitles for file name in files stack
     * @param array files
     * @param string name
     * @return object (file item) or null   
     */
    TorrentsTranscoderService._findSubtitle = function(files, name){
        console.log('TorrentsTranscoderService._findSubtitle for ', name, ' in ', files.length, ' file(s)');
        name    = name.toLowerCase();
        var ext = path.extname(name);
        var variants = [];
        
        if(ext.length > 0){
            var base = name.substr(0, name.length - ext.length);
            variants.push(base + '.srt');
            variants.push(base + '.ssa');
        }
        
        variants.push(name + '.srt');
        variants.push(name + '.ssa'); //ASS format  | ))
        console.log('TorrentsTranscoderService._findSubtitle try variants => ', variants.join(', '));
        
        for(var i = 0; i < files.length; i++){
            if(variants.indexOf(files[i].name.toLowerCase()) > -1){
                return files[i];
            }
        }
        return null;
    }
    
    /**
     * Remove transcoded files in transcoder processor with transcoded files from database //nevermind
     * @return promise
     */
    TorrentsTranscoderService._removeTranscodedFiles = function(torrent, transcoder){
         return torrent.getTranscodedFiles().then(
             function(files){
                transcoder.done = files;
                
                for(var i = 0; i < files.length; i++){
                    var offset = -1;
                    if((offset = TorrentsTranscoderService._getFileOffset(transcoder.files, files[i].name)) !== -1){
                        console.log('TorrentsTranscoderService._removeTranscodedFiles find duplicate file ', files[i].name);
                        transcoder.files.splice(offset, 1);   
                    }
                }
                
                return transcoder;
             }
         );
    };
    
    /**
     * Retreive file offset in array files
     * @return int or -1 if not found
     */
    TorrentsTranscoderService._getFileOffset = function(files, name){
        console.log('TorrentsTranscoderService._getFileOffset ', name);
        for(var i = 0; i < files.length; i++){
            if(files[i].name == name){
                return i;
            }
        }
        return -1;
    };
    
    /**
     * Retreive transcodable files from torrents
     * @param array files
     * @return array files
     */
    TorrentsTranscoderService._getTranscodableFiles = function(files){
        var out = [];
        for(var i = 0; i < files.length; i++){
            var ext = path.extname(files[i].name);
            if(config.types.indexOf(ext.substr(1).toLowerCase()) > -1){
                out.push(files[i]);
            }
        }
        return out;
    };
    
    /**
     * Find an empty transcoder processor 
     * @return object or null if not found
     */
    TorrentsTranscoderService._findInactiveTranscoder = function(){
        for(var i = 0; i < transcoders.length; i++){
            if(!transcoders[i].processing){
                return transcoders[i];
            }
        }  
        return null;
    };
    
    return TorrentsTranscoderService;
    
})()];