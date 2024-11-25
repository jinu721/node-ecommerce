const express = require('express');
const router = express.Router();
const checkoutController = require('../controllers/checkoutController');


router.get('/checkout',checkoutController.checkoutPageLoad);
router.get('/success/:orderId',checkoutController.successPageLoad);

module.exports = router;