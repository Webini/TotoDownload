module.exports = ['TorrentsTranscoderService', (function(){
    var app                    = require(__dirname + '/../app.js');
    var $q                     = require('q');
    var _                      = require('underscore');
    var events                 = require('events');
    var TranscodingService     = null;
    
    
    function TorrentsTranscoderService(){
    };
    
    TorrentsTranscoderService.states = {
        WAITING:        0,
        UNTRANSCODABLE: 1,
        TRANSCODABLE:   2,
        QUEUED:         4,
        TRANSCODING:    8,
        TRANSCODED:     16  
    };
    
    TorrentsTranscoderService.ready = function(){
        TranscodingService = app.services.TranscodingService;      
    };
    
    return TorrentsTranscoderService;
    
})()];