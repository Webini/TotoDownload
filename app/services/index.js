"use strict";

var fs        = require("fs");
var path      = require("path");
var basename  = path.basename(module.filename);
var services  = {};

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf(".") !== 0) && (file !== basename);
  })
  .forEach(function(file) {
    var service = require(path.join(__dirname, file));
    services[service[0]] = service[1];
  });


services['ready'] = function(){
    for(var name in this){
        if(name != 'ready' && this[name] && this[name].ready)
            this[name].ready();
    }
};

module.exports = services;