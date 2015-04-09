angular.module('totodl')
       .controller('SearchController', [ '$scope', '$location', '$rootScope', 
function($scope, $location, $rootScope){
    var regClear = /[a-z0-9]+/img;
    console.log('recreate');
    
    $rootScope.search = $location.search().search;
    if(!$rootScope.search)
        $rootScope.search = '';
    
    $scope.torrentsComparator = function(expected){ 
        var actual = $rootScope.search;
        if(('' + actual).length <= 0)
            return true;
        
        expected = expected.name + 
                 ( expected.title ? expected.title : '') + 
                 ( expected.screenSize ? expected.screenSize : '' );
        
        expected = expected.toLowerCase().match(regClear).join(' ');
        
        var keywords = actual.toLowerCase().match(regClear);
        var found = 0;
        
        for(var i in keywords){
            if(expected.indexOf(keywords[i]) > -1) 
                found++;
        }
        
        return (found == keywords.length);
    };
}]); 