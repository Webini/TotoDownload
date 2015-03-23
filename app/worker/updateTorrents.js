module.exports = (function(){
    function worker(){
        /**
         @TODO
        var app = require(__dirname + '/../app.js');
        
        app.torrents.get(function(err, data){
            console.log(require('util').inspect(data));
            throw new Error('STAAAAAPPPP');            
        });
        **/
    };
    
    return {
        _iid: null,
        
        start: function(){
            if(!this._iid)
                setInterval(worker, 200);    
        },
        stop: function(){
            if(this._iid){
                clearInterval(this._iid);
                this._iid = null;
            }
        }
    };
})();