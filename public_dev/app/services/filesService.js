angular.module('services')
       .service('FilesService', [ '$q', function($q){
    
    var files = null;
    var out = {};
    function FilesService(pfiles){
        files = pfiles;
    };
           
    FilesService.prototype.addFile = function(outData, fileName, rawData, last){
        if(!outData[fileName])
            outData[fileName] = { files: [] };
                
        if(last)
            outData[fileName]['__files__'].push(rawData);
    };
    
    FilesService.prototype.apply = function(){
        if(!files)
            return false;
        
        for(var i = 0; i < files.length; i++){
            var exploded = files[i].split('/');
            var ptr = out;
            for(var j = 0, len = exploded.length; j < len; j++){
                ptr = this.addFile(ptr, exploded[j], files[i], (j == len-1));
            }
        }
    };
           
} ]);
    