module.exports = function(config){
    //select torrent api 
    switch(config.api){
        case "allocine":
            return require(__dirname + '/allocine.js')(config);
 
        default:
            throw new Error("Unknown api");
    }
    
    return null;
};