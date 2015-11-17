angular.module('totodl')
       .directive('filesDisplay', [function(){
    //cette directive => SATAN // A refactoriser
    return {
        restrict: 'E',
        scope: {
            items: '=',
            movies: '=movies'
        },
        replace: true,
        templateUrl: '/app/views/directives/files.html'
    };
}]);  