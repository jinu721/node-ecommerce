const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');


router.get('/chat',chatController.chatLoad);
router.post('/chat/generate-token',chatController.generateChatToken);

module.exports = router;