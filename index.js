var express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');




var routes = require('./routes/index');
var app = express();

var http = require('http');
// enable cors
app.use(cors());
app.options('*', cors());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST');
    next();
});


// parse requests of content-type - application/json
// app.use(bodyParser.json());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.get('/', (req, res) => {
    res.send({ express: 'Welcome to Backend' });
});

let dbConfig
if (process.env.NODE_ENV == "stag") {
    dbConfig = require("./config/staging.config");
} else if (process.env.NODE_ENV == "prod") {
    dbConfig = require("./config/prod.config.js");
} else if (process.env.NODE_ENV == "preprod") {
    dbConfig = require("./config/preprod.config.js");
}
global.dbConfig = dbConfig

const db = require("./database/model");
db.sequelize.sync({ force: true }).then(() => {
    console.log('Drop and Resync Db');
});

global.dbName = dbConfig.DB
let port = 7701
app.set('port', port);

let subUrl = '/'
// v1 api routes
app.use(subUrl, routes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
    res.status(500).send({ status: 500, error: "API not found" });
});

var date = new Date();
const filename = path.join(__dirname, '/logs/backend' + process.env.NODE_ENV);
const winston = require('winston');
require('winston-daily-rotate-file');


var transport = new winston.transports.DailyRotateFile({
    filename: filename,
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: true,
    maxSize: '100m',
    maxFiles: '10d'
});




var logger = winston.createLogger({
    transports: [
        new winston.transports.Console({
            json: true,
            colorize: true,
            timestamp: true
        }),
        transport
    ]
});

global.logger = logger;
logger.detach = (level, msg) => {
    setImmediate(function () {
        msg["env"] = process.env.NODE_ENV
        msg["dbName"] = dbName
        logger[level](msg)

    }, 0)

}

var http = require('http');

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

function onError(error) {
    console.log(error)
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}


function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    console.log('Listening on ' + bind);
}


let controllerPath = './controllers';
fs.readdirSync(controllerPath).forEach(function (file) {
    require(controllerPath + '/' + file);
});

module.exports = app;
