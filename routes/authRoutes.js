const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/auth/google',authController.whenGoogleLogin);
router.get('/auth/google/callback', authController.whenGoogleCallbacks);

module.exports = router;
