angular.module('totodl')
       .config(['$routeProvider', function($routeProvider){
            $routeProvider.when('/dashboard', {
                templateUrl: '/app/views/dashboard/dashboard.html',
                controller: 'DashboardController'
            });
       }])
       .controller('DashboardController', [ '$scope', '$rootScope', '$routeParams', 'SyncService', 'User', 'TorrentsService', 
function($scope, $rootScope, $routeParams, SyncService, User, TorrentsService){
    $scope.Math = Math;
    $scope.roles = User.roles;
    $scope.user = User.get();
    $scope.users = User;
    $scope.torrents = SyncService.data.torrents;
    //$scope.lastChange = SyncService.data.lastChange;

    $scope.pause = function(torrent){
        torrent.loading = true;
        
        TorrentsService.pause(torrent.hash).then(
            function ok(data){},
            function error(err){ torrent.loading = false; }
        );
    };
    
    $scope.start = function(torrent){
        torrent.loading = true;
        
        TorrentsService.start(torrent.hash).then(
            function ok(data){},
            function error(err){ torrent.loading = false; }
        );
    };
    
    var unbindTorrentsChange = $rootScope.$on('torrents-change', function($evt, torrents){
        $scope.torrents = torrents;
        
        if(!$scope.$$phase)
            $scope.$apply();
    });
    
    var unbindTorrentChange = $rootScope.$on('torrent-change', function($evt, torrent){
        //disable loading state when we received change notification
        
        for(var i = 0; i < $scope.torrents.length; i++){
            if($scope.torrents[i].hash == torrent.hash){
                //$scope.torrents[i] = $torrent
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