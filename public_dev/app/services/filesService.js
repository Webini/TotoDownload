angular.module('services')
       .service('FilesService', [ '$q', function($q){
    
    function FilesService(pfiles){
        this.files = pfiles;
        this.out = { '$$empty': true, '__files': [] };
        
        this.apply();
        console.debug(this.out, this.files);
    };
    
    /***
    * Add a file to our directories structure
    * @param object outData Output struct
    * @param string fileName File name
    * @param object rawData RawData link to the file
    * @param bool last If it's the last file to parse
    * @return outData ptr
    **/
    FilesService.prototype.addFile = function(outData, fileName, rawData, last){
        if(last){
            rawData['filename'] = fileName;
            var extPos = -1;
            
            if((extPos = fileName.lastIndexOf('.')) >= 0)
                rawData['extension'] = fileName.substr(extPos+1, fileName.length).toLowerCase();
            
            outData['__files'].push(rawData);
            outData['$$empty'] = false;
            
            return outData; 
        }
        
        if(!outData[fileName])
            outData[fileName] = { '$$empty': true, '__files': [] };
        
        return outData[fileName];
    };
    
    /***
    * Parse all files
    **/
    FilesService.prototype.apply = function(){
        if(!this.files)
            return false;
        
        for(var i = 0; i < this.files.length; i++){
            var exploded = this.files[i].name.split('/');
            var ptr = this.out;
            for(var j = 0, len = exploded.length; j < len; j++){
                ptr = this.addFile(ptr, exploded[j], this.files[i], (j == len-1));
            }
        }
    };
    
    return FilesService;
} ]);
    