angular.module('totodl')
	   .filter('startFrom', function() {
    return function(input, start) {
        return input.slice(parseInt(start));
    }
});
