angular.module('totodl')
       .config(['$routeProvider', function($routeProvider){
            $routeProvider.when('/dashboard', {
                templateUrl: '/app/views/dashboard/dashboard.html',
                controller: 'DashboardController'
            });
       }])
       .controller('DashboardController', [ '$scope', '$rootScope', '$routeParams', 'SyncService', 
function($scope, $rootScope, $routeParams, SyncService){
    console.debug(SyncService.torrents);
    
    $scope.torrents = [];
    $scope.lastChange = SyncService.data.lastChange;
/*
    
    $scope.$watch(
        function(){ return SyncService.data.lastChange; },
        function (newValue, oldValue) {
            console.debug('NEW', newValue, SyncService.data.torrents, $scope.torrents);
            if(newValue != oldValue){
                //angular.extend($scope.torrents, SyncService.data.torrents);
                $scope.torrents = SyncService.data.torrents;
            }
            
        }
    );*/
    
    $rootScope.$on('torrents-change', function(){
        $scope.torrents = SyncService.data.torrents;
        if(!$scope.$$phase)
            $scope.$apply();
    });
}]);   