angular.module('totodl')
       .controller('WidgetController', [ '$scope', 'User', 'TorrentsService', 
function($scope, User, TorrentsService){
    
    $scope.Math = Math;
    $scope.roles = User.roles;
    $scope.user = User.get();
    $scope.users = User;
    
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
}]);