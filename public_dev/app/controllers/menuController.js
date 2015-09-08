angular.module('totodl')
       .controller('MenuController', [ '$scope', 'User', 'Socket', '$location', '$rootScope', 'ngDialog',
function($scope, User, Socket, $location, $rootScope, ngDialog){
    $scope.search = $location.search().search;
    
    $scope.user = User.get();
    $scope.roles = User.roles;
    $scope.socket = Socket;
    $scope.Math = Math;
    $scope.currentRoute = null;;
    
    $scope.submit = function(){
        if($scope.search)
            $location.search({ search: $scope.search });
        else
            $location.search({});
    };
    
    var unbindQuotaExceeded = $rootScope.$on('quota-exceeded', function(evt, torrentName){
        ngDialog.open({
            template: '/app/views/popup/quota.html',
            className: 'ngdialog-theme-toto',
            showClose: true,
            data: torrentName
        });
    });
    
    var unbindRouteChange = $rootScope.$on('$routeChangeSuccess', function (e, current, pre) {
        $scope.currentRoute = current.$$route.originalPath;
    });
    
    var unbindSearchWatcher = $scope.$watch('search', function(newVal, oldVal){
        if(newVal === oldVal)
            return;
            
        if(newVal)
            $rootScope.search = newVal;
        else
            $rootScope.search = '';
    });
    
    $scope.$on("$destroy", function handler() {
        unbindSearchWatcher();
        unbindQuotaExceeded();
        unbindRouteChange();
    });
}]);