const catchAsyncError = require('../middlewares/catchAsyncError');
const ProductModel = require('../models/productModel');
const OrderModel = require('../models/orderModel');
const APIFilters = require('../utils/apiFilters');
const ErrorHandler = require('../utils/errorHandler')
const { delete_file, upload_file } = require("../utils/cloudinary")
// Create new product => /api/v1/products
exports.getProducts = catchAsyncError(async (req, res, next) => {
    const resPerPage = 4
    const apiFilters = new APIFilters(ProductModel, req.query).search().filter();

    // console.log("req.user", req.user)
    let products = await apiFilters.query;
    let filteredProductsCount = products.length;

    apiFilters.pagination(resPerPage)
    products = await apiFilters.query.clone();

    // const products = await ProductModel.find();

    res.status(200).json({
        resPerPage,
        filteredProductsCount,
        products
    })
})
// create new product-  /api/v1/admin/products
exports.newProducts = catchAsyncError(async (req, res) => {

    req.body.user = req.user._id;
    const product = await ProductModel.create(req.body)

    res.status(200).json({
        product
    })
})

// Get single product details-  /api/v1/products/:id
exports.getProductDetails = catchAsyncError(async (req, res, next) => {
    const product = await ProductModel.findById(req.params.id).populate('reviews.user')

    if (!product) {
        return next(new ErrorHandler("Product not found"), 404)
        // return res.status(404).json({
        //     error: "Product not found",
        // });
    }

    res.status(200).json({
        product
    })
})

// Get product - Admin => /api/v1/admin/products
exports.getAdminProducts = catchAsyncError(async (req, res, next) => {
    const products = await ProductModel.find()

    res.status(200).json({
        products
    })
})

// Update product details-  /api/v1/products/:id
exports.updateProduct = catchAsyncError(async (req, res) => {
    let product = await ProductModel.findById(req.params.id)

    if (!product) {
        return res.status(404).json({
            error: "Product not found",
        });
    }

    product = await ProductModel.findByIdAndUpdate(req.params.id, req.body, { new: true })

    res.status(200).json({
        product
    })
})

// upload product images => /api/v1/admin/products/:id/upload_images
exports.uploadProductImages = catchAsyncError(async (req, res, next) => {
    const product = await ProductModel.findById(req.params.id)

    if (!product) {
        return next(new ErrorHandler("Product not found"), 404)
    }

    const uploader = async (image) => upload_file(image, "shopit/products");

    const urls = await Promise.all((req?.body?.images).map(uploader));

    product?.images?.push(...urls);
    await product?.save();

    res.status(200).json({
        product
    })
})

// Delete product => /api/v1/products/:id/delete_image
exports.deleteProductImage = catchAsyncError(async (req, res, next) => {
    const product = await ProductModel.findById(req.params.id)

    if (!product) {
        return next(new ErrorHandler("Product not found"), 404)
    }

    const isDeleted = await delete_file(req.body.imgId);

    if (isDeleted) {
        product.images = product?.images?.filter(
            (img) => img.public_id !== req.body.imgId
        );
        await product?.save();
    }

    res.status(200).json({
        product
    })
})

// Delete product details-  /api/v1/products/:id
exports.deleteProduct = catchAsyncError(async (req, res) => {
    const product = await ProductModel.findById(req.params.id)

    if (!product) {
        return res.status(404).json({
            error: "Product not found",
        });
    }

    await product.deleteOne();

    res.status(200).json({
        message: "product Deleted"
    })
})

// Create/Update product review-  /api/v1/reviews
exports.createProductReview = catchAsyncError(async (req, res, next) => {
    const { rating, comment, productId } = req.body;

    const review = {
        user: req.user._id,
        rating: Number(rating),
        comment
    }
    const product = await ProductModel.findById(productId)

    if (!product) {
        return next(new ErrorHandler("Product not found", 404))
    }

    const isReviewed = product.reviews.find(
        (review) => review.user.toString() === req.user._id.toString()
    )
    // console.log("product.reviews:", product.reviews)
    // console.log("isReviewed:", isReviewed)

    if (isReviewed) {
        product.reviews.forEach((review) => {
            if (review.user.toString() === req.user._id.toString()) {
                review.comment = comment;
                review.rating = rating;
            }
        })
    } else {
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }

    product.ratings =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

    await product.save({ validateBeforeSave: false })

    res.status(200).json({
        success: true
    })
})

// Get product reviews-  /api/v1/reviews
exports.getProductReviews = catchAsyncError(async (req, res, next) => {
    const product = await ProductModel.findById(req.query.id).populate("reviews.user");

    if (!product) {
        return next(new ErrorHandler("Product not found", 404))
    }

    res.status(200).json({
        reviews: product.reviews
    })
});

// Delete product reviews-  /api/v1/admin/reviews
exports.deleteReview = catchAsyncError(async (req, res, next) => {
    let product = await ProductModel.findById(req.query.productId)

    if (!product) {
        return next(new ErrorHandler("Product not found", 404))
    }

    const reviews = product.reviews.filter(
        (review) => review._id.toString() !== req.query.id.toString()
    )

    const numOfReviews = reviews.length;

    const ratings =
        numOfReviews === 0 ? 0 :
            product.reviews.reduce((acc, item) => item.rating + acc, 0) / numOfReviews;

    product = await ProductModel.findByIdAndUpdate(
        req.query.productId,
        { reviews, numOfReviews, ratings },
        { new: true }
    );

    res.status(200).json({
        success: true,
        product
    })
})

// can user reviews-  /api/v1/can_review
exports.canUserReview = catchAsyncError(async (req, res, next) => {
    const orders = await OrderModel.find({
        user: req.user._id,
        "orderItems.product": req.query.productId
    });
    if (orders.length === 0) {
        return res.status(200).json({ canReview: false });
    };

    res.status(200).json({
        canReview: true
    });
});