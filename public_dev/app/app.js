function languageSetup($routeProvider, $translateProvider){
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
};

/**
* Redirect if user is logged / unlogged
**/
function redirectOnStatus($rootScope, $location, User, successcb){
    User.isValid().then(
        function success(){
            var cPath = $location.path();
            if(cPath == '/login' || cPath == '/register')
                window.location = '/dashboard.html#/dashboard'; //$location.url('/dashboard.html#/dashboard');//.path('/dashboard');
            if(successcb)
                successcb();
        },
        function error(){
            var cPath = $location.path();
            if(cPath != '/login' && cPath != '/register')
                window.location = '/index.html#/login?down=true';//.path('/login').search({ down: true });
        }
    ); 
};

// services
angular.module('services', []);

/** Dashboard **/
angular.module('totodl', [
    'ngRoute',
    'pascalprecht.translate',
    'angular-loading-bar',
    'services',
    'flow'
]).config(['$routeProvider', '$translateProvider', 'flowFactoryProvider', function($routeProvider, $translateProvider, flowFactoryProvider){
    $routeProvider.otherwise({redirectTo: '/dashboard'});
    languageSetup($routeProvider, $translateProvider);
    flowFactoryProvider.factory = fustyFlowFactory;
}]).run(['$rootScope', '$location', 'User', '$http', function($rootScope, $location, User, $http) {
    //check login status
    redirectOnStatus($rootScope, $location, User);
}]);

/** Login / Register page **/
angular.module('totodlLogin', [
    'ngRoute',
    'pascalprecht.translate',
    'angular-loading-bar',
    'services'
]).config(['$routeProvider', '$translateProvider', function($routeProvider, $translateProvider) {
    $routeProvider.otherwise({redirectTo: '/login'});
    languageSetup($routeProvider, $translateProvider);
}]).run(['$rootScope', '$location', 'User', function($rootScope, $location, User) {
    redirectOnStatus($rootScope, $location, User);
}]);