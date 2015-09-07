module.exports = ['ConfigService', (function(){
    var app           = require(__dirname + '/../app.js');
    var $q            = require('q');
    
    var configs = [];
    var initialized = false;
    
    function Config(){};
    
    Config._getAll = function(){
        if(initialized)
            return $q.resolve(configs);
        
        return app.orm.Config.all().then(
            function(data){
                for(var i = 0; i < data.length; i++){
                    configs[data[i].key] = data[i];
                }
                
                initialized = true;
                return configs;
            },
            function(err){
                app.logger.warn('Cannot retreive configuration', err);
                return $q.reject(err);
            }
        );    
    };
    
    /**
    * Define a new configuration
    * @return promise
    **/
    Config.set = function(key, value){
        if(!configs[key]){ //create a new configuration
            return app.orm.Config.create({
                key: key,
                value: value
            }).then(function(conf){
                configs[conf.key] = conf;    
            });
        }
        else{
            configs[key].value = value;
            return configs[key].save();
        }
    };
    
    /**
    * Retreive a configuration
    * @return promise
    **/
    Config.get = function(key){
        if(initialized)
            return (configs[key] ? $q.resolve(configs[key]) : $q.reject('Configuration not found for ' + key));
        
        return Config._getAll().then(
            function(data){
                if(data[key]){
                    return data[key].dataValues;
                }
                return $q.reject('1 Configuration not found for ' + key);
            }
        );
    };
    
    return Config;
    
})()];