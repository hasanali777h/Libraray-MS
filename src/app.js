'use strict'
const express = require('express')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const fs = require('fs')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const globalErrorHandler = require('./errors/handleError')
const user = require('./users/routes/user.routes')
const book = require('./books/routes/book.routes')
const role = require('./roles/routes/role.routes')
const permission = require('./permissions/routes/permission.routes')
const morganMiddleware = require('./middlewares/morgan')
const log = require('./utils/logger')
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(helmet())
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
})
app.set('trust proxy', 1)
app.use(
    session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: true },
    })
)
app.use(cookieParser())
app.use(morganMiddleware)
app.get('/', (req, res) =>
    res.send(
        '<link rel="FaviconIcon" href="favicon.ico" type="image/x-icon"> <h1>Welcome to the <strong>Library Management</strong> API!</h1>'
    )
)
app.use('/api/v1', limiter)
app.use('/api/v1/book', book)
app.use('/api/v1/role', role)
app.use('/api/v1/permission', permission)
app.use('/api/v1/user', user)
app.use(globalErrorHandler)
app.use((err, req, res, next) => {
    log.error(err.stack)
    res.status(500).json({ error: 'Something went wrong!' })
})
const unhandledRejections = new Map()
process.on('unhandledRejection', (reason, promise) => {
    unhandledRejections.set(promise, reason)
})
process.on('rejectionHandled', (promise) => {
    unhandledRejections.delete(promise)
})
process.on('uncaughtException', (err, origin) => {
    fs.writeSync(
        process.stderr.fd,
        `Caught exception: ${err}\n` + `Exception origin: ${origin}\n`
    )
})
module.exports = app
