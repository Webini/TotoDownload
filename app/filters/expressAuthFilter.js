module.exports = function(roles){
    //authentication filter for express & socket.io
    return function(req, res, next){
        if(!req.user || (req.user.roles & roles) != roles){
            res.sendStatus(403);
        }
        else
            return next();                                      
    };
};