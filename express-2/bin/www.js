var app = require('../app');
var debug = require('debug')('express-2:server');
var http = require('http');


// 设置端口
var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);
// 创建服务器
var server = http.createServer(app);
// 监听端口
server.listen(port, () => {
    console.log(`正在监听 http://localhost:${port}`)
});
server.on('error', onError);
server.on('listening', onListening);

// 正常化端口，返回String，Number或false
function normalizePort(val) {
    var port = parseInt(val, 10);
    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
}

function onError(error) {
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

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}
