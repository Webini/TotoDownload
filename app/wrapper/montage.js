module.exports = (function(){
    var spawn    = require('child_process').spawn;
    var $q       = require('q');
    
    function Montage(){
        this.input = [];
        this.output = null;
        this.geometry = null;
        this.tile = null;
        this.background = null;
        this.mode = null;
    };
    
    /**
     * Add input file
     * @param string file
     * @return Montage
     */
    Montage.prototype.addInput = function(file){
        this.input.push(file);
        return this;
    };
    
    /**
     * Set lines & row for output image
     * @param int cols
     * @param int rows
     * @return Montage
     */
    Montage.prototype.setTile = function(cols, rows){
        this.tile = { cols: cols, rows: rows };
        return this;
    };
    
    /**
     * Set geometry
     * @param array geom
     * @return Montage
     */
    Montage.prototype.setGeometry = function(geom){
        this.geometry = geom;  
        return this;
    };
    
    /**
     * Set background
     * @param string color
     * @return Montage
     */
    Montage.prototype.setBackground = function(color){
        this.background = color;
        return this;
    };
    
    /**
     * SEt output file
     * @param string output
     * @return this
     */
    Montage.prototype.setOutput = function(output){
        this.output = output;
        return this;
    };
    
    /**
     * Set mode
     * @param string mode
     * @return Montage
     */
    Montage.prototype.setMode = function(mode){
        this.mode = mode;
        return this;  
    };
    
    /**
     * Create parameters for cli
     * @return array
     */
    Montage.prototype._getParams = function(){
        var params = [];
        
        if(this.input.length <= 0){
            throw new Error('Input not defined');
        }
        
        if(this.mode){
            params.push('-mode');
            params.push(this.mode);
        }
        
        if(this.background){
            params.push('-background');
            params.push(this.background);
        }
        
        if(this.geometry){
            params.push('-geometry');
            params.push(this.geometry.join(''));
        }
        
        if(this.tile){
            params.push('-tile');
            params.push((this.tile.cols ? this.tile.cols : '') + 'x' + (this.tile.rows ? this.tile.rows : '')); 
        }
        
        if(this.output === null){
            throw new Error('Output not defined');
        }
        
        params = params.concat(this.input);
        params.push(this.output);
        
        return params;
    };
    
    /**
     * Execute convertion
     * @return promise
     */
    Montage.prototype.convert = function(){
        var child = spawn('montage', this._getParams());
        var defer = $q.defer();
        var data  = '';
        
        child.stdout.on('data', function(response){
            data += response; //defer.resolve(response);
        });
        
        child.stderr.on('data', function(err){
            data += err; //defer.reject(err.toString());    
        });
        
        child.on('exit', function(code, signal){
            if(code === 0){
                defer.resolve(data, code, signal);
            }
            else{
                defer.reject(data, code, signal);
            }
        });
        
        return defer.promise;
    };
    
    return Montage;
})();
