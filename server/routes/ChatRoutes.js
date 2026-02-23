const express = require('express');
const router = express.Router();
const { accessChat, createGroupChat, sendMessage, fetchMessages } = require('../controllers/ChatController');
const { verifyAccessToken } = require('../middleware/verifyToken')



router.post('/access-chat', verifyAccessToken, accessChat)
router.post('/group-chat', verifyAccessToken, createGroupChat);
router.post('/send-message', verifyAccessToken, sendMessage)
router.get('/message/:chatId', verifyAccessToken, fetchMessages);


module.exports = router