angular.module('totodl')
       .directive('torrentDisplay', ['$parse', '$rootScope', 'User', function($parse, $rootScope, User){
  
    return {
        restrict: 'A',
        templateUrl: '/app/views/directives/torrent.html',
        controller: 'WidgetController',
        scope: true,
        link: function($scope, $elem, $attrs){
            $scope.$watch($attrs.torrentDisplay, function(newVal, oldVal){
                if(newVal === null || newVal === oldVal && newVal != $scope.torrent) {
                    return;        
                }
                
                var oldName = $scope.username;
                $scope.torrent = newVal;
                $scope.username = User.get($scope.torrent.userId).nickname;
                
                if(oldName != $scope.username && !$scope.$$phase){
                    $scope.$digest();
                }
            });
            
            var unwatch = $rootScope.$on('torrent-change', function($evt, torrent){
                if($scope.torrent && $scope.torrent.hash === torrent.hash){
                    $scope.torrent = torrent;
                    if(!$scope.$$phase){
                        $scope.$digest();
                    }
                }
            });
            
            $scope.$on('$destroy', function(){
                unwatch();
            });
        }
    };
}]);