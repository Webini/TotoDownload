angular.module('totodl')
       .config(['$routeProvider', function($routeProvider){
            $routeProvider.when('/dashboard', {
                templateUrl: '/app/views/dashboard/dashboard.html',
                controller: 'DashboardController'
            });
       }])
       .controller('DashboardController', [ '$scope', '$rootScope', '$routeParams', 'SyncService', 'User', 'TorrentsService', 'FilterService',
function($scope, $rootScope, $routeParams, SyncService, User, TorrentsService, FilterService){
    var regClear = /[a-z0-9]+/img;
    $scope.filters = FilterService.filters;
    $scope.filtersComparator = FilterService.comparator;
    $scope.elementsShown = 20;
    $scope.search = '';
    
    FilterService.setDefault([
        { name: 'MOVIES', data: { key: 'guessedType', value: 'movie' }},
        { name: 'SERIES', data: { key: 'guessedType', value: 'episode' }},
        { name: 'STREAMING', data: { key: 'transcodableState', value: 8 }},
        { name: 'OTHER_TYPES', data: { key: 'guessedType', value: 'unknown' }},
        { name: '1080P', data: { key: 'screenSize', value: '1080p' }},
        { name: '720P', data: { key: 'screenSize', value: '720p' }}
    ]);
    
    $scope.torrents = null;
    $scope.loading = true;
    
    SyncService.getAll().then(function(data){
        $scope.torrents = data;
    }).finally(function(){
        $scope.loading = false; 
    });
    
    $scope.addElementsShown = function(){
        $scope.elementsShown += 20;    
    }
    
    $scope.torrentsComparator = function(expected){ 
        var actual = $scope.search;
        if(('' + actual).length <= 0)
            return true;
        
        expected = expected.name + 
                 ( expected.title ? ' ' + expected.title : '') + 
                 ( expected.screenSize ? ' ' + expected.screenSize : '' ) + 
                 ( expected.genre ? ' ' + expected.genre : '');
        
        expected = expected.toLowerCase().match(regClear).join(' ');
        
        var keywords = actual.toLowerCase().match(regClear);
        var found = 0;
        
        for(var i in keywords){
            if(expected.indexOf(keywords[i]) > -1) 
                found++;
        }
        
        return (found == keywords.length);
    };    
    
    var unbindTorrentsChange = $rootScope.$on('torrents-change', function($evt, torrents){
        $scope.torrents = torrents;
        /*if(!$scope.$$phase)
            $scope.$apply();*/
    });
    
    var unbindTorrentChange = $rootScope.$on('torrent-change', function($evt, torrent){
        //disable loading state when we received change notification
        if ($scope.torrents) {
            for(var i = 0; i < $scope.torrents.length; i++){
                if($scope.torrents[i].hash == torrent.hash){
                    if($scope.torrents[i].loading)
                        $scope.torrents[i].loading = false;
                
                    break;
                }
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
