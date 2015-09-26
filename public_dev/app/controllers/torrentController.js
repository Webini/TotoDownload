angular.module('totodl')
       .config(['$routeProvider', function($routeProvider){
            $routeProvider.when('/torrent/:torrent/:page', {
                templateUrl: '/app/views/torrent/layout.html',
                controller: 'TorrentController'
            });
       }])
       .controller('TorrentController', [ '$scope', '$rootScope', '$routeParams', '$controller', 'User', 'SyncService', '$sce', 'FilesService', 
function($scope, $rootScope, $routeParams, $controller, User, SyncService, $sce, FilesService){
    angular.extend(this, $controller('TrailerController', { $scope: $scope }));
    
    $scope.user = User.get();
    $scope.roles = User.roles;
    
    $scope.smallView = '/app/views/directives/torrent.html';
    $scope.pageTemplate = '/app/views/torrent/' + $routeParams.page + '.html';
    $scope.page = $routeParams.page;
    
    $scope.loadingGlob = true;
    $scope.error = false;
    $scope.torrent = null;
    
    $scope.raw = function(data){
        return $sce.trustAsHtml(data);
    };
    
    $scope.trusted = function(url){
        return $sce.trustAsResourceUrl(url);    
    };
    
    //retreive torrent
    SyncService.get($routeParams.torrent).then(
        function(torrent){
            $scope.torrent = torrent;
            $scope.files = new FilesService(torrent.files);
        },
        function(err){
            $scope.error = 'TORRENT_NOT_FOUND';
        }
    ).finally(function(){
        $scope.loadingGlob = false;    
    }); 
    
    var unbindTorrentChange = $rootScope.$on('torrent-change', function(evt, torrent){
        if($scope.torrent && torrent.hash == $scope.torrent.hash){
            if($scope.torrent.loading)
                $scope.torrent.loading = false;
            
            if(!$scope.$$phase)
                $scope.$apply();
        }
    });
    
    $scope.$on("$destroy", function handler() {
        unbindTorrentChange();
    });
    
}]);