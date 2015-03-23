module.exports = function(config){
    var Transmission = require('transmission');
    trans = new Transmission(config);
    
    
    return trans;
};