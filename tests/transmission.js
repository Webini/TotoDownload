var conf = require('../app/config/config.json');
var transmission = require('../app/api/torrents/transmission.js')(conf.torrents);

transmission.getAll().then(
    function(data){
        console.log('DATA => ', require('util').inspect(data, false, null));   
    },
    function(err){
        console.log('ZERR => ', err);   
    }
);