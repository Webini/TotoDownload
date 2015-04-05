module.exports = (function(){
    var mutex = false;
    
    function worker(){
        var app = require(__dirname + '/../app.js');
        
        if(mutex)
            return console.log('Mutex lock for synchronizeDatabase');
        
        mutex = true;
        
        app.services.SyncService.databaseSynchronize().then(
            null,
            function err(errors){
                app.logger.log(errors);
            }
        ).finally(function(){
            mutex = false;
        });
    };
    
    return {
        _iid: null,
        
        start: function(){
            if(!this._iid)
                setInterval(worker, 2000);    
        },
        stop: function(){
            if(this._iid){
                clearInterval(this._iid);
                this._iid = null;
            }
        }
    };
})();