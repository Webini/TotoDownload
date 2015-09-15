angular.module('totodl')
       .filter('digitsDisplay', function(){
    return function(data, length){
        data = data.toString();                
        var diff = length - data.length;
        var prepend = '';
        
        for(;diff > 0; diff--){
            prepend += '0';
        }
        
        return prepend + data; 
    };
});
       
angular.module('totodl').directive('digitsDisplay', ['$filter', function($filter){
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
            var digitsDisplay = $filter('digitsDisplay');
            
            $scope.$watch('number', function(newVal, oldVal){
                if(newVal == oldVal && $scope.digits !== null)
                    return;
                    
                $scope.digits = digitsDisplay($scope.number, $scope.length);
            });
        }
    };
}]);  