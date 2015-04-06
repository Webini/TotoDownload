angular.module('totodl')
       .controller('RemoveTorrentController', [ '$scope', 'TorrentsService', 
function($scope, TorrentsService){
    
    $scope.torrent = $scope.ngDialogData;
    $scope.loading = false;
    
    $scope.remove = function(){ 
        $scope.torrent.loading = true;
        $scope.loading = true;
        
        TorrentsService.remove($scope.torrent.hash).then(
            function(){
                $scope.closeThisDialog(1);          
            },
            function(){
                $scope.torrent.loading = false;
                $scope.closeThisDialog(1);
            }
        );
        
    }
}]);