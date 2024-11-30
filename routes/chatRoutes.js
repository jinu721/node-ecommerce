const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');


router.get('/chat',chatController.loadChat);
router.get('/adminchat',chatController.admincChat);
// router.get("/messages/:userId", chatController.getMessages);
// router.post("/send", chatController.sendMessage);

module.exports = router;