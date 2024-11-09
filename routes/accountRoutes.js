const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');


router.get('/account',accountController.whenProfileLoad);
router.post('/update-profile',accountController.whenUserUpdate);
router.get('/forgot',accountController.whenForgotPassLoad);
router.post('/forgot-request',accountController.whenForgetPassRequest);
router.post('/forgot-verify',accountController.whenForgetPassverify);
router.patch('/forgot-password',accountController.whenForgetPassChange);
router.get('/account/address',accountController.whenAddressLoad);
router.post('/create-address',accountController.whenAddressCreate);
router.get('/update-address/:addressId',accountController.whenEditAddressLoad);
router.post('/update-address',accountController.whenEditAddress);
router.delete('/delete-address/:addressId',accountController.whenDeleteAddress);
router.patch('/change-password',accountController.whenChangePassword);


module.exports = router;