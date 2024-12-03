const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');


router.get('/register',userController.whenRegisterLoad);
router.post('/register',userController.whenRegister);
router.post('/request-otp',userController.whenRequestOtp);
router.post('/login',userController.whenLogin);
router.get('/ban',userController.banPageLogin);
router.post('/logout',userController.logoutClick);
router.get('/about',userController.aboutLoad);


module.exports = router;