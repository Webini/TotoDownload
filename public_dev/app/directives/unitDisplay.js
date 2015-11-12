angular.module('totodl')
       .directive('unitDisplay', function(){
    return {
        restrict: 'E',
        scope: {
            size: '=size',
            suffix: '@suffix'
        },
        template: '{{ sizeLabel }} {{ sizeUnit | translate }}{{ suffix }}',
        link: function($scope, $elem, $attr){
            $scope.sizeLabel = -1;
            
            $scope.$watch('size', function(newVal, oldVal){
                if(newVal == oldVal && $scope.sizeLabel != -1)
                    return;
                
                if(!newVal){
                    $scope.sizeLabel = 0;
                    $scope.sizeUnit = 'B';
                }
                else{
                    if((newVal / 1024 / 1024 / 1024) > 1){
                        $scope.sizeLabel = Math.round(newVal / 1024 / 1024 / 1024 * 100) / 100;
                        $scope.sizeUnit = 'GB';
                    }
                    else if((newVal / 1024 / 1024) > 1){
                        $scope.sizeLabel = Math.round(newVal / 1024 / 1024 * 100) / 100;
                        $scope.sizeUnit = 'MB';
                    }
                    else if((newVal / 1024) > 1){
                        $scope.sizeLabel = Math.round(newVal / 1024 * 100) / 100;
                        $scope.sizeUnit = 'KB';
                    }
                    else{
                        $scope.sizeLabel = Math.round(newVal);
                        $scope.sizeUnit = 'B';
                    }
                }
            });
        } 
    };
}); 