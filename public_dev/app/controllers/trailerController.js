angular.module('totodl')
       .controller('TrailerController', [ '$scope', '$sce', 'TorrentsService', 
function($scope, $sce, TorrentsService){   
    $scope.trailer = null;
    $scope.trailerError = false;
    $scope.trailerLoading = true;
    $scope.trailerAutoplay = true;
    
    $scope.trusted = function(url){
        return $sce.trustAsResourceUrl(url);    
    };
   
    $scope.raw = function(data){
        return $sce.trustAsHtml(data);
    };
    
    //retreive torrent trailer
    $scope.getTrailer = function(){
        $scope.trailerLoading = true;
        $scope.trailerError = false;
        
        var trailerId = null;
        
        if((trailerId = /([0-9]+)/.exec($scope.torrent.trailer)) !== null){
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
}]);