module.exports = (function(){
    var sys      = require('sys')
    var spawn    = require('child_process').spawn;
    var $q       = require('q');
    var path     = require('path');
    
    return {
        parse: function(filename){
            var cwd = path.normalize(__dirname + '/../../bin/usr/local/bin/'); 
            var pythonPath = path.normalize(cwd + '/../lib/python2.7/dist-packages/');
            var guessitPath = path.normalize(cwd + '/guessit');
            var defer = $q.defer();
            
            var child = spawn(
                'python', 
                [ guessitPath, '-a', filename],
                {
                    cwd: cwd, 
                    env: {
                        'PYTHONPATH': pythonPath
                    }
                }
            );
            
            child.stdout.on('data', function(response){
                var data = response.toString()
                                   .replace(/(\r\n|\n|\r)/gm, '')
                                   .match(/found: (\{.*\})/i);
                if(data == null || data.length <= 1){
                    defer.reject('unknown error');
                    return;
                }
                
                data = data[1];
                
                try{
                    data = JSON.parse(data);
                    defer.resolve(data);
                }
                catch(e){
                    defer.reject('unknown error');   
                }
            });
            
            child.stderr.on('data', function(err){
                defer.reject('unknown error', err.toString());    
            });
            
            return defer.promise;
        }
    };
})();