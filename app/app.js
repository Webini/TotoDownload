var config      = require(__dirname + '/config/config.json');
var express     = require('express');
var bodyParser  = require('body-parser')
var httpRoutes  = require(__dirname + '/routes/httpRoutes.js');
var ioRoutes    = require(__dirname + '/routes/ioRoutes.js');
var orm         = require(__dirname + '/models/index.js');
var jwt         = require('socketio-jwt');
var multer      = require('multer');

var app         = express();
var server      = require('http').Server(app);
var io          = require('socket.io')(server);
var torrents    = require(__dirname + '/api/torrents.js')(config.torrents);
var updtWorker  = require(__dirname + '/worker/updateTorrents.js');

//io config
io.use(jwt.authorize({
  secret: config.secret.token,
  handshake: true
}));

//static files
app.use(express.static(config.http.static));
app.use(bodyParser.json());
app.use(multer());

var mApp = {
    config: config,
    http: app,
    io: io,
    server: server,
    orm: orm,
    torrents: torrents,
    services: {},
    workers: {
        torrents: updtWorker    
    }
};

module.exports = mApp;

mApp.services = require(__dirname + '/services/index.js');

//define http routes
httpRoutes(mApp);
ioRoutes(mApp);