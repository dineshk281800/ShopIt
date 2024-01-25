const catchAsyncError = require('../middlewares/catchAsyncError');
const OrderModel = require('../models/orderModel');
const ProductModel = require('../models/productModel');
const ErrorHandler = require('../utils/errorHandler')


// Create new Order - /api/v1/orders/new
exports.newOrder = catchAsyncError(async (req, res, next) => {
    const {
        orderItems,
        shippingInfo,
        itemsPrice,
        taxAmount,
        shippingAmount,
        totalAmount,
        paymentMethod,
        paymentInfo
    } = req.body;

    const order = await OrderModel.create({
        orderItems,
        shippingInfo,
        itemsPrice,
        taxAmount,
        shippingAmount,
        totalAmount,
        paymentMethod,
        paymentInfo,
        user: req.user._id
    })
    res.status(200).json({
        order,
    });
});

// Get current user Order - /api/v1/me/orders
exports.myOrders = catchAsyncError(async (req, res, next) => {
    const orders = await OrderModel.find({ user: req.user._id });

    res.status(200).json({
        orders,
    });
})

// Get Order details - /api/v1/orders/:id
exports.getOrderDetails = catchAsyncError(async (req, res, next) => {
    const order = await OrderModel.findById(req.params.id).populate("user", "name email");

    if (!order) {
        return next(new ErrorHandler('No Order found with this ID', 404));
    }

    res.status(200).json({
        order,
    });
})

// Get all Orders -ADMIN - /api/v1/admin/orders
exports.allOrders = catchAsyncError(async (req, res, next) => {
    const orders = await OrderModel.find();

    res.status(200).json({
        orders,
    });
})

// Update Order details - /api/v1/admin/orders/:id
exports.updateOrder = catchAsyncError(async (req, res, next) => {
    const order = await OrderModel.findById(req.params.id);

    if (!order) {
        return next(new ErrorHandler('No Order found with this ID', 404));
    }

    if (order.orderStatus === "Delivered") {
        return next(new ErrorHandler('You have already delivered this order', 400));
    }

    // Update products stock
    order.orderItems.forEach(async (item) => {
        const product = await ProductModel.findById(item.product.toString())
        if (!product) {
            return next(new ErrorHandler('No Product found with this ID', 404));
        }
        product.stack = product.stack - item.quantity;
        await product.save({ validateBeforeSave: false });
    })

    order.orderStatus = req.body.status;
    order.deliveredAt = Date.now();

    await order.save();
    res.status(200).json({
        // order,
        success: true
    });
})

// Delete order  =>  /api/v1/admin/orders/:id
exports.deleteOrder = catchAsyncError(async (req, res, next) => {
    const order = await OrderModel.findById(req.params.id);

    if (!order) {
        return next(new ErrorHandler("No Order found with this ID", 404));
    }

    await order.deleteOne();

    res.status(200).json({
        success: true,
    });
});

