var allocine = require('../app/api/moviesdb/allocine.js')({});
var inspect  = require('util').inspect;


allocine.match('Fury').then(
    function(ret){
        console.log(ret.id, ret);
        return allocine.getMovie(ret.id, 'movie').then(
            function(ret){
                console.log('movie ret', ret);
            }
        );
    },
    function(err){
        console.log(inspect(err));   
    }
);