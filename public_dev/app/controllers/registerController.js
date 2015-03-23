angular.module('totodlLogin')
       .config(['$routeProvider', function($routeProvider){
            $routeProvider.when('/login', {
                templateUrl: '/app/views/register/login.html',
                controller: 'RegisterController'
            }).when('/register', {
                templateUrl: '/app/views/register/register.html',
                controller: 'RegisterController'
            });
       }])
       .controller('RegisterController', [ '$scope', '$routeParams', '$location', 'UsersService', 'User', 
function RegisterController($scope, $routeParams, $location, UsersService, User){
    
    $scope.info = ($routeParams.down ? 'SESSIONDOWN' : null);
    $scope.success = ($routeParams.new ? 'REGISTERED' : null);
    $scope.user = { email: ($routeParams.new ? $routeParams.new : "") };
    $scope.loading = false;
    $scope.errors = null;
    
    $scope.login = function(){
        $scope.loading = true;
        
        UsersService.login($scope.user).then(
            function success(data){;
                $scope.errors = null;
                //store the user in localStorage
                User.set(data);
                //go to app main
                window.location = "/dashboard.html#/dashboard";
            },
            function error(data){
                if(data == -1)
                    $scope.errors = 'USERNOTFOUND';
                else if(data == -2)
                    $scope.errors = 'WRONGPASSWORD';
                else
                    $scope.errors = 'unk,unk';
            }
        ).finally(function(data){
            $scope.loading = false;    
        });
    };
    
    $scope.register = function(){
        $scope.loading = true;
        
        UsersService.register($scope.user).then(
            function success(data){
                $scope.errors = null;
                $location.path('/login').search({ new: $scope.user.email });
            }, 
            function error(data){
                $scope.errors = data;
            }
        ).finally(function(data){
            $scope.loading = false;
        });
    };
}]); 