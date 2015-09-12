angular.module('totodl')
       .controller('GalleryController', [ '$scope', '$location',
function($scope, $location){
    
    $scope.$on('tdgal-click', function($evt, data){
        console.debug('CLICK FAGG', data.link, data);
        console.debug($location.path(data.link));
        $scope.$apply();
    });
    
}]);   