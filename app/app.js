var config      = require(__dirname + '/config/config.json');
var express     = require('express');
var bodyParser  = require('body-parser')
var httpRoutes  = require(__dirname + '/routes/httpRoutes.js');
var ioRoutes    = require(__dirname + '/routes/ioRoutes.js');
var orm         = require(__dirname + '/models/index.js');
var jwt         = require('socketio-jwt');
var multer      = require('multer');
var winston     = require('winston');

var app         = express();
var server      = require('http').Server(app);
var io          = require('socket.io')(server);
var torrents    = require(__dirname + '/api/torrents/index.js');
var moviesdb    = require(__dirname + '/api/moviesdb/index.js');
var updtWorker  = require(__dirname + '/worker/updateTorrents.js');
var syncWorker  = require(__dirname + '/worker/synchronizeDatabase.js');

var logger = new (winston.Logger)({
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: config.logs.logs })
    ],
    exceptionHandlers: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: config.logs.exceptions })
    ]
});

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
    logger: logger,
    io: io,
    server: server,
    orm: orm,
    torrents: torrents,
    services: {},
    api: {},
    listeners: {},
    workers: {
        torrents: updtWorker,
        sync: syncWorker
    }
};

module.exports = mApp;

mApp.api = {
    torrents: torrents(config.torrents),
    moviesdb: moviesdb(config.moviesdb)
};

mApp.services = require(__dirname + '/services/index.js');
//notify services that all is ready
mApp.services.ready();

mApp.listeners = require(__dirname + '/eventListeners/index.js');
mApp.listeners.ready();

//define http routes
httpRoutes(mApp);
ioRoutes(mApp);
