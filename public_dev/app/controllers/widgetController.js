angular.module('totodl')
       .controller('WidgetController', [ '$scope', '$location', 'User', 'TorrentsService', 'ngDialog', 
function($scope, $location, User, TorrentsService, ngDialog){
    
    $scope.Math = Math;
    $scope.roles = User.roles;
    $scope.user = User.get();
    $scope.users = User;
    
    $scope.gotoDetails = function(){
        if(!$scope.smallView){
            var path = '/torrent/' + $scope.torrent.hash + '/' + ($scope.torrent.guessedType != 'unknown' && $scope.torrent.guessedType ? 'preview' : 'files');
            $location.path(path);
        }
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
}]); 