var app = require('./app/app.js');

app.server.listen(app.config.http.port, app.config.http.host, function(){
    console.log("Listening on " + app.config.http.host + ":" + app.config.http.port);
    
    //app.workers.torrents.start();
    //app.workers.sync.start();
});