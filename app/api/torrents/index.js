module.exports = function(config){
    //select torrent api 
    switch(config.api){
        case "transmission":
            return require(__dirname + '/transmission.js')(config);
 
        default:
            throw new Error("Unknown api");
    }
    
    return null;
};