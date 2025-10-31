'use strict';
const CustomError = require('../errors/customError')
const castErrorHandler = (err) => {
    const msg = `Invalid value for ${err.path}: ${err.value}!`
    return new CustomError(msg, 400)
}
const duplicateKeyErrorHandler = (err) => {
    const name = err.keyValue.title
    console.log(err)
    console.log(name)
    const msg = `There is already a field with title ${name}. Please use another input!`
    return new CustomError(msg, 400)
}
const validationErrorHandler = (err) => {
    const errors = Object.values(err.errors).map((val) => val.message)
    const errorMessages = errors.join('. ')
    const msg = `Invalid input data: ${errorMessages}`
    return new CustomError(msg, 400)
}
const prodErrors = (res, error) => {
    if (error.isOperational) {
        res.status(error.statusCode).json({
            status: error.statusCode,
            message: error.message,
        })
    } else {
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong! Please try again later.',
        })
    }
}
const devErrors = (res, error) => {
    res.status(error.statusCode).json({
        status: error.statusCode,
        message: error.message,
        stackTrace: error.stack,
        error: error,
    })
}
module.exports = (error, req, res, next) => {
    error.statusCode = error.statusCode || 500
    error.status = error.status || 'error'
    if (process.env.NODE_ENV === 'development') {
        if (error.name === 'CastError') error = castErrorHandler(error)
        if (error.code === 11000) error = duplicateKeyErrorHandler(error)
        if (error.name === 'ValidationError')
            error = validationErrorHandler(error)
        devErrors(res, error)
    } else if (process.env.NODE_ENV === 'production') {
        if (error.name === 'CastError') error = castErrorHandler(error)
        if (error.code === 11000) error = duplicateKeyErrorHandler(error)
        if (error.name === 'ValidationError')
            error = validationErrorHandler(error)
        prodErrors(res, error)
    }
}
