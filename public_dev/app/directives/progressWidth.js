angular.module('totodl')
       .directive('progressWidth', function(){
    return {
        restrict: 'A',
        scope: {
            'total': '=progressTotal',
            'done': '=progressDone'
        },
        link: function($scope, $elem, $attr){
            $scope.$watch('done', function(newVal, oldVal){
                if(newVal == oldVal && $scope.checkSame)
                    return;
                
                $scope.checkSame = true;
                $elem.css('width', Math.round($scope.done / $scope.total * 100) + '%');
            });
        } 
    };
});  