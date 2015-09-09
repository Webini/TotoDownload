var allocine = require('../app/api/moviesdb/allocine.js')({});
var inspect  = require('util').inspect;
var $q       = require('q');
var http     = require('http');


function request(id, callback){
    
var ldPathRegex = /AcVisionVideo [\s\S]*ld_path="(.*)"/ig;
var mdPathRegex = /AcVisionVideo [\s\S]*md_path="(.*)"/ig;
var hdPathRegex = /AcVisionVideo [\s\S]*hd_path="(.*)"/ig;


     http.get({
        hostname: 'www.allocine.fr',
        path: '/ws/AcVisiondataV4.ashx?media=' + encodeURIComponent(id),
        agent: false,
        headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0; MSAppHost/1.0)'
        }
    }, function(res){
        if(res.statusCode !== 200){
            callback('Invalid result', null);
            return
        }
        
        var data = '';
        
        res.on('data', function(chunk) {
            data += chunk;
        });

        res.on('end', function(){
            var result = {
                ld_path: null,
                md_path: null,
                hd_path: null
            };
            
            var matches = null;
            if((matches = ldPathRegex.exec(data)) !== null){
                result.ld_path = matches[1];    
            }
            
            if((matches = mdPathRegex.exec(data)) !== null){
                result.md_path = matches[1];
            }
            
            if((matches = hdPathRegex.exec(data)) !== null){
                result.hd_path = matches[1];
            }
            
            if(result.ld_path || result.md_path || result.hd_path){
                console.log(data.length, 'ALL OK');
                callback(null, result);
            }
            else{
                console.log(data, data.length);
                console.log(result, 'FUFUFU');
                callback('Result not found', null);
            }
        });
    }).on('error', function(err){
        console.log(err, '<=== ERROR');
        callback('Request error', null); 
    });
}

function getTrailerLink(id){
    var defer = $q.defer();
    
    request(id, function(err, ok){
        if(err){
            defer.reject(err);
        } 
        else{
            defer.resolve(ok);
        }
    });
    
    
    return defer.promise;
};

getTrailerLink(19488191, 'movie').then(
    function(data){
        console.log(inspect(data));
    },
    function (err){
        console.log(inspect(err));
    }
);
getTrailerLink(19488191, 'movie').then(
    function(data){
        console.log(inspect(data));
    },
    function (err){
        console.log(inspect(err));
    }
);
getTrailerLink(19488191, 'movie').then(
    function(data){
        console.log(inspect(data));
    },
    function (err){
        console.log(inspect(err));
    }
);