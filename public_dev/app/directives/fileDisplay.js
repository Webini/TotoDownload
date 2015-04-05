angular.module('totodl')
       .directive('filesDisplay', function(){
    
    return {
        restrict: 'E',
        scope: {
            items: '=items'
        },
        replace: true,
        templateUrl: '/app/views/directives/files.html'
    };
});  