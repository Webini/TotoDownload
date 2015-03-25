var conf = require('../app/config/config.json');
var transmission = require('../app/api/torrents/transmission.js')(conf.torrents);

transmission.get().then(
    function(data){
        console.log('DATA => ', require('util').inspect(data.torrents, false, null));   
    },
    function(err){
        console.log('ZERR => ', err);   
    }
);