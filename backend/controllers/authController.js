const catchAsyncErrors = require('../middlewares/catchAsyncError');
const UserModel = require('../models/userModel')
const ErrorHandler = require('../utils/errorHandler');
const sendToken = require('../utils/sendToken');
const emailTemplate = require('../utils/emailTemplates')
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
// Register User - /api/v1/register
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
    const { name, email, password } = req.body;

    const user = await UserModel.create({
        name,
        email,
        password
    });

    // const token = user.getJwtToken();

    // res.status(201).json({
    //     // success: true,
    //     token
    // })
    sendToken(user, 201, res)
})

// Login User - /api/v1/login
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
    const { name, email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorHandler('please enter the email & password', 400))
    }

    // Find user in the database
    const user = await UserModel.findOne({ email }).select("+password")

    if (!user) {
        return next(new ErrorHandler("Invalid email or password", 401))
    }
    // check if password is correct
    const isPasswordMatched = await user.comparePassword(password)

    if (!isPasswordMatched) {
        return next(new ErrorHandler('Invalid email or password', 401))
    }

    // const token = user.getJwtToken();

    // res.status(200).json({
    //     // success: true,
    //     token
    // })
    sendToken(user, 200, res)
})

// Logout user = /api/v1/logout
exports.logoutUser = catchAsyncErrors(async (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    })
    res.status(200).json({
        message: "Logged Out",
    });
});

// Forget password - /api/v1/password/forgot
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {

    // Find user in the database
    const user = await UserModel.findOne({ email: req.body.email })

    if (!user) {
        return next(new ErrorHandler("User not found with this email", 404))
    }

    // Get reset password token
    const resetToken = user.getResetPasswordToken()

    await user.save()

    // create reset password url 
    const resetUrl = `${process.env.FRONTEND_URL}/api/v1/password/reset/${resetToken}`

    const message = emailTemplate.getResetPasswordTemplate(user.name, resetUrl)

    // console.log(resetUrl)
    // console.log(message);

    try {
        await sendEmail({
            email: user.email,
            subject: "ShopIt Password Recovery",
            message,
        })
        res.status(200).json({
            message: `Email sent to: ${user.email}`,
        });
    } catch (error) {
        // email send is fail
        user.resetPasswordToken = undefined
        user.resetPasswordExpire = undefined

        await user.save()
        return next(new ErrorHandler(error.message, 500));

    }
    sendToken(user, 200, res)
})

// reset password - /api/v1/password/reset/:token
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {

    // Hash the URL Token
    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest('hex')

    const user = await UserModel.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    })

    if (!user) {
        return next(new ErrorHandler("Password reset token is invalid or has been expired", 400))
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler("Passwords does not match", 400))
    }


    // Set thee new password
    user.password = req.body.password;

    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined

    await user.save()
    // console.log(user)
    sendToken(user, 200, res)
});


// Get current user profile - /api/v1/user
exports.getUserProfile = catchAsyncErrors(async (req, res, next) => {
    const user = await UserModel.findById(req.user._id);

    res.status(200).json({
        user,
    })
})

// Update Password - /api/v1/password/update
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
    const user = await UserModel.findById(req.user._id).select("+password");

    // check the previous user password
    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    if (!isPasswordMatched) {
        return next(new ErrorHandler("old password is incorrect", 400))
    }

    user.password = req.body.password;
    user.save();

    res.status(200).json({
        success: true,
    })
})

// Update User Profile - /api/v1/me/update
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {

    const newUserData = {
        name: req.body.name,
        email: req.body.email
    }

    const user = await UserModel.findByIdAndUpdate(req.user._id, newUserData, {
        new: true
    })

    res.status(200).json({
        user,
    })
})

// Get all Users - ADMIN - /api/v1/admin/users
exports.allUsers = catchAsyncErrors(async (req, res, next) => {
    const users = await UserModel.find();

    res.status(200).json({
        users,
    })
})

// Get User - ADMIN - /api/v1/admin/users/:id
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
    const user = await UserModel.findById(req.params.id);

    // console.log(req.params.id)
    if (!user) {
        return next(new ErrorHandler(`User not found with id: ${req.params.id}`, 404))
    }

    res.status(200).json({
        user,
    })
})

// Update User Details - ADMIN - /api/v1/admin/users/:id
exports.updateUser = catchAsyncErrors(async (req, res, next) => {

    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    }

    const user = await UserModel.findByIdAndUpdate(req.params.id, newUserData, {
        new: true
    })

    res.status(200).json({
        user,
    })
})

// Delete User - ADMIN - /api/v1/admin/users/:id
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
    const user = await UserModel.findById(req.params.id);

    // console.log(req.params.id)
    if (!user) {
        return next(new ErrorHandler(`User not found with id: ${req.params.id}`, 404))
    }

    // TODO - Remove user Avatar from cloudinary

    await user.deleteOne();

    res.status(200).json({
        success: true
    })
})