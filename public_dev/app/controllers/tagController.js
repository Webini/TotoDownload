angular.module('totodl')
       .controller('TagController', [ '$scope', '$route', '$routeParams', 'TagService', 'ngDialog',
function($scope, $route, $routeParams, TagService, ngDialog){
    $scope.results = null;
    $scope.type = null;
    $scope.query = '';
    $scope.loading = false;
    $scope.mdloading = false;
    
    var dialog = null;
    $scope.changeTagDialog = function(movie){
        if(dialog){
            dialog.close();
        }
        
        $scope.movieId = movie.id;
        dialog = ngDialog.open({
            template: '/app/views/tag/modal.html',
            className: 'ngdialog-theme-toto',
            showClose: false,
            controller: this,
            scope: $scope,
            data: movie
        }); 
    };
    
    $scope.getMovieName = function(data){
        if(data.title)
            return data.title;
        return data.originalTitle
    }
    
    //confirmed
    $scope.changeTag = function(){
        $scope.mdloading = true;
        console.debug('TagService.update', $scope.movieId, $scope.type, $routeParams.torrent);
        TagService.update($scope.movieId, $scope.type, $routeParams.torrent).then(
            function(data){    
            },
            function(err){
                console.debug('Error => ', err);
            }
        ).finally(function(){
            $scope.mdloading = false;
            dialog.close();
            $route.current.reload();
        })
    };

    var promise = null;           
    $scope.getResults = function(){
        if($scope.type === null || $scope.query.length <= 0)
            return;
            
        if(promise !== null){
            promise.cancel();
            promise = null;
        }
        
        $scope.loading = true;
        
        promise = TagService.search($scope.query, $scope.type);
        promise.then(
            function(results){
                $scope.results = results;
                promise = null;
            }
        ).finally(function(){
            if(promise === null){
                $scope.loading = false;
            }
        });
    };
           
}]);