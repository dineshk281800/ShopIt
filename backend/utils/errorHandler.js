class AppError extends Error {
    constructor(message, statusCode) {
        // super is the constructor of the parent class.
        // So in this case, the super is going to be the constructor of this error class.
        super(message);

        this.statusCode = statusCode;
        // this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        // this.isOperational = true;

        // you can see that it will create dot stack property on the target object.
        // So stack means like the complete stack of the error that where this error occurs.
        // So it is very helpful in development.
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;