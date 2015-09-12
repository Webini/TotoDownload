angular.module('totodl')
       .service('digitsDisplay', function(){
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
       
angular.module('totodl').directive('digitsDisplay', ['digitsDisplay', function(){
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
                
                return digitsDisplay($scope.number, $scope.length);
            });
        }
    };
}]);  