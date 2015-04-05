var guessit = require(__dirname + '/../app/wrapper/guessit.js');
var inspect = require('util').inspect;

guessit.parse('Wrong.2012.FRENCH.S02e15.DVDRip.XviD.AC3-Smart.avi').then(
    function success(data){
        console.log(inspect(data));
    },
    function error(err){
        console.log(err);      
    }
);