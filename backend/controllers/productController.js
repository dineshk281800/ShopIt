const catchAsyncError = require('../middlewares/catchAsyncError');
const ProductModel = require('../models/productModel');
const APIFilters = require('../utils/apiFilters');
const ErrorHandler = require('../utils/errorHandler')

exports.getProducts = catchAsyncError(async (req, res) => {
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
    const product = await ProductModel.findById(req.params.id)

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