const express = require('express');
const router = express.Router();

const {
    accessChat,
    createGroupChat,
    sendMessage,
    fetchMessages,
    accessStudioChat,
    fetchStudioChat,
    fetchMemberChat,
    fetchStaffAllChats,
    deleteMessage
} = require('../controllers/ChatController');

const { verifyAccessToken } = require('../middleware/verifyToken');
const { isStaff, isMember } = require('../middleware/RoleCheck')

// -------------------------------------
// USER ↔ USER CHAT (existing)
// -------------------------------------

router.get('/member', verifyAccessToken, fetchMemberChat)
router.get('/all', verifyAccessToken, fetchStaffAllChats)

router.post('/access-chat', verifyAccessToken, accessChat);
router.post('/group-chat', verifyAccessToken, createGroupChat);


// -------------------------------------
// MEMBER ↔ STUDIO CHAT (NEW)
// -------------------------------------

// Member creates/gets chat with studio
router.post('/studio/access', verifyAccessToken, isMember, accessStudioChat);

// Staff fetch all studio chats (shared inbox)
router.get('/studio/chats', verifyAccessToken, isStaff, fetchStudioChat);


// -------------------------------------
// COMMON (both use same)
// -------------------------------------

// Send message (member or staff)
router.post('/send-message', verifyAccessToken, sendMessage);

// Get messages of a chat
router.get('/message/:chatId', verifyAccessToken, fetchMessages);

router.delete('/message/:messageId', verifyAccessToken, deleteMessage)

module.exports = router;