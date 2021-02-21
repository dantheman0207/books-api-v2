/**
 * Module dependencies.
 */
const app = require('./app.js')
const http = require('http')
const models = require('./models')

/**
 * Get port from environment and store in Express.
 */
const port = parseInt(process.env.PORT || '3000', 10)
app.set('port', port)

/**
 * Create HTTP server.
 */
const server = http.createServer(app)

/**
 * Listen on provided port, on all network interfaces.
 *  But first, make sure our db has our tables (create if they don't exist)
 */
models.sequelize.sync()
    .then(function() {
        server.listen(port)
        server.on('error', onError)
        server.on('listening', onListening)
    })

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
    const bind = typeof port === 'string'
      ? 'Pipe ' + port
      : 'Port ' + port
    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges')
        process.exit(1)
      case 'EADDRINUSE':
        console.error(bind + ' is already in use')
        process.exit(1)
      default:
        throw error
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
  const addr = server.address()
  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port
  console.log('Listening on ' + bind)
}