module.exports = [ 'syncListener', (function(){
    var app                 = require(__dirname + '/../app.js');
    var SyncService         = app.services.SyncService;
    var UserService         = app.services.UserService;
    var TorrentService      = app.services.TorrentService;
    var $q                  = require('q');
    

    /**
    * Update user disk usage
    * @param Torrent model
    */
    function updateDiskUsage(torrent){
        if(!torrent.userId)
            return null;
        
        return UserService.updateDiskUsage(torrent.userId).then(
            function(user){
                //sync with the view
                SyncService.updateCurrentUser(user);
                return user;
            }
        );
    };
    
    /**
    * Check the disk usage for the owner of the torrent
    * @param Torrent model
    * @return void
    **/
    function checkDiskUsage(torrent){
        var promise = updateDiskUsage(torrent);
        //if torrent is not attached
        if(!promise)
            return;
            
        promise.then(
            function(user){
                if(user.diskUsage > user.diskSpace){
                    SyncService.quotaExceeded(user, torrent);
                    //remove torrent if we have exceeded our quota
                    TorrentService.removeTorrent(torrent.hash);
                }
            }  
        );
    };
    
    
    return {
        ready: function(){
            //SyncService.on('new', methods.new);
            SyncService.on('deleted', updateDiskUsage);
            SyncService.on('user-id-change', checkDiskUsage);
        }        
    };
})() ];