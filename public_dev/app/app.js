angular.module('totodl', [
    'ngRoute',
    'pascalprecht.translate',
    'angular-loading-bar',
    'ui.router'
]).config(['$routeProvider', '$translateProvider', function($routeProvider, $translateProvider) {
    $routeProvider.otherwise({redirectTo: '/dashboard'});
    
    //traductions
    $translateProvider.useLoaderCache(true);
    
    $translateProvider.useStaticFilesLoader({
        prefix: '/app/languages/lang-',
        suffix: '.json'
    });
    
    var browserLang = (window.navigator.userLanguage || window.navigator.language).toLowerCase();
    if(browserLang != 'en' && browserLang != 'fr')
       browserLang = 'en';
    
    $translateProvider.preferredLanguage(browserLang); 
}]).run(['$rootScope', '$location', 'User', function($rootScope, $location, User) {
    //redirect to login or dashboard if user is logged or not
    User.isValid().then(
        function success(){
            var cPath = $location.path();
            if(cPath == '/login' || cPath == '/register')
                $location.path('/dashboard');
        },
        function error(){
            var cPath = $location.path();
            if(cPath != '/login' && cPath != '/register')
                $location.path('/login').search({ down: true });
        }
    );
    
    //check if user can access to these pages
    //cas de merde ?
    $rootScope.$on('$routeChangeStart', function(event) {
        var cPath = $location.path();
        if(cPath == '/login' || cPath == '/register'){
           if(User.get() != null)
                $location.path('/dashboard');
        }
        else if(User.get() == null)
            $location.path('/login').search({ down: true });
    });
}]);