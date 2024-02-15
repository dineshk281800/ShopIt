const express = require('express');
const router = express.Router();

const { isAuthenticatedUser } = require('../middlewares/auth');
const {
    stripeCheckoutSession,
    stripeWebhook,
} = require('../controllers/paymentController')

router
    .route("/payment/checkout_session")
    .post(isAuthenticatedUser, stripeCheckoutSession);

router
    .route("/payment/webhook")
    .post(stripeWebhook);

module.exports = router;