var guessit = require(__dirname + '/../app/wrapper/guessit.js');
var inspect = require('util').inspect;

guessit.parse('Rayman.Legends.XBOX360-iMARS Glitch-Jtag.iso').then(
    function success(data){
        console.log(inspect(data));
    },
    function error(err){
        console.log(err);      
    }
);