module.exports = function(socket){
    var app = require(__dirname + '/../../app.js');
    
    return {
        onUpdateTag: function(tag){
            app.services.SyncService.setSyncTag(socket, tag);
        },
        onUpdateTags: function(tags){
            app.services.SyncService.setSyncTags(socket, tags);
        }
    };
};