angular.module('totodl')
       .config(['$routeProvider', function($routeProvider){
            $routeProvider.when('/wishes', {
                templateUrl: '/app/views/wishes/index.html',
                controller: 'WishesController'
            });
       }])
       .controller('WishesController', [ '$scope', '$q', '$location', '$controller', '$filter', 
function($scope, $q, $location, $controller, $filter){
    
    
}]);