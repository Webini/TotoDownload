angular.module('totodl')
       .config(['$routeProvider', function($routeProvider){
            $routeProvider.when('/top', {
                templateUrl: '/app/views/dashboard/top.html',
                controller: 'BestDownloadsController'
            });
       }])
       .controller('BestDownloadsController', [ '$scope', '$q', 'TorrentsService', 'SyncService', 'digitsDisplay', 
function($scope, $q, TorrentsService, SyncService, digitsDisplay){
    $scope.loading = true;
    $scope.error = null;
    $scope.noResults = false;
    $scope.results = [];
    $scope.relatResults = null;
    
    function handleError(err){
        if(err === false)
            return;
            
        $scope.loading = false;
        $scope.error = 'unk,unk';
    }
    
    //Get the best downloads, then get all torrents and make the yogourt
    TorrentsService.getBestDownloads().then(
        function(data){
            if(data === null || data.length <= 0){
                $scope.noResults = true;
                $scope.loading = false;
                return $q.reject(false);
            }
            
            $scope.relatResults = data;
            
            var hashes = [];
            //retreive only hash
            data.forEach(function(element) {
                hashes.push(element.hash);
            });
            
            return hashes;
        },
        handleError
    )
    .then(function(data){
        return SyncService.get(data);
    })
    .then(
        function(data){
            $scope.loading = false;        
            
            $scope.results = [];
            
            //order results like the original
            for(var i in $scope.relatResults){
                var hash = $scope.relatResults[i].hash;
                data.some(function(torrent){
                    if(torrent.hash == hash){
                        var name = (torrent.title ? torrent.title : torrent.guessedTitle) + ' ';
                        name += (torrent.guessedSeason ? 'S' + digitsDisplay(torrent.guessedSeason, 2) : '');
                        name += (torrent.guessedEpisode ? 'E' + digitsDisplay(torrent.guessedEpisode, 2) : '');
                        
                        $scope.results.push({
                            label: name,
                            image: torrent.poster,
                            link: '/torrent/' + torrent.hash + '/' + (torrent.guessedType != 'unknown' && torrent.guessedType ? 'preview' : 'files')
                        });
                        return true;
                    }
                })
            }
            
            $scope.relatResults = null;
        },
        handleError
    );
}]);   