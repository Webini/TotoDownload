angular.module('totodl')
       .directive('unitDisplay', function(){
    return {
        restrict: 'E',
        scope: {
            speed: '=speed',
            suffix: '@suffix'
        },
        template: '{{ label }}',
        link: function($scope, $elem, $attr){
            console.log('YOLOLOLO');
            
            $scope.$watch('speed', function(newVal, oldVal){
                if(!newVal){
                    $scope.label = 0 + ' b' + $scope.suffix;
                }
                else{
                    if((newVal / 1024 / 1024) > 1)
                        $scope.label = Math.round(newVal / 1024 / 1024 * 100) / 100 + ' Mb' + $scope.suffix;
                    else if((newVal / 1024) > 1)
                        $scope.label = Math.round(newVal / 1024 * 100) / 100 + ' Kb' + $scope.suffix;
                    else
                        $scope.label = Math.round(newVal) + ' b' + $scope.suffix;
                }
            }, true);
        }
    };
}); 