var app  = require('../app/app.js');
var util = require('util');
var $q   = require('q');
var path = require('path');
var TorrentsTranscoderService = app.services.TorrentsTranscoderService;

var TranscodingService = app.services.TranscodingService;
var TranscodedFiles = app.orm.TranscodedFiles;


TranscodedFiles.all().then(function(files){
    var allPromises = [];
    files.forEach(function(file){
        file.getTorrent().then(function(torrent){
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
            
            allPromises.push(
                TranscodingService.extractThumbnails(
                    input, //in
                    outpath,  //o
                    item.duration
                ).then(
                    function(result){
                        file.thumbs = result.meta;
                        console.log('thumb generated for => ', outpath);
                        return file.save();
                    }
                )
        );
       });
    });
    
    $q.all(allPromises).then(function(){
        console.log('DONE'); 
    });
    
});