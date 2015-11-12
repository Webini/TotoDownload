var $q = require('q');


function a(opt){
   var defer = $q.defer();
   defer.resolve('A:' + opt + ' resolved');
   return defer.promise; 
}


a('first').then(function(data){
    console.log(data);
    return a('second');
}).then(function(value){
    console.log(value);
});









(function(){
    var def = $q.defer();
    
    console.log('CALL 1');
    //def.reject('test');
    def.resolve(1);
    
    return def.promise;
})().then(function(nb){
    //var ndef = $q.defer();
    
    nb += 1;
    console.log('CALL 2 => ', nb);
    return $q.reject(5);
    $q.resolve(nb);
    //return nb;
    //ndef.reject(nb);
   /*return (function(){
         $q.resolve(5);
        return $q.reject('YOLO');
        
        //ndef.reject('YOLO');
        //return nb;
        //return ndef.promise;
    })();*/
    //return ndef.promise;
}).then(function(nb){
    nb += 1;
    console.log('CALL 3 => ', nb);
    return nb;
}).then(function(nb){
    console.log('OK => ', nb);
}).catch(function(e){
    console.log('FAILED => ', e);
});