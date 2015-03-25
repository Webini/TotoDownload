var conf = require('../app/config/config.json');
var transmission = require('../app/api/torrents/transmission.js')(conf.torrents);

transmission.get(3).then(
    function(data){
        console.log('DATA => ', data.torrents[0]);   
    },
    function(err){
        console.log('ZERR => ', err);   
    }
);