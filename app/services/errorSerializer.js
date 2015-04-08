module.exports = ['ErrorSerializer', (function(){
    var typeReg = /Validation ([a-zA-Z0-9]+) failed/i;
    
    return {
        /**
        * Get a correct error output for angular front
        **/
        format: function(data){
            var o = [];
            
            if(!data.errors){
                return o;
            }
            
            for(var i = 0; i < data.errors.length; i++){
                var cerror = data.errors[i];
                
                type = cerror.message.match(typeReg);
                if(type != null)
                    type = type[1];
                else
                    type = 'unk';
                
                o.push({
                    path: data.errors[i].path,
                    type: type
                });
            }
            console.log(o);
            return o;   
        }
        
    };
})()];