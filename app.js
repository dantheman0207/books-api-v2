const express = require('express')
const logger = require('morgan')
const bodyParser = require('body-parser')

const env = process.env.NODE_ENV || 'development'
const index = require('./routes/index')

const app = express()
app.set('views', `${__dirname}/views`)
app.set('view engine', 'jade')
app.use(bodyParser.json())
app.use('/', index)
if (env === 'development') {
    app.use(logger('dev'))
}

// catch 404 and forward to error handler
app.use(function (_req, _res, next) {
    const err = new Error('Not Found')
    err.status = 404
    next(err)
})

// error handler
app.use(function (err, req, res, _next) {
    // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}
    // render the error page
    res.status(err.status || 500)
    res.render('error')
})

module.exports = app