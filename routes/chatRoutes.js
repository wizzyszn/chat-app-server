const express = require('express');
const { createChat, findUserChats, findChat } = require('../controllers/chatControllers');
const router = express.Router();
router.post('/create-chat', createChat)
router.get('/user-chats/:userId',findUserChats );
router.get('/get-chat/:firstId/:secondId', findChat);

module.exports = router