var allocine = require(__dirname + '/../app/api/moviesdb/index.js')({ api: 'allocine' });
var inspect = require('util').inspect;

/*
allocine.match('The Big Bang Theory S06E09.720p.HDTV.X264-DIMENSION', 'episode')
        .then(
    function success(data){
        throw new Error('Invalid result for The Big Bang Theory S06E09.720p.HDTV.X264-DIMENSION'); 
    },
    function error(data){
        console.log('ok => ', inspect(data));
    }
);

allocine.match('The Big Bang Theory', 'episode')
        .then(
    function success(data){
        console.log('ok => ', inspect(data));
    },
    function error(data){
        throw new Error('Invalid result for The Big Bang Theory with ' + data);
    }
);

allocine.match('Elementary', 'episode')
        .then(
    function success(data){
        console.log('ok => ', inspect(data));
    },
    function error(data){
        throw new Error('Invalid result for The Big Bang Theory with ' + data);
    }
);

allocine.match('Lethal weapon', 'movie')
        .then(
    function success(data){
        console.log('ok => ', inspect(data));
    },
    function error(data){
        throw new Error('Invalid result for The Big Bang Theory with ' + data);
    }
);

allocine.getMovie(10552, 'episode').then(
    function success(data){
        console.log('ok => ', inspect(data));
    },
    function error(data){
        throw new Error('Invalid result for 2626');
    }
);

allocine.getMovie(262665979788, 'movie').then(
    function success(data){
        throw new Error("Invalid result for 262665979788");     
    },
    function error(data){
        console.log('ok => ', data);   
    }
);*/

allocine.search('l\'arme fatale', 'movie', 10).then(
    function success(data){
        console.log(data);
    },
    function(error){
        console.log(error, '<== shit happened');
    }
);