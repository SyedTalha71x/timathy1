
const { BadRequestError } = require('../middleware/error/httpErrors');
const chatModel = require('../models/communicationModel/chatModel')
const messageModel = require('../models/communicationModel/messageModel');
const UserModel = require('../models/UserModel');
// const mongoose = require('mongoose')


// --------------------------------------------------------------
//  Group Access
// --------------------------------------------------------------
const accessChat = async (req, res, next) => {
    try {
        const { reciverId } = req.body;
        const userId = req.user?._id;

        if (!reciverId) throw new BadRequestError("Invalid ReciverId");
        if (reciverId.toString() === userId.toString()) {
            throw new BadRequestError('You cannot create chat with yourself');
        }
        let chat = await chatModel.findOne({
            isGroupChat: false,
            users: {
                $all: [userId, reciverId]
            }
        })
            .populate('users', 'firstName lastName');

        if (!chat) {
            chat = await chatModel.create({
                users: [userId, reciverId],
                isGroupChat: false
            });
            chat = await chat.populate('users', 'firstName lastName')
            await UserModel.updateMany(
                { _id: { $in: [userId, reciverId] } },
                { $addToSet: { chats: chat._id } } // prevents duplicate
            );
        }

        return res.status(200).json({
            success: true,
            chat: chat
        })
    } catch (error) {
        next(error);
    }
}


// --------------------------------------------------------------
//  Group Creation Controller
// --------------------------------------------------------------
const createGroupChat = async (req, res, next) => {
    try {
        const { name, userIds } = req.body;
        if (!name || !userIds || userIds.length < 2) throw new BadRequestError("Provide GroupName and atleast 2 users to create group");


        const chat = await chatModel.create({
            chatName: name,
            users: [req.user?._id, ...userIds],
            isGroupChat: true
        });
        const fullChat = await chat.populate('users', '-password')

        await UserModel.updateMany(
            { _id: { $in: [req.user._id, ...userIds] } },
            { $addToSet: { chats: chat._id } } // prevents duplicate
        );


        res.status(201).json({
            success: true,
            message: `${chat.chatName} created successfully`,
            chat: fullChat
        })

    }
    catch (error) {
        next(error)
    }
}

// --------------------------------------------------------------
//  Message Sending Controller
// --------------------------------------------------------------


const sendMessage = async (req, res, next) => {
    try {
        const userId = req.user?._id;
        const { chatId, content } = req.body;

        if (!chatId || !content) throw new BadRequestError("Invalid Data");

        const chat = await chatModel.findById(chatId);
        if (!chat) throw new BadRequestError("Chat not found");

        // 🔐 Authorization
        if (req.user.role === "member") {
            if (chat.member?.toString() !== userId.toString()) {
                throw new BadRequestError("Not authorized");
            }
        }

        if (req.user.role === "staff") {
            if (chat.studio?.toString() !== req.user.studio.toString()) {
                throw new BadRequestError("Not authorized");
            }
        }

        const message = await messageModel.create({
            chat: chatId,
            sender: userId,
            senderType: req.user?.role === 'staff' ? "staff" : "member",
            content
        });

        const fullMessage = await messageModel
            .findById(message._id)
            .populate('sender', 'firstName lastName img')
            .populate('chat');
        // ✅ update chat for sorting
        await chatModel.findByIdAndUpdate(chatId, {
            lastMessage: content,
            updatedAt: new Date()
        });

        res.status(201).json({
            success: true,
            message: "Message sent Successfully",
            fullMessage: fullMessage
        });

    } catch (error) {
        next(error);
    }
};



// --------------------------------------------------------------
//  Fetch Chat  messages Controller
// --------------------------------------------------------------

const fetchMessages = async (req, res, next) => {
    try {
        const { chatId } = req.params;
        const userId = req.user?._id;

        const chat = await chatModel.findById(chatId);
        if (!chat) throw new BadRequestError("Chat not found");

        // 🔐 Authorization
        if (req.user.role === "member") {
            if (chat.member?.toString() !== userId.toString()) {
                throw new BadRequestError("Not authorized");
            }
        }

        if (req.user.role === "staff") {
            if (chat.studio?.toString() !== req.user.studio.toString()) {
                throw new BadRequestError("Not authorized");
            }
        }

        const messages = await messageModel.find({ chat: chatId })
            .populate('sender', 'firstName lastName img')
            .populate('chat');

        return res.status(200).json({
            success: true,
            messages: messages
        });

    } catch (error) {
        next(error);
    }
};

// --------------------------------
// studio chat Access 
// --------------------------------

const accessStudioChat = async (req, res, next) => {
    try {
        const userId = req.user?._id;
        const studioId = req.user?.studio;

        let chat = await chatModel.findOne({
            member: userId,
            studio: studioId
        })
            .populate('member', 'firstName lastName img')

        if (!chat) {
            chat = await chatModel.create({
                member: userId,
                studio: studioId,
                isGroupChat: false
            });
            chat = await chat.populate('member', 'firstName lastName img')
        }

        return res.status(200).json({
            success: true,
            chat: chat
        })


    }
    catch (error) {
        next(error)
    }
}


// -------------------------
// Fetch all studio Chat
// -------------------------

const fetchStudioChat = async (req, res, next) => {
    try {
        const studioId = req.user?.studio;
        const chat = await chatModel.find({ studio: studioId })
            .populate('member', 'firstName lastName img')
            .sort({ updatedAt: -1 })

        return res.status(200).json({
            success: true,
            chats: chat
        })

    }
    catch (error) {
        next(error)
    }
}

module.exports = {
    fetchMessages,
    createGroupChat,
    sendMessage,
    accessChat,
    accessStudioChat,
    fetchStudioChat
}