angular.module('totodl')
       .config(['$routeProvider', function($routeProvider){
            $routeProvider.when('/torrent/:torrent/preview', {
                templateUrl: '/app/views/torrent/preview.html',
                controller: 'TorrentController'
            });
       }])
       .controller('TorrentController', [ '$scope', '$rootScope', '$routeParams', 'SyncService', 
function($scope, $rootScope, $routeParams, SyncService){
    $scope.loadingGlob = true;
    $scope.error = false;
    $scope.torrent = null;
    
    //retreive torrent
    SyncService.get($routeParams.torrent).then(
        function(torrent){
            $scope.torrent = torrent;
        },
        function(err){
            console.debug('GET ERROR => ', err);
            $scope.error = 'TORRENT_NOT_FOUND';
        }
    ).finally(function(){
        $scope.loadingGlob = false;    
    }); 
    
    $rootScope.$on('torrent-change', function(evt, torrent){
        if($scope.torrent && torrent.hash == $scope.torrent.hash)
            $scope.torrent = torrent;
        
        if($scope.$$phase)
            $scope.$apply();
    });
    
}]);