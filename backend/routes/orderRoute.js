const express = require('express');
const router = express.Router()
const authMiddleware = require('../middlewares/auth');
const orderController = require('../controllers/orderController')

router.route('/orders/new')
    .post(authMiddleware.isAuthenticatedUser, orderController.newOrder)

router.route('/orders/:id')
    .get(authMiddleware.isAuthenticatedUser, orderController.getOrderDetails)

router.route('/me/orders')
    .get(authMiddleware.isAuthenticatedUser, orderController.myOrders)

router.route('/admin/get_sales')
    .get(authMiddleware.isAuthenticatedUser, authMiddleware.authorizeRoles("admin"), orderController.getSales)

router.route('/admin/orders')
    .get(authMiddleware.isAuthenticatedUser, authMiddleware.authorizeRoles("admin"), orderController.allOrders)

router.route('/admin/orders/:id')
    .put(authMiddleware.isAuthenticatedUser, authMiddleware.authorizeRoles("admin"), orderController.updateOrder)
    .delete(authMiddleware.isAuthenticatedUser, authMiddleware.authorizeRoles("admin"), orderController.deleteOrder)
module.exports = router;