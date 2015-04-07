angular.module('services')
       .service('FilesService', [ '$q', function($q){
    
    function FilesService(pfiles){
        this.files = pfiles;
        this.out = null;
        
        this.apply();
        console.debug(this.out, this.files);
    };
           
    FilesService.prototype.resetOutput = function(){
        this.out = { '$$time': Math.floor(Math.random() * Date.now()), '$$empty': true, '__files': [] };    
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
        if(last || !outData[fileName]){
            outData['$$empty'] = false;
        }
        
        if(last){
            var data = {
                filename: fileName,
                keywords: fileName.toLowerCase()
                                  .match(/[a-zA-Z0-9]+/img)
                                  .join(' '),
                raw: rawData
            };

            var extPos = -1;
            
            if((extPos = fileName.lastIndexOf('.')) >= 0)
                data.extension = fileName.substr(extPos+1, fileName.length).toLowerCase();
            
            outData['__files'].push(data);
            
            return outData; 
        }
        
        if(!outData[fileName])
            outData[fileName] = { '$$empty': true, '__files': [], '$$time': Math.floor(Math.random() * Date.now()) };
        
        
        return outData[fileName];
    };
    
    /***
    * Parse all files
    **/
    FilesService.prototype.apply = function(files){
        if(files)
            this.files = files;
        else if(!this.files)
            return false;
        
        this.resetOutput();
        
        for(var i = 0; i < this.files.length; i++){
            var exploded = this.files[i].name.split('/');
            var ptr = this.out;
            for(var j = 0, len = exploded.length; j < len; j++){
                this.files[i].id = i;
                ptr = this.addFile(ptr, exploded[j], this.files[i], (j == len-1));
            }
        }
    };
    
    return FilesService;
} ]);
    