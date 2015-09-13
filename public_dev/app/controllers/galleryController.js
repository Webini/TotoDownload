angular.module('totodl')
       .controller('GalleryController', [ '$scope', '$location',
function($scope, $location){
    
    $scope.$on('tdgal-click', function($evt, data){
        $location.path(data.link);
        $scope.$apply();
    });
    
}]);   