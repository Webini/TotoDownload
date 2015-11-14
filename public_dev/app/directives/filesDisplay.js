angular.module('totodl')
       .directive('filesDisplay', function(){
    
    return {
        restrict: 'E',
        scope: {
            items: '=items',
            streamFiles: '=streamFiles'
        },
        replace: true,
        templateUrl: '/app/views/directives/files.html'
    };
});  