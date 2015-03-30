angular.module('totodl')
       .config(['$routeProvider', function($routeProvider){
            $routeProvider.when('/dashboard', {
                templateUrl: '/app/views/dashboard/dashboard.html',
                controller: 'DashboardController'
            });
       }])
       .controller('DashboardController', [ '$scope', '$routeParams', 'SyncService', 
function($scope, $routeParams, SyncService){
    console.debug(SyncService.torrents);
    
    $scope.torrents = []; //SyncService.data.torrents;
    $scope.lastChange = SyncService.data.lastChange;

    
    $scope.$watch(
        function(){ return SyncService.data.lastChange; },
        function (newValue, oldValue) {
            console.debug('NEW', newValue, SyncService.data.torrents, $scope.torrents);
            if(newValue != oldValue){
                //angular.extend($scope.torrents, SyncService.data.torrents);
                $scope.torrents = SyncService.data.torrents;
            }
            
        }
    );
}]);   