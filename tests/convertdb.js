var app  = require('../app/app.js');
var util = require('util');
var $q   = require('q');

var TorrentsTranscoderService = app.services.TorrentsTranscoderService;
var TranscodedFiles = app.orm.TranscodedFiles;


TranscodedFiles.all().then(function(files){
    var allPromises = [];
    files.forEach(function(file){
        var transcoded = file.transcoded;
        for(var quality in transcoded){
            delete transcoded[quality]['video_codec'];
            delete transcoded[quality]['audio_codec'];
        }
        
        allPromises.push(TorrentsTranscoderService._fillWithCodecInformations(transcoded)
                                                  .then(TorrentsTranscoderService._convertToRelativePath)
                                                  .then(
            function(result){
                file.transcoded = result;
                console.log('Saving => ', file.name);
                return file.save();
            }
        ));
    });
    
    $q.all(allPromises).then(function(){
        console.log('DONE'); 
    });
    
});