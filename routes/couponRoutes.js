const express = require('express');
const router = express.Router();
const couponController = require('../controllers/couponController');


router.get('/admin/coupons',couponController.couponAdminPageLoad);
router.get('/admin/coupons/create',couponController.couponAdminCreatePageLoad);
router.post('/admin/coupons/create',couponController.couponAdminCreate);
router.get('/admin/coupons/update/:couponId',couponController.couponAdminUpdatePageLoad);
router.post('/admin/coupons/update/:couponId',couponController.couponAdminUpdate);
router.delete('/admin/coupons/delete/:couponId',couponController.couponAdminDelete);
router.post('/coupon/apply',couponController.couponApply);

module.exports = router;