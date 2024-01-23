const catchAsyncError = require("./catchAsyncError");
const ErrorHandler = require('../utils/errorHandler');
const jwt = require("jsonwebtoken");
const UserModel = require("../models/userModel");

// checks if user is authenticated or not
exports.isAuthenticatedUser = catchAsyncError(async (req, res, next) => {
    const { token } = req.cookies;

    console.log(token);
    if (!token) {
        return next(new ErrorHandler('Login first to access this resource', 401))
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(decoded);
    req.user = await UserModel.findById(decoded.id);
    next();
})

// Authorize user roles
exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ErrorHandler(`Role ${req.user.role} is not allowed to access this resource`, 403))
        };
        next();
    };
};