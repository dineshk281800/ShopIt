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
    .get(authMiddleware.isAuthenticatedUser, authMiddleware.authorizeRoles("admin"), productController.getAdminProducts)

router.route('/products/:id')
    .get(productController.getProductDetails)


router.route('/admin/products/:id')
    .put(authMiddleware.isAuthenticatedUser, authMiddleware.authorizeRoles("admin"), productController.updateProduct)
    .delete(authMiddleware.isAuthenticatedUser, authMiddleware.authorizeRoles("admin"), productController.deleteProduct)

router.route('/admin/products/:id/upload_images')
    .put(authMiddleware.isAuthenticatedUser, authMiddleware.authorizeRoles("admin"), productController.uploadProductImages)

router.route('/admin/products/:id/delete_image')
    .put(authMiddleware.isAuthenticatedUser, authMiddleware.authorizeRoles("admin"), productController.deleteProductImage)

router.route('/reviews')
    .get(authMiddleware.isAuthenticatedUser, productController.getProductReviews)
    .put(authMiddleware.isAuthenticatedUser, productController.createProductReview)

router.route('/can_review')
    .get(authMiddleware.isAuthenticatedUser, productController.canUserReview)
router.route('/admin/reviews')
    .delete(authMiddleware.isAuthenticatedUser, authMiddleware.authorizeRoles("admin"), productController.deleteReview)
module.exports = router;