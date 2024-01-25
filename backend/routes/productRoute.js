// import express from 'express';
// import productController from '../controllers/productController.js';
const express = require('express')
const productController = require('../controllers/productController')
const authMiddleware = require('../middlewares/auth')
const router = express.Router()

router.route('/products')
    .get(productController.getProducts)

router.route('/admin/products')
    .post(authMiddleware.isAuthenticatedUser, authMiddleware.authorizeRoles("admin"), productController.newProducts)

router.route('/products/:id')
    .get(productController.getProductDetails)

router.route('/admin/products/:id')
    .patch(authMiddleware.isAuthenticatedUser, authMiddleware.authorizeRoles("admin"), productController.updateProduct)
    .delete(authMiddleware.isAuthenticatedUser, authMiddleware.authorizeRoles("admin"), productController.deleteProduct)

router.route('/reviews')
    .get(authMiddleware.isAuthenticatedUser, productController.getProductReviews)
    .patch(authMiddleware.isAuthenticatedUser, productController.createProductReview)

router.route('/admin/reviews')
    .delete(authMiddleware.isAuthenticatedUser, authMiddleware.authorizeRoles("admin"), productController.deleteReview)
module.exports = router;