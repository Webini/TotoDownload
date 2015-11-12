angular.module('totodl')
       .directive('unitDisplay', [ '$translate', function($translate){
    
    function renderView($elem, unit, translations, label, suffix){
        unit = (translations ? translations[unit] : '');
        $elem.html(
            label + ' ' + unit + suffix  
        );
    };
           
    return {
        restrict: 'E',
        link: function($scope, $elem, $attr){
            $scope.sizeLabel = -1;
            $scope.suffix = ($attr.suffix ? $attr.suffix : '');
            var translations = null;
            
            $translate([ 'B', 'GB', 'MB', 'KB' ]).then(function(results){
                translations = results;
                renderView($elem, $scope.sizeUnit, translations, $scope.sizeLabel, $scope.suffix);
            });
            
            var unwatch = $scope.$watch($attr.size, function(newVal, oldVal){
                /*if(newVal == oldVal && $scope.sizeLabel != -1)
                    return;
                */
                
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
                
                renderView($elem, $scope.sizeUnit, translations, $scope.sizeLabel, $scope.suffix);
            });
        } 
    };
}]); 