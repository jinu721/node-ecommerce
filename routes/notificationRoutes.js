const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationConteroller');


router.get('/notifications',notificationController.notificationPageLoad);
router.post('/notifications',notificationController.addNotification);
router.delete('/notifications',notificationController.clearNotification);

module.exports = router;