angular.module('totodl')
       .controller('HeaderController', [ '$scope', '$routeParams', 'User', 
function($scope, $routeParams, User){
    
    $scope.logout = function(){
        User.logout('/index.html#/login');
    };
}]);