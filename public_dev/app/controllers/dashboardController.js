angular.module('totodl')
       .config(['$routeProvider', function($routeProvider){
            $routeProvider.when('/dashboard', {
                templateUrl: '/app/views/dashboard/dashboard.html',
                controller: 'DashboardController'
            });
       }])
       .controller('DashboardController', [ '$scope', '$rootScope', '$routeParams', 'SyncService', 'User', 'TorrentsService', 'ngDialog',
function($scope, $rootScope, $routeParams, SyncService, User, TorrentsService, ngDialog){
    $scope.torrents = SyncService.data.torrents;
    //$scope.lastChange = SyncService.data.lastChange;
    
    var unbindTorrentsChange = $rootScope.$on('torrents-change', function($evt, torrents){
        $scope.torrents = torrents;
        
        if(!$scope.$$phase)
            $scope.$apply();
    });
    
    var unbindTorrentChange = $rootScope.$on('torrent-change', function($evt, torrent){
        //disable loading state when we received change notification
        for(var i = 0; i < $scope.torrents.length; i++){
            if($scope.torrents[i].hash == torrent.hash){
                if($scope.torrents[i].loading)
                    $scope.torrents[i].loading = false;
                
                break;
            }
        }
        
        if(!$scope.$$phase)
            $scope.$apply();
    });
    
    $scope.$on("$destroy", function handler() {
        unbindTorrentsChange();
        unbindTorrentChange();
    });
}]);   