angular.module('totodl')
       .controller('MenuController', [ '$scope', '$routeParams', 'User', 'Socket', 
function($scope, $routeParams, User, Socket){
    
    $scope.user = User.get();
    $scope.roles = User.roles;
    
    $scope.socket = Socket;
     
}]);