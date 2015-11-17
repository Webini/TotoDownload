angular.module('totodl')
       .config(['$routeProvider', function($routeProvider){
            $routeProvider.when('/torrent/:torrent/:page/:id?', {
                templateUrl: '/app/views/torrent/layout.html',
                controller: 'TorrentController'
            });
       }])
       .controller('TorrentController', [ '$scope', '$route', '$rootScope', '$routeParams', '$controller', 'User', 'SyncService', '$sce', 
                                          'FilesService', 'TorrentsService', 'VideoService',
function($scope, $route, $rootScope, $routeParams, $controller, User, SyncService, $sce, FilesService, TorrentsService, VideoService){
    angular.extend(this, $controller('TrailerController', { $scope: $scope }));
    
    var lastRoute = $route.current;
    $scope.$on('$locationChangeSuccess', function(event, a, b) {
        if($route.current.params.torrent == $routeParams.torrent){
            angular.copy($route.current.params, $routeParams);
            $route.current = lastRoute;
        }
    });
    
    console.debug('RECONSTRUCTED FUCKER');
    $scope.user = User.get();
    $scope.roles = User.roles;
    $scope.routeParams = $routeParams;
    //$scope.smallView = '/app/views/directives/torrent.html';
    $scope.pageTemplate = '/app/views/torrent/' + $routeParams.page + '.html';
    $scope.page = $routeParams.page;
    
    $scope.streamFiles = null;
    $scope.loadingGlob = true;
    $scope.error = false;
    $scope.torrent = null;
    $scope.streamFileId = null;
    $scope.playing = VideoService.playing;
    
    $scope.raw = function(data){
        return $sce.trustAsHtml(data);
    };
    
    $scope.trusted = function(url){
        return $sce.trustAsResourceUrl(url);    
    };
    
    function updateStreamingFiles(){
        if(!$scope.torrent || $scope.torrent.transcodableState != 8){
            return;
        }
        
        TorrentsService.getStreamingFiles($scope.torrent.hash).then(
            function(data){
                $scope.streamFiles = data;
                $scope.streamFileId = $routeParams.id;
            }
        );
    }
    
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
    
    function findStreamFileById(id){
        for(var key in $scope.streamFiles){
            if($scope.streamFiles[key].id == id){
                return $scope.streamFiles[key];
            }
        }
    };
    
    $scope.$watch('torrent.transcodableState', updateStreamingFiles);
    
    $scope.$watch('routeParams.id', function(newVal, oldVal){
        //if streamFiles is initialized
        if($scope.streamFiles !== null){
            $scope.streamFileId = newVal; 
        }
    });
    
    $scope.$watch('streamFileId', function(newVal, oldVal){
        if(newVal === oldVal){
            return;
        }
        if(newVal == null){
            if($scope.playing.torrent && $scope.playing.torrent.id == $scope.torrent.id){
                VideoService.stop();
            }
        }
        else{
            VideoService.play($scope.torrent, findStreamFileById(newVal));
        }
    });
    
    $scope.$on("$destroy", function handler() {
        unbindTorrentChange();
    });
    
}]);