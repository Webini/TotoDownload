module.exports = function(app){
    return {
        onUpload: function(req, res){
            console.log(require('util').inspect(req.body), require('util').inspect(req.files));    
            res.json('lala ' + req.user.nickname + "  //  " + req.user.ip);
        }
    }
};