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
/*
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
);*/
/*
TranscodingService.transcodeFile({ input: '/media/nico/Nouveau nom/Films HD/Exodus.Gods.and.Kings.2014.MULTi.1080p.BluRay.x264-itamma.mkv', output: 'adel/exodus' }).then(
    function(ffo){
        console.log('FOR => ',  '/media/nico/Nouveau nom/Films HD/Exodus.Gods.and.Kings.2014.MULTi.1080p.BluRay.x264-itamma.mkv');

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
TranscodingService.transcodeFile({ input: '/media/nico/Nouveau nom/Films HD/Jurassic Park 3 - 1080p FR EN x264 ac3 mHDgz.mkv', output: 'adel/jura' }).then(
    function(ffo){
        console.log('FOR => ',  '/media/nico/Nouveau nom/Films HD/Jurassic Park 3 - 1080p FR EN x264 ac3 mHDgz.mkv');

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
Qualitée qui prend chère =>
TranscodingService.transcodeFile({ input: '/media/nico/Nouveau nom/Films HD/_Star.Trek.Into.Darkness.2013.MULTi.1080p.BluRay.x264-LOST_lost-startrekid.1080p.mkv', output: 'adel/trek' }).then(
    function(ffo){
        console.log('FOR => ',  '/media/nico/Nouveau nom/Films HD/_Star.Trek.Into.Darkness.2013.MULTi.1080p.BluRay.x264-LOST_lost-startrekid.1080p.mkv');

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
TranscodingService.transcodeFile({ input: '/media/nico/Nouveau nom/Films HD/_The Lone Ranger 2013 MULTi TRUEFRENCH 1080p BluRay x264_The Lone Ranger 2013 MULTi TRUEFRENCH 1080p BluRay x264.mkv', output: 'adel/lone' }).then(
    function(ffo){
        console.log('FOR => ',  '/media/nico/Nouveau nom/Films HD/_The Lone Ranger 2013 MULTi TRUEFRENCH 1080p BluRay x264_The Lone Ranger 2013 MULTi TRUEFRENCH 1080p BluRay x264.mkv');

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
TranscodingService.transcodeFile({ input: '/media/nico/Nouveau nom/Series/Daredevil/Marvels.Daredevil.S01E01.VOSTFR.720p.WEBRip.x264.AC3-MuskeTeerS.mkv', output: 'adel/dare' }).then(
    function(ffo){
        console.log('FOR => ',  '/media/nico/Nouveau nom/Series/Daredevil/Marvels.Daredevil.S01E01.VOSTFR.720p.WEBRip.x264.AC3-MuskeTeerS.mkv');

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
              }, 10000);*/
    },
    function(err){
        console.log('Transcode File Error', err);
    }
);