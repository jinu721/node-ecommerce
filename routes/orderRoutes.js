const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');


router.post('/place-order',orderController.placeOrder);
router.delete('/cancel-order/:orderId',orderController.cancelOrder);
router.get('/view-order-details/:orderId',orderController.viewOrderDetails);
router.get('/admin/orders/', orderController.adminOrdersLoad);
router.get('/admin/orders/view/:orderId', orderController.adminOrdersViewLoad);
router.post('/admin/order/status/:orderId', orderController.adminOrdersStatusUpdate);
router.post('/verify-payment', orderController.verifyPayment);
router.get('/success', orderController.successPageLoad);


module.exports = router;