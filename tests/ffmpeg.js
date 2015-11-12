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
TranscodingService.transcodeFile({ input: '/media/nico/Nouveau nom/Films HD/_LW_Quadrilogie_L\'arme.Fatale.II.x264.1080p.Multi.DTS-HDMA-HDZ.mkv', output: 'adel/arme' }).then(
    function(ffo){
        console.log('FOR => ',  '/media/nico/Nouveau nom/Films HD/_LW_Quadrilogie_L\'arme.Fatale.II.x264.1080p.Multi.DTS-HDMA-HDZ.mkv');
        ffo.on('progress', function(progress) {
            console.log('Processing: ' + progress.percent + '% done');
        });
        
        ffo.on('error', function(err, stdout, stderr) {
            console.log('Cannot process video: ' + err.message); 
            console.log("stdout:\n" + stdout);
            console.log("stderr:\n" + stderr);
        });
        
        ffo.on('end', function() {
            console.log('Transcoding succeeded !');
        });
        console.log('RUN');
        ffo.run();
    },
    function(err){
        console.log('FUCK', err.stack);
        throw err;
        console.log('Transcode File Error', require('utils').inspect(err));
    }
);*/

/*
TranscodingService.transcodeFile({ input: '/media/nico/Nouveau nom/1969.La colline des bottes.avi', output: 'adel/colline' }).then(
    function(ffo){
        console.log('FOR => ',  '/media/nico/Nouveau nom/1969.La colline des bottes.avi');
        ffo.on('progress', function(progress) {
            console.log('Processing: ' + progress.percent + '% done');
        });
        
        ffo.on('error', function(err, stdout, stderr) {
            console.log('Cannot process video: ' + err.message); 
            console.log("stdout:\n" + stdout);
            console.log("stderr:\n" + stderr);
        });
        
        ffo.on('end', function() {
            console.log('Transcoding succeeded !');
        });
        console.log('RUN');
        ffo.run();
    },
    function(err){
        console.log('FUCK', err.stack);
        throw err;
        console.log('Transcode File Error', require('utils').inspect(err));
    }
);
*/

TranscodingService.transcodeFile({ input: '/media/nico/Nouveau nom/Films HD/Satyricon.mkv', output: 'adel/Nouveau test/test' }).then(
    function(ffo){
        console.log('FOR => ',  '/media/nico/Nouveau nom/Films HD/Satyricon.mkv');

        ffo.on('progress', function(progress) {
            console.log('Processing: ' + progress.percent + '% done');
        });
        
        ffo.on('error', function(err, stdout, stderr) {
            console.log('Cannot process video: ' + err.message); 
            console.log("stdout:\n" + stdout);
            console.log("stderr:\n" + stderr);
        });
        
        ffo.on('end', function() {
            console.log('Transcoding succeeded !');
        });
        console.log('RUN');
        ffo.run();
    },
    function(err){
        console.log('FUCK', err.stack);
        throw err;
        console.log('Transcode File Error', require('utils').inspect(err));
    }
);