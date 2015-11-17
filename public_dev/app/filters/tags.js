angular.module('totodl')
	   .filter('tags', function() {
    return function(tags, filter) {
        var keyFilter = null;
        var valueFilter = null;
        
        for(var key in filter){
            keyFilter = key;
            valueFilter = filter[key];
            break;
        }
        
        var out = {};
        
        for(var key in tags){
            if(tags[key][keyFilter] === valueFilter){
                out[key] = tags[key];
            }
        }
        
        return out;
    }
});
