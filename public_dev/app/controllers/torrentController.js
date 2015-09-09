angular.module('totodl')
       .config(['$routeProvider', function($routeProvider){
            $routeProvider.when('/torrent/:torrent/:page', {
                templateUrl: '/app/views/torrent/layout.html',
                controller: 'TorrentController'
            });
       }])
       .controller('TorrentController', [ '$scope', '$rootScope', '$routeParams', 'SyncService', '$sce', 'TorrentsService', 'FilesService', 
function($scope, $rootScope, $routeParams, SyncService, $sce, TorrentsService, FilesService){
    var trailerIdRegex = /([0-9]+)/;
    
    $scope.smallView = '/app/views/directives/torrent.html';
    $scope.pageTemplate = '/app/views/torrent/' + $routeParams.page + '.html';
    $scope.page = $routeParams.page;
    
    $scope.loadingGlob = true;
    $scope.error = false;
    $scope.torrent = null;
    $scope.trailer = null;
    $scope.trailerError = false;
    $scope.trailerLoading = true;
    
    $scope.raw = function(data){
        return $sce.trustAsHtml(data);
    };
    
    $scope.trusted = function(url){
        return $sce.trustAsResourceUrl(url);    
    };
   
    //retreive torrent trailer
    $scope.getTrailer = function(){
        var trailerId = null;
        
        if((trailerId = trailerIdRegex.exec($scope.torrent.trailer)) !== null){
            trailerId = trailerId[1];
        }
        else{
            $scope.trailerLoading = false;
            $scope.trailerError = true;
            return;
        }
        
        TorrentsService.getTrailer(trailerId).then(
            function(data){
                $scope.trailerLoading = false;
                $scope.trailerError = false;
                $scope.trailer = data.hd_path;
                
                if(!$scope.$$phase){
                    $scope.$digest();
                }
            },
            function(err){
                $scope.trailerLoading = false;
                $scope.trailerError = true;      
            }
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