angular.module('totodl')
       .directive('detachedVideoPlayer', function(){
    return {
        restrict: 'E',
        require: '^videoPlayer',
        scope: {
            enabled: '=enabled'
        },
        link: function($scope, $elem, $attr, $ctrl){
            console.debug($ctrl);
            $scope.$watch('enabled', function(newVal, oldVal){
                if(newVal){
                    $scope.available = true; //$ctrl.isAvailable();
                    $ctrl.detach().appendTo($elem);
                    $ctrl.play();
                }
                else{
                    $ctrl.reattach();
                }
            });
            
            $scope.$on('$destroy', function(){
                if($scope.enabled){
                    $ctrl.reattach(); 
                }
            });
        }
    };
});  