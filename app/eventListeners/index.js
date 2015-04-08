"use strict";

var fs        = require("fs");
var path      = require("path");
var basename  = path.basename(module.filename);
var eventListeners  = {};

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf(".") !== 0) && (file !== basename);
  })
  .forEach(function(file) {
    var eventListener = require(path.join(__dirname, file));
    eventListeners[eventListener[0]] = eventListener[1];
  });


eventListeners['ready'] = function(){
    for(var name in this){
        if(name != 'ready' && this[name] && this[name].ready)
            this[name].ready();
    }
};

module.exports = eventListeners;