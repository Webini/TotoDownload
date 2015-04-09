angular.module('totodl')
       .controller('MenuController', [ '$scope', 'User', 'Socket', '$location', '$rootScope', 
function($scope, User, Socket, $location, $rootScope){
    $scope.search = $location.search().search;
    
    $scope.user = User.get();
    $scope.roles = User.roles;
    $scope.socket = Socket;
    
    $scope.submit = function(){
        if($scope.search)
            $location.search({ search: $scope.search });
        else
            $location.search({});
    };
    
    $scope.$watch('search', function(value){
        if(value)
            $rootScope.search = value;
        else
            $rootScope.search = '';
    });
}]);