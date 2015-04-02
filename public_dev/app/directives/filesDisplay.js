
var csdsdfsfsdfsdffsdf = 0;
angular.module('totodl')
       .directive('filesDisplay', function(){
    

    return {
        restrict: 'E',
        scope: {
            items: '=items'
        },
        replace: true,
        templateUrl: function(){
            console.debug('ITERATION', csdsdfsfsdfsdffsdf);
            csdsdfsfsdfsdffsdf++;
            if(csdsdfsfsdfsdffsdf > 150)
                return 'err';//throw new Error('GTFO faggot');
            return '/app/views/directives/files.html'
        }
    };
});  