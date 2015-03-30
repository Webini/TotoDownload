module.exports = (function(){
    var mutex = false;
    
    function worker(){
        var app = require(__dirname + '/../app.js');
        
        if(mutex)
            return console.log('MUTEX');
        
        mutex = true;
        
        app.services.TorrentService.getAll().then(function(data){
            app.services.SyncService.update(data);
        }).finally(function(){
            mutex = false;
        });
        
    };
    
    return {
        _iid: null,
        
        start: function(){
            if(!this._iid)
                setInterval(worker, 500);    
        },
        stop: function(){
            if(this._iid){
                clearInterval(this._iid);
                this._iid = null;
            }
        }
    };
})();