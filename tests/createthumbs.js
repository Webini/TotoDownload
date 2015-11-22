var app  = require('../app/app.js');
var util = require('util');
var $q   = require('q');
var path = require('path');
var TorrentsTranscoderService = app.services.TorrentsTranscoderService;

var TranscodingService = app.services.TranscodingService;
var TranscodedFiles = app.orm.TranscodedFiles;

var files = [];

TranscodedFiles.all().then(function(cfiles){
    var allPromises = [];
    files = cfiles;
    
    function executeNext(){
        if(files.length <= 0){
            return $q.resolve();
        }
        
        var file = files.splice(0, 1)[0];
        return createThumb(file);
    }
    
    function createThumb(file){
        if(file.thumbs){
            return executeNext();
        }
        
        return file.getTorrent().then(function(torrent){
            var transcoded = file.transcoded;
            var item = { bandwidth: 0 };
            
            for(var key in transcoded){
                if(transcoded[key].bandwidth > item.bandwidth){
                    item = transcoded[key]
                }
            }
            
            var input   = TorrentsTranscoderService.getFullPath(item.path);
            var outpath = input;
            var ext     = path.extname(input);
            outpath     = outpath.substr(0, outpath.length - ext.length);        
            
            console.log('processing ==> ', torrent.name);
            return TranscodingService.extractThumbnails(
                input, //in
                outpath,  //o
                item.duration
            ).then(
                function(result){
                    file.thumbs = result.meta;
                    console.log('thumb generated for => ', outpath);
                    return file.save();
                }
            );
       }).then(executeNext);
    }
    
    executeNext().then(function(){
        console.log('FINISH');
    });
    
});