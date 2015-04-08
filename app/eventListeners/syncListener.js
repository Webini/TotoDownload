module.exports = [ 'syncListener', (function(){
    var app                 = require(__dirname + '/../app.js');
    var SyncService         = app.services.SyncService;
    var UserService         = app.services.UserService;
    
    var methods = {
        /**
        * Check the disk usage for the owner of the torrent
        * @param Torrent model
        * @return void
        **/
        checkDiskUsage: function(torrent){
            if(!torrent.userId)
                return;
            
            UserService.updateDiskUsage(torrent.userId).then(
                function(user){
                    /**
                    * @todo
                    * dans le cas d'un upload de masse de torrent, il y a des chances pour que le serveur ne soit pas suffisament réactif
                    * du coup il faudrait rechecker si le mec a pas pété son quota et lui supprimer le(s) torrent(s) 
                    **/
                }
            );
        }
    };
    
    methods['ready'] = function(){
        //SyncService.on('new', methods.new);
        SyncService.on('deleted', methods.checkDiskUsage);
        SyncService.on('user-id-change', methods.checkDiskUsage);
    };
        
    return methods;
})() ];