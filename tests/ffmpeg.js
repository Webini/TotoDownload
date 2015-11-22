/*var ffmpeg = require('fluent-ffmpeg');

// make sure you set the correct path to your video file

ffmpeg.ffprobe('/media/nico/Nouveau nom/Films HD/_LW_Quadrilogie_L\'arme.Fatale.II.x264.1080p.Multi.DTS-HDMA-HDZ.mkv',function(err, metadata) {
  console.log('WUUUUT', err, metadata.streams);
});

ffmpeg.ffprobe('/media/nico/Nouveau nom/1969.La colline des bottes.avi',function(err, metadata) {
  console.log('WUUUUT', err, metadata.streams);
});*/

var app  = require('../app/app.js');
var util = require('util');
var TranscodingService = app.services.TranscodingService;
/*
TranscodingService.prepare({ 
    input: '/home/nico/Téléchargements/The.100.S02E13.FASTSUB.VOSTFR.1080p.WEB-DL.DD5.1.H.264-KiNGS.mkv', 
    output: 'adel/dare' 
}).then(
    function(object){
        console.log('FOR => ',  '/home/nico/Téléchargements/The.100.S02E13.FASTSUB.VOSTFR.1080p.WEB-DL.DD5.1.H.264-KiNGS.mkv');
        object.transcode()
              .then(
                function(result){
                    console.log('RESULT => ', result);
                },
                function(err, a, b){
                    console.log('Err => ', err.stack, require('util').inspect(err), typeof err, err.code, b); 
                }
              );
              
             /* setTimeout(function(){
                object.kill();    
              }, 10000);* /
    },
    function(err){
        console.log('Transcode File Error', err);
    }
);
*/TranscodingService.extractThumbnails(
    '/home/nico/adel/d281b6eb934c74dbb651399c873dc0173fad506f/dexter811/Dexter.S08E11.VOSTFR.480p.HDTV.x264-mSD.mkv.480p', 
    '/home/nico/adel/d281b6eb934c74dbb651399c873dc0173fad506f/dexter811/Dexter.S08E11.VOSTFR.480p.HDTV.x264-mSD.mkv',
    '/public/',
    3141
)
.then(function(result){
    
    console.log('OKOK => ', result);
    
})
.catch(function(e, f, g){
    console.log('FUFUFUFU', e, f, g); 
});
