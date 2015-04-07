angular.module('totodl')
       .directive('digitsDisplay', function(){
    return {
        restrict: 'E',
        scope: {
            length: '=length',
            number: '=number'
        },
        replace: true,
        template: '<span>{{ digits }}</span>',
        link: function($scope, $elem, $attr){
            $scope.digits = null;
            
            $scope.$watch('number', function(newVal, oldVal){
                if(newVal == oldVal && $scope.digits !== null)
                    return;
                
                
                var digits = $scope.number.toString();
                var diff = $scope.length - digits.length;
                var prepend = '';
                
                for(;diff > 0; diff--){
                    prepend += '0';
                }
                
                $scope.digits = prepend + digits; 
            });
        }
    };
});  