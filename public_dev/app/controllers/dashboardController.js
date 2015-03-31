angular.module('totodl')
       .config(['$routeProvider', function($routeProvider){
            $routeProvider.when('/dashboard', {
                templateUrl: '/app/views/dashboard/dashboard.html',
                controller: 'DashboardController'
            });
       }])
       .controller('DashboardController', [ '$scope', '$rootScope', '$routeParams', 'SyncService', 'User', 'TorrentsService', 
function($scope, $rootScope, $routeParams, SyncService, User, TorrentsService){
    console.debug(SyncService.torrents);
    
    $scope.Math = Math;
    $scope.roles = User.roles;
    $scope.user = User.get();
    $scope.users = User;
    $scope.torrents = SyncService.data.torrents;
    //$scope.lastChange = SyncService.data.lastChange;
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
    
    $scope.pause = function(torrent){
        torrent.loading = true;
        
        TorrentsService.pause(torrent.hash).then(
            function ok(data){
                console.debug('PAUSE OK => ', data);    
            },
            function error(err){
                torrent.loading = false;    
                console.debug('ERROR => ', err);
            }
        );
    };
    
    $scope.start = function(torrent){
        torrent.loading = true;
        
        TorrentsService.start(torrent.hash).then(
            function ok(data){
                console.debug('START OK => ', data);    
            },
            function error(err){
                torrent.loading = false;
                console.debug('START ERR => ', err);
            }
        );
    };
    
    $rootScope.$on('torrents-change', function($evt, torrents){
        $scope.torrents = torrents;
        
        if(!$scope.$$phase)
            $scope.$apply();
    });
    
    $rootScope.$on('torrent-change', function($evt, torrent){
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
}]);   