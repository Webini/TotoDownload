const TotoTranscoder = require('toto-transcoder');

module.exports = ['TranscodingService', (function(){
    var app = require(__dirname + '/../app.js');
    return new TotoTranscoder(app.config.ffmpeg);
})];