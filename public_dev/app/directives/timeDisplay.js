angular.module('totodl')
       .directive('timeDisplay', ['$translate', '$compile', function($translate, $compile){
           
    var steps = [
        { modulo: 60, labelMin: 'TIME_SMSEC', label: 'TIME_SEC', labelPlu: 'TIME_PSEC' },
        { modulo: 60, labelMin: 'TIME_SMMIN', label: 'TIME_MIN', labelPlu: 'TIME_PMIN' },
        { modulo: 24, labelMin: 'TIME_SMHOUR', label: 'TIME_HOUR', labelPlu: 'TIME_PHOUR' },
        { modulo: -1, labelMin: 'TIME_SMDAY', label: 'TIME_DAY', labelPlu: 'TIME_PDAY' }
    ];

    function timeStep(data, step, labelType){
        var modulo = step.modulo;
        if(modulo == -1) //if -1 => fail 
            modulo = data.time+1;
        
        var rest = data.time % modulo; 
        if(rest){
            if(labelType == 0)
                data.text = rest + ' {{ \'' + step.labelMin + '\'|translate }} ' + data.text;
            else
                data.text = rest + ' {{ \'' + (rest > 1 ? step.labelPlu : step.label) + '\'|translate }} ' + data.text;
        }
        
        data.time -= rest;
        data.time = data.time / modulo;
    }
           
    return {
        restrict: 'E',
        scope: {
            time: '=time',
            type: '@type' //label type 2 choices: min // normal
        },
        replace: true,
        link: function($scope, $elem, $attr){
            $scope.label = -1;
            
            var labelType = ($scope.type.toLowerCase() == 'min' ? 0 : 1);
            
            $scope.$watch('time', function(newVal, oldVal){
                if(newVal == oldVal && $scope.label != -1)
                    return;
                
                var data = {
                    time: $scope.time,
                    text: ''
                };
                
                for(var i = 0; i < steps.length; i++){
                    timeStep(data, steps[i], labelType);
                }
                
                $elem.html(data.text);
                $compile($elem.contents())($scope);
            });
        } 
    };
}]); 