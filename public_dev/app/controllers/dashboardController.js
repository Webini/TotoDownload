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
    
    $scope.roles = User.roles;
    $scope.user = User.get();
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
                console.debug('ERROR => ', err);
            }
        ).finally(function(){
            torrent.loading = false;    
        });
    };
    
    $scope.start = function(torrent){
        torrent.loading = true;
        
        TorrentsService.start(torrent.hash).then(
            function ok(data){
                console.debug('START OK => ', data);    
            },
            function error(err){
                console.debug('START ERR => ', err);
            }
        ).finally(function(){
            torrent.loading = false; 
        });
    };
    
    $rootScope.$on('torrents-change', function(){
        $scope.torrents = SyncService.data.torrents;
        if(!$scope.$$phase)
            $scope.$apply();
    });
}]);   