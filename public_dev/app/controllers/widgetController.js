angular.module('totodl')
       .controller('WidgetController', [ '$scope', '$location', 'User', 'TorrentsService', 'ngDialog', '$sce', 'FilterService', 'VideoService',
function($scope, $location, User, TorrentsService, ngDialog, $sce, FilterService, VideoService){
    $scope.playing = VideoService.playing;
    $scope.Math = Math;
    $scope.roles = User.roles;
    $scope.user = User.get();
    $scope.users = User;
    
    $scope.gotoDetails = function(){
        if(!$scope.smallView){
            var path = '/torrent/' + $scope.torrent.hash + '/' + ($scope.torrent.guessedType != 'unknown' && $scope.torrent.guessedType ? 'preview' : 'files');

            if($scope.playing.torrent && $scope.playing.torrent.id == $scope.torrent.id){
                path += '/' + $scope.playing.file.id;
            }
            
            $location.path(path);
        }
    };
    
    $scope.raw = function(data){
        return $sce.trustAsHtml(data);
    };
    
    //pause the torrent
    $scope.pause = function($evt){
        $scope.torrent.loading = true;
        
        TorrentsService.pause($scope.torrent.hash).then(
            function ok(data){},
            function error(err){ $scope.torrent.loading = false; }
        );
        
        $evt.stopPropagation();
    };
    
    //start the torrent
    $scope.start = function($evt){
        $scope.torrent.loading = true;
        
        TorrentsService.start($scope.torrent.hash).then(
            function ok(data){},
            function error(err){ $scope.torrent.loading = false; }
        );
        
        $evt.stopPropagation();
    };
    
    $scope.remove = function($evt){
        ngDialog.open({
            template: '/app/views/popup/remove.html',
            className: 'ngdialog-theme-toto',
            showClose: false,
            controller: 'RemoveTorrentController',
            data: $scope.torrent
        });
        
        $evt.stopPropagation();
    };
    
    $scope.download = function($evt){
        ngDialog.open({
            template: '/app/views/popup/download.html',
            className: 'ngdialog-theme-toto',
            showClose: false,
            controller: 'DownloadModalController',
            data: $scope.torrent
        });
        
        $evt.stopPropagation();
    };    
    
    $scope.isFilterEnabled = function(){
        return FilterService.isEnabled($scope.torrent.title);
    };
    
    $scope.addFilter = function($evt){
        $evt.stopPropagation();
        
        //si le filtre est deja actif on le desactive
        if($scope.isFilterEnabled()){
            FilterService.disable($scope.torrent.title);
            return;
        }
        
        FilterService.add($scope.torrent.title, {
            key: 'movieId',
            value: $scope.torrent.movieId,
            enabled: true,
            removable: true
        });
        
    };
}]); 