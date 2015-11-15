var app  = require('../app/app.js');
var util = require('util');
var $q   = require('q');

var TorrentsTranscoderService = app.services.TorrentsTranscoderService;
var TranscodedFiles = app.orm.TranscodedFiles;


TranscodedFiles.all().then(function(files){
    var allPromises = [];
    files.forEach(function(file){
        allPromises.push(TorrentsTranscoderService._fillWithCodecInformations(file.transcoded)
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