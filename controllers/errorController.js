const AppError = require('../utils/appError');

const handleCastErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new AppError(message, 400);
}

const handleDuplicatedFieldsDB = err => {
    const value = err.errorResponse.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
    // console.log(value);
    const message = `Duplicated field value: ${value}, please use another value.`;
    return new AppError(message, 400);
}

const handleValidationErrorDB = err => {
    const errors = Object.values(err.errors).map(el => el.message);

    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400);
}

const handleJWTError = () => new AppError('Invalid token. Please log in again!', 401)

const handleJWTExpiredError = () => new AppError('Your token has expired! Please log in again.', 401)

const sendErrorDev = (err, req, res) => {
    if(req.originalUrl.startsWith('/api')) {
        return res.status(err.statusCode).json({
            status: err.status,
            error:err,
            message: err.message,
            stack: err.stack,
        });
    } 
    console.error('ERROR', err);
    return res.status(err.statusCode).render('error', {
        title: 'Something went wrong!',
        msg: err.message
    })
}

const sendErrorProd = (err, req, res) => {
    if(req.originalUrl.startsWith('/api')) {
        // Operational Error
        if(err.isOperational) {
            return res.status(err.statusCode).json({
                status: err.status,
                message: err.message
            });
        // Unknown Error: Alle anderen Arten von Error, die auch nichts mit unserem Programm zu tun haben: Weniger Informationen
        } 
        console.error('ERROR', err);
        return res.status(500).json({
            status: 'error',
            message: 'Something went wrong :('
        })
    } 
    if(err.isOperational) {
        return res.status(err.statusCode).render('error', {
            title: 'Something went wrong!',
            msg: err.message
        })
    // Unknown Error: Alle anderen Arten von Error, die auch nichts mit unserem Programm zu tun haben: Weniger Informationen
    }
    console.error('ERROR', err);
    return res.status(err.statusCode).render('error', {
        title: 'Something went wrong!',
        msg: 'Please try again later'
    })
}

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'fail';

    if(process.env.NODE_ENV === 'development') {
        sendErrorDev(err, req, res);
    } else if (process.env.NODE_ENV === 'production') {
        let error = {...err}
        error.message = err.message;

        if(err.name === 'CastError') error = handleCastErrorDB(error);
        if(error.errorResponse && error.errorResponse.code === 11000) error = handleDuplicatedFieldsDB(error);
        if (error._message === 'Validation failed' || error.errors) {
            error = handleValidationErrorDB(error);
        }
        if(error.name === 'JsonWebTokenError') error = handleJWTError()
        if(error.name === 'TokenExpiredError') error = handleJWTExpiredError()

        sendErrorProd(error, req, res);
    }
}