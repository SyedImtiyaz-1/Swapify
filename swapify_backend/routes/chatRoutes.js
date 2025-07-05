const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');
const authMiddleware = require('../middlewares/authMiddleware');

// Create a new chat
router.post('/chats', authMiddleware, async (req, res) => {
    try {
        const { listingId, message } = req.body;
        
        // Check if chat already exists
        let chat = await Chat.findOne({
            listing: listingId,
            participants: { $all: [req.userId] }
        });

        if (!chat) {
            // Create new chat
            chat = new Chat({
                listing: listingId,
                participants: [req.userId],
                messages: [{
                    sender: req.userId,
                    content: message
                }]
            });
            await chat.save();
        }

        const populatedChat = await Chat.findById(chat._id)
            .populate('listing')
            .populate('participants', 'username email user_avatar google_user_avatar')
            .populate('messages.sender', 'username email user_avatar google_user_avatar');

        res.json(populatedChat);
    } catch (error) {
        console.error('Chat creation error:', error);
        res.status(500).json({ message: 'Failed to create chat' });
    }
});

// Get chats for a user
router.get('/chats', authMiddleware, async (req, res) => {
    try {
        const chats = await Chat.find({ participants: req.userId })
            .populate('listing')
            .populate('participants', 'username email user_avatar google_user_avatar')
            .populate('messages.sender', 'username email user_avatar google_user_avatar')
            .sort({ 'messages.createdAt': -1 });
        res.json(chats);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching chats' });
    }
});

// Get single chat
router.get('/chats/:chatId', authMiddleware, async (req, res) => {
    try {
        const chat = await Chat.findById(req.params.chatId)
            .populate('listing')
            .populate('participants', 'username email user_avatar google_user_avatar')
            .populate('messages.sender', 'username email user_avatar google_user_avatar');
            
        if (!chat) {
            return res.status(404).json({ message: 'Chat not found' });
        }
        
        res.json(chat);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching chat' });
    }
});

// Send message in chat
router.post('/chats/:chatId/messages', authMiddleware, async (req, res) => {
    try {
        const { content } = req.body;
        const chat = await Chat.findById(req.params.chatId);
        
        if (!chat) {
            return res.status(404).json({ message: 'Chat not found' });
        }

        const message = {
            sender: req.userId,
            content
        };

        chat.messages.push(message);
        chat.lastMessage = new Date();
        await chat.save();

        const populatedChat = await Chat.findById(chat._id)
            .populate('listing')
            .populate('participants', 'username email user_avatar google_user_avatar')
            .populate('messages.sender', 'username email user_avatar google_user_avatar');

        res.json(populatedChat.messages[populatedChat.messages.length - 1]);
    } catch (error) {
        res.status(500).json({ message: 'Error sending message' });
    }
});

module.exports = router;
