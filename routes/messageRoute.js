const express = require('express')
const { createMessage, getMessages, deleteMessage, deleteMultipleMessages } = require('../controllers/messageControllers');
const router = express.Router()

router.post('/',createMessage);
router.get("/:chatId" , getMessages)
router.post("/delete" , deleteMessage)
router.post("/delete-messages" , deleteMultipleMessages)


module.exports = router;