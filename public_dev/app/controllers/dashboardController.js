angular.module('totodl')
       .config(['$routeProvider', function($routeProvider){
            $routeProvider.when('/dashboard', {
                templateUrl: '/app/views/dashboard/dashboard.html',
                controller: 'DashboardController'
            });
       }])
       .controller('DashboardController', [ '$scope', '$rootScope', '$routeParams', 'SyncService', 'User', 'TorrentsService', 'FilterService',
function($scope, $rootScope, $routeParams, SyncService, User, TorrentsService, FilterService){
    $scope.filters = FilterService.filters;
    $scope.filtersComparator = FilterService.comparator;
    $scope.elementsShown = 20;
    
    FilterService.setDefault([
        { name: 'MOVIES', data: { key: 'guessedType', value: 'movie' }},
        { name: 'SERIES', data: { key: 'guessedType', value: 'episode' }},
        { name: 'OTHER_TYPES', data: { key: 'guessedType', value: 'unknown' }},
        { name: '1080P', data: { key: 'screenSize', value: '1080p' }},
        { name: '720P', data: { key: 'screenSize', value: '720p' }}
    ]);
    
    $scope.torrents = SyncService.data.torrents;
    
    $scope.addElementsShown = function(){
        $scope.elementsShown += 20;    
    }
    
    
    var unbindTorrentsChange = $rootScope.$on('torrents-change', function($evt, torrents){
        $scope.torrents = torrents;
        /*if(!$scope.$$phase)
            $scope.$apply();*/
    });
    
    var unbindTorrentChange = $rootScope.$on('torrent-change', function($evt, torrent){
        //disable loading state when we received change notification
        for(var i = 0; i < $scope.torrents.length; i++){
            if($scope.torrents[i].hash == torrent.hash){
                if($scope.torrents[i].loading)
                    $scope.torrents[i].loading = false;
                
                break;
            }
        }
        
        /*if(!$scope.$$phase)
            $scope.$apply();*/
    });
    
    $scope.$on("$destroy", function handler() {
        unbindTorrentsChange();
        unbindTorrentChange();
    });
}]);   