
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

        const message = await messageModel.create({
            chat: chatId,
            sender: userId,
            content
        });
        const fullMessage = await message.populate('sender', 'firstName lastName');
        await fullMessage.populate('chat');

        res.status(201).json({
            success: true,
            message: "Message send Successfully",
            fullMessage: fullMessage
        })


    }
    catch (error) {
        next(error)
    }
}



// --------------------------------------------------------------
//  Fetch Chat  messages Controller
// --------------------------------------------------------------

const fetchMessages = async (req, res, next) => {
    try {
        const { chatId } = req.params;
        const message = await messageModel.find({ chat: chatId })
            .populate('sender', 'firstName lastName')
            .populate('chat');

        return res.status(200).json({
            success: true,
            message: message
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
    accessChat
}