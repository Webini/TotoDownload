module.exports = ['TorrentsTranscoderService', (function(){
    var app                    = require(__dirname + '/../app.js');
    var $q                     = require('q');
    var _                      = require('underscore');
    var events                 = require('events');
    var TranscodingService     = null;
    
    
    function TorrentsTranscoderService(){
    };
    
    TorrentsTranscoderService.ready = function(){
        TranscodingService = app.services.TranscodingService;      
    };
    
    return TorrentsTranscoderService;
    
})()];