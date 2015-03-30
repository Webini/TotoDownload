angular.module('totodl')
       .directive('torrentDisplay', function(){
  
    return {
        restrict: 'A',
        templateUrl: '/app/views/directives/torrent.html'
    };
});