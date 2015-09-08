angular.module('totodl')
       .config(['$routeProvider', function($routeProvider){
            $routeProvider.when('/dashboard/my-uploads', {
                templateUrl: '/app/views/dashboard/myuploads.html',
                controller: 'MyUploadsController'
            });
       }])
       .controller('MyUploadsController', [ '$scope', '$controller', 'User',
function($scope, $controller, User){
    angular.extend(this, $controller('DashboardController', {$scope: $scope}));
    
    $scope.user = User.get();
    
    $scope.myTorrentsFilter = function(element){
		return (element.userId == $scope.user.id);
	};
}]);