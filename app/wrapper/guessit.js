module.exports = (function(){
    var sys      = require('sys')
    var spawn    = require('child_process').spawn;
    var $q       = require('q');

    return {
        parse: function(filename){
            var child = spawn('python', [ __dirname + '/../../bin/usr/local/bin/guessit', '-a', filename ]);
            var defer = $q.defer();
            
            child.stdout.on('data', function(response){
                var data = response.toString()
                                   .replace(/(\r\n|\n|\r)/gm, '')
                                   .match(/found: (\{.*\})/i);
                
                if(data == null || data.length <= 1){
                    defer.reject('unknown error 0');
                    return;
                }
                
                data = data[1];
                
                try{
                    data = JSON.parse(data);
                    console.log(data);
                    
                    defer.resolve(data);
                }
                catch(e){
                    defer.reject('unknown error 1');   
                }
            });
            
            child.stderr.on('data', function(err){
                defer.reject('unknown error');    
            });
            
            return defer.promise;
        }
    };
})();