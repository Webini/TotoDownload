angular.module('totodl')
       .config(['$routeProvider', function($routeProvider){
            $routeProvider.when('/torrent/:torrent/:page', {
                templateUrl: '/app/views/torrent/layout.html',
                controller: 'TorrentController'
            });
       }])
       .controller('TorrentController', [ '$scope', '$rootScope', '$routeParams', 'SyncService', 'User', '$sce', 'TorrentsService', 'FilesService', 
function($scope, $rootScope, $routeParams, SyncService, User, $sce, TorrentsService, FilesService){
    
    $scope.smallView = '/app/views/directives/torrent.html';
    $scope.pageTemplate = '/app/views/torrent/' + $routeParams.page + '.html';
    $scope.page = $routeParams.page;
    
    $scope.loadingGlob = true;
    $scope.error = false;
    $scope.torrent = null;
    $scope.users = User;
    $scope.user = User.get();
    
    $scope.raw = function(data){
        return $sce.trustAsHtml(data);
    };
    
    $scope.trusted = function(url){
        return $sce.trustAsResourceUrl(url);    
    };
    
    //pause the torrent
    $scope.pause = function(){
        $scope.torrent.loading = true;
        
        TorrentsService.pause($scope.torrent.hash).then(
            function ok(data){},
            function error(err){ $scope.torrent.loading = false; }
        );
    };
    
    //start the torrent
    $scope.start = function(torrent){
        $scope.torrent.loading = true;
        
        TorrentsService.start($scope.torrent.hash).then(
            function ok(data){},
            function error(err){ $scope.torrent.loading = false; }
        );
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