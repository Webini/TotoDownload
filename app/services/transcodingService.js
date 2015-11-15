module.exports = ['TranscodingService', (function(){
    var ffmpeg        = require("fluent-ffmpeg");
    var app           = require(__dirname + '/../app.js');
    var $q            = require('q');
    var path          = require('path');
    var _             = require('underscore');
    var fs            = require('fs')
    var mkdir         = require('mkdirp');
    
    var config = {
        "maxSimult": 1,
        "preferredLang": "^fr.*",
        "debug": false,
        "qualities": []
    };
    _.extend(config, app.config.ffmpeg);
    
    var defaultQuality = null;
    for(var i = 0; i < config.qualities.length; i++){
        if(config.qualities[i].default){
            defaultQuality = config.qualities[i];
        }
    }
    
    if(!defaultQuality){
        throw new Error('Default quality not found in ffmpeg configuration');
    }
    
    var forcedReg = /force/ig; //to find forced subtitles 
    var killedReg = /killed/ig; //to find error when process is killed
    var preferredLangReg = new RegExp(config.preferredLang, 'i');
    
    /**
     * This object is used for controlling the transcoding process
     */
    function TranscoderObject(conf){
        this._conf = conf;
        this._conf._processing = null;
        this.killed = false;
    };
    
    /**
     * Transcode this object
     * @return promise
     */
    TranscoderObject.prototype.transcode = function(){
        var self = this;
        this.killed = false;
        
        /** Create asked directory  **/
        try{
            //var output = path.join(config.output, this._conf.output);
            mkdir.sync(path.dirname(this._conf.output));
        }
        catch(e){}
        
        /**
         * When SIGINT kill ffmpeg
         */
        var killTranscoding = function(){
            self.kill();
        }
        //cleanly unbind once transcoding is done
        var removeProcessBinding = function(){
            process.removeListener('exit', killTranscoding);
        }
        
        process.on('exit', killTranscoding);
        
        return TranscodingService._extractSubtitle(this._conf)
                                 .then(TranscodingService._toffmpegObject)
                                 .then(function(conf){ return self._startTranscoding(conf); })
                                 .catch(function(err, stdout, stderr){
                                     if(typeof err == 'string' && killedReg.test(err) || 
                                         err instanceof Error && killedReg.test(err.message)){
                                         return $q.reject('killed');
                                     }
                                
                                     return $q.reject(err, stdout, stderr); 
                                 })
                                 .finally(function(){
                                     self._removeSubtitles();
                                     removeProcessBinding(); 
                                 });
    };
    
    /**
     * Delete subtitles if they are generated 
     * @return void
     */
    TranscoderObject.prototype._removeSubtitles = function(){
        if(!this._conf.subtitle || !this._conf.subtitle.extracted){
            return;
        }
        //trying to remove file if exists
        try{
            fs.unlinkSync(this._conf.subtitle.file);
        }catch(e){}
    }
    
    /**
     * Internal function that handle ffo transcoding
     */
    TranscoderObject.prototype._startTranscoding = function(conf){
        var defer = $q.defer();
        //skip the transcoding, if kill order is given during the extraction of subtitles
        if(this.killed){
            return $q.reject('killed process');
        }
        
        this._conf = conf;
        /*this._conf.ffo.on('progress', function(progress) {
            console.log('Processing: ' + progress.percent + '% done');
        });*/
        
        this._conf.ffo.on('error', function(err, stdout, stderr) {
            conf._processing = null;
            defer.reject(err, stdout, stderr);
        });
        
        this._conf.ffo.on('end', function() {
            conf._processing = null;
            defer.resolve(conf.return);
        });
        
        this._conf.ffo.run();
        this._conf._processing = conf.ffo;
        
        return defer.promise;
    };
    
    /**
     * Kill the current transcoding if any
     * @return bool
     */
    TranscoderObject.prototype.kill = function(){
        if(this._conf._processing){
            this.killed = true;
            this._conf._processing.kill('SIGKILL');
            return true;
        }
        return false;
    }
    
    function TranscodingService(){
    };
    
    /**
     * Check if quality @quality is defined
     * @return bool
     */
    TranscodingService.qualityExists = function(quality){
        for(var i = 0; i < config.qualities.length; i++){
            if(config.qualities[i].name === quality){
                return true;
            }
        }
        return false;
    };
    
    /**
     * Retreive metadata for file @file
     * @param object conf Object with field input => Full path to string
     * @return promise 
     */
    TranscodingService.getMetadata = function(conf){
        var defer = $q.defer();
        
        ffmpeg.ffprobe(conf.input, function(err, metadata){
            if(err !== null){
                return defer.reject(err);
            }    
            
            conf.metadata = metadata;
            defer.resolve(conf);
        });
        
        return defer.promise;
    };
    
    /**
     * Prepare an new object for transcoding
     * { input: input file, output: output file, subtitles: }
     * @return promise with first param => TranscoderObject
     */
    TranscodingService.prepare = function(conf){        
        return TranscodingService.getMetadata(conf)
                                 .then(TranscodingService._selectTracks)
                                 .then(TranscodingService._selectQualities)
                                 .then(function(conf){
                                     return new TranscoderObject(conf); 
                                 });
                                 /*.then(TranscodingService._extractSubtitle)
                                 .then(TranscodingService._toffmpegObject);*/
    };
    
    /**
     * Find all tracks for a given codec and a specific regex
     * @param string codeType Code type name => video, audio, subtitle ...
     * @param array streams 
     * @param RegExp regex Regex (optional) if not defined all matching codeType are returned
     * @return array
     */
    TranscodingService._findTracks = function(codecType, streams, regex){
        var out = [];
        
        for(var key in streams){
            if(streams[key].codec_type == codecType){
                if(!regex){
                    out.push(streams[key]);
                }
                else if(streams[key].tags){
                    if(regex.test(streams[key].tags.language)){
                        out.push(streams[key]);
                    }
                    else if(regex.test(streams[key].tags.title)){
                        out.push(streams[key]);
                    }
                }
            }
        }
        
        return out;
    }
    
    /**
     * Check if @subtitle is force
     * @return object
     */
    TranscodingService._isSubtitleForced = function(subtitle){
        return (subtitle.disposition.forced || 
                subtitle.tags.NUMBER_OF_FRAMES && subtitle.tags.NUMBER_OF_FRAMES <= 50 ||  //mkvmerge provide data, we try to guess forced subtitle here
                forcedReg.test(subtitle.tags.title));
    };
    
    /**
     * Select right audio & subtitles tracks
     * @return conf object with map option
     */
    TranscodingService._selectTracks = function(conf){
        var allAudioTracks = TranscodingService._findTracks('audio', conf.metadata.streams);
        
        if(allAudioTracks.length <= 0){
            return $q.reject('Audio tracks not found');
        }
        
        var audioTracks    = TranscodingService._findTracks('audio', allAudioTracks, preferredLangReg);
        var subTracks      = TranscodingService._findTracks('subtitle', conf.metadata.streams, preferredLangReg);///^sr.*$/ig);// preferredLangReg);
        conf.map = {};
        
        //audio found
        if(audioTracks.length > 0){
            conf.map.audio = audioTracks[0];
            
            //if requested audio is found, and if we have subtitles we try to incrust forced subtitle  
            for(var i = 0; i < subTracks.length; i++){
                if(TranscodingService._isSubtitleForced(subTracks[i])){
                    conf.map.subtitle = subTracks[i];
                    break;
                }
            }
        } 
        else if(subTracks.length > 0){ //audio with right language not found, we are going to incrust full subtitles
            for(var i = 0; i < subTracks.length; i++){
                if(!TranscodingService._isSubtitleForced(subTracks[i])){
                    conf.map.subtitle = subTracks[i];
                    break;
                }
            }
            
            //if full subtitles weren't found, fallback with forced one
            if(!conf.map.subtitle){
                conf.map.subtitle = subTracks[0];
            }
        }
        
        //if no audio selected, we use the first track
        if(!conf.map.audio){
            conf.map.audio = allAudioTracks[0];
        }
        
        return conf;
    };
    
    /**
     * Retreive right video bitrate 
     * @param object original Original video metadata
     * @param int expected Expected bitrate
     * @return int bitrate 
     */
    TranscodingService._getVideoBitrate = function(original, expected){
        if(original.bit_rate !== 'N/A' && original.bit_rate < expected){
            return original.bit_rate;
        }
        return expected;
    };
    
    /**
     * Select video qualities available for the media
     * @param object conf Video configuration
     * @return object conf
     */
    TranscodingService._selectQualities = function(conf){
        var qualities = [];
        var video = TranscodingService._findTracks('video', conf.metadata.streams);
        
        if(video.length <= 0){
            return $q.reject('Video track not found');
        }
        else{ //select first video track by default
            video = video[0];
            conf.map.video = video;
        }
        
        for(var i = 0; i < config.qualities.length; i++){
            var cHeight = config.qualities[i].height;
            var cWidth  = config.qualities[i].width;
            
            if(video.height >= cHeight){
                var oQal = _.clone(config.qualities[i]);
                oQal.width = Math.round(video.width / video.height * oQal.height); //auto width
                oQal.width = ((oQal.width % 2) !== 0) ? oQal.width+1 : oQal.width; //must be divisible by 2
                oQal.vbitrate = TranscodingService._getVideoBitrate(video, oQal.vbitrate);
                qualities.push(oQal);
            }
            else if(video.width >= cWidth){
                var oQal = _.clone(config.qualities[i]);
                oQal.height = Math.round(video.height / video.width * oQal.width); //auto height
                oQal.height = ((oQal.height % 2) !== 0) ? oQal.height+1 : oQal.height; //must be divisible by 2
                oQal.vbitrate = TranscodingService._getVideoBitrate(video, oQal.vbitrate);
                qualities.push(oQal);
            }
        }
        
        //if no qualities are found use the default quality with options adapted to the current media
        if(qualities.length <= 0){
            var oQal = _.clone(defaultQuality);
            
            oQal.vbitrate = TranscodingService._getVideoBitrate(video, oQal.vbitrate);
            oQal.width = video.width;
            oQal.height = video.height;
            qualities.push(oQal);
        }
        
        conf.qualities = qualities;
        
        return conf;
    };
    
    /**
     * Extract subtitle (only srt are extracted, dvdsub are incrusted on the fly)
     * @param object conf Configuration object
     * @return object field subtitle added the extraction was ok
     */
    TranscodingService._extractSubtitle = function(conf){
        var defer = $q.defer();
        
        //a subtitle file is allready defined or if we haven't found any subtitles
        if(conf.subtitle || !conf.map.subtitle || 
            conf.map.subtitle.codec_name.toLowerCase() !== 'srt' && conf.map.subtitle.codec_name.toLowerCase() !== 'ass'){
            defer.resolve(conf);
            return defer.promise;
        }
        
        var codec = conf.map.subtitle.codec_name.toLowerCase();
        var output = conf.output + '.' + codec;
        var ffo = ffmpeg(conf.input);
        
        ffo.format(codec)
           .outputOptions([
               '-codec:s:0 ' + codec,
               '-map 0:' + conf.map.subtitle.index,
               '-vn',
               '-an'
           ]);

        ffo.on('error', function(err, stdout, stderr) {
            conf._processing = null;
            defer.reject(err, stdout, stderr);
        });
        
        ffo.on('end', function() {
            conf._processing = null;
            conf.subtitle = { codec: codec, file: output, extracted: true };
            
            //sometimes ffmpeg put NULL bytes when extracting ass file
            fs.readFile(output, 'utf8', function(err, data){
                if(err){
                    defer.resolve(conf);
                    return;
                }
                
                var result = data.replace('\x00', '');
                
                fs.writeFile(output, result, 'utf8', function(err){
                    defer.resolve(conf);
                });
            });
        });
        
        ffo.save(output);
        conf._processing = ffo;
        
        return defer.promise;
    };
    
    /**
     * Create ffmpeg object for conversion
     * @return conf object
     */
    TranscodingService._toffmpegObject = function(conf){
        var ffo = ffmpeg(conf.input);
        conf.return = {};
        
        for(var i = 0; i < conf.qualities.length; i++){
            var cQal = conf.qualities[i];
            var outFile = conf.output + '.' + cQal.name;
            var co = ffo.output(outFile);
        
            //trying to remove file if exists
            try{
                fs.unlinkSyn(outFile);
            }catch(e){}
        
            //object that will be returned with paths & qualities informations
            conf.return[cQal.name] = { fullPath: outFile };
            
            var outId = 0;
            var filters = [ { 
                filter: 'scale', 
                inputs: '0:' + conf.map.video.index,
                options: cQal.width + ':' + cQal.height,
                outputs: 'out' + outId
            } ];
            
            var options = [
                '-maxrate ' + parseInt(cQal.maxbitrate / 1024).toString() + 'k',
                '-bufsize ' + parseInt(cQal.maxbitrate * 4 / 1024).toString() + 'k'
            ];
            
            if(config.debug){
                options.push('-t 2');
              //  options.push('-ss 00:01:00');
            }
            
            if(cQal.threads){
                options.push('-threads ' + cQal.threads);
            }
            
            if(cQal.preset){
                options.push('-preset ' + cQal.preset);
            }
            
            if(conf.map.audio){
                options.push('-map 0:' + conf.map.audio.index);
            }
            
            //incrust srt && ass
            if(conf.subtitle){
                filters.push({
                    filter: (conf.subtitle.codec == 'ass' ? 'ass' : 'subtitles'),
                    inputs: 'out' + outId,
                    outputs: 'out' + (++outId),
                    options: {
                        //si: conf.map.subtitle.index,
                        filename: conf.subtitle.file
                    }
                });
            } //incrust dvdsub
            else if(conf.map.subtitle && 
                    conf.map.subtitle.codec_name.toLowerCase() == 'dvdsub'){
                filters.push({
                    filter: 'scale', 
                    inputs: '0:' + conf.map.subtitle.index,
                    options: cQal.width + ':' + cQal.height,
                    outputs: 'sub'
                });
                
                filters.push({
                    filter: 'overlay',
                    options: 'main_w/2-overlay_w/2:main_h-overlay_h',
                    inputs: [ 'out' + outId, 'sub' ],
                    outputs: 'out' + (++outId)
                });
            }
            
            options.push('-map [out' + outId + ']');
            
            co.audioCodec(cQal.acodec)
              .audioBitrate(parseInt(cQal.abitrate / 1024).toString() + 'k')
              .audioChannels(cQal.channel)
              .videoCodec(cQal.vcodec)
              .videoBitrate(parseInt(cQal.vbitrate / 1024).toString() + 'k')
              .complexFilter(filters) //bug https://github.com/fluent-ffmpeg/node-fluent-ffmpeg/issues/464
              .format('mp4')
              .outputOptions(options);
        }
        
        delete conf.map;
        delete conf.qualities;
        delete conf.metadata;
        
        conf.ffo = ffo;
        return conf;
    };

    return TranscodingService;
})()];