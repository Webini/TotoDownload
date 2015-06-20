angular.module('totodl')
       .directive('filterButton', ['FilterService', '$compile', function(FilterService, $compile){
    
    return {
        restrict: 'E',
        scope: {
            name: '=name',
            data: '=data'
        },
        //replace: true,
        transclude: true,
        template: '<div class="filter" ng-class="{\'disabled\': !data.enabled, \'enabled\': data.enabled}"> \
            {{ name | translate }} \
            <span ng-show="data.removable"> \
                &nbsp;<i class="fa fa-times"></i> \
            </span> \
        </div>',
        link: function($scope, element, attr) {
            element.find('span').on('click', function($evt){
                FilterService.remove($scope.name);
            });
            
            element.on('click', function(){
                if($scope.data.enabled)
                    FilterService.disable($scope.name);
                else 
                    FilterService.enable($scope.name);
                
                $compile(element.contents())($scope);
            });
        }
    };
}]);  