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
       
angular.module('totodl').directive('digitsDisplay', ['$filter', '$parse', function($filter, $parse){
    return {
        restrict: 'E',
        replace: true,
        //template: '<span>{{ digits }}</span>',
        link: function($scope, $elem, $attr){
            var length = $parse($attr.length)($scope);
            var digitsDisplay = $filter('digitsDisplay');
            $elem.html('<span></span>');
            var span = $elem.find('span');
            
            $scope.digits = null;
            $scope.$watch($attr.number, function(newVal, oldVal){
                if(newVal == oldVal && $scope.digits !== null)
                    return;
                $scope.digits = digitsDisplay(newVal, length);
                span.html($scope.digits);         
            });
        }
    };
}]);  