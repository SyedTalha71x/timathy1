
const { BadRequestError } = require('../middleware/error/httpErrors');
const chatModel = require('../models/communicationModel/chatModel')
const messageModel = require('../models/communicationModel/messageModel');
const StudioModel = require('../models/StudioModel')
const UserModel = require('../models/UserModel');
// const mongoose = require('mongoose')


// --------------------------------------------------------------
//  Group Access
// --------------------------------------------------------------
const accessChat = async (req, res, next) => {
    try {
        const { receiverId } = req.body;
        const userId = req.user?._id;

        if (!receiverId) throw new BadRequestError("Invalid receiverId");
        if (receiverId.toString() === userId.toString()) {
            throw new BadRequestError('You cannot create chat with yourself');
        }
        let chat = await chatModel.findOne({
            isGroupChat: false,
            users: {
                $all: [userId, receiverId]
            }
        })
            .populate('users', 'firstName lastName');

        if (!chat) {
            chat = await chatModel.create({
                users: [userId, receiverId],
                isGroupChat: false
            });
            chat = await chat.populate('users', 'firstName lastName')
            await UserModel.updateMany(
                { _id: { $in: [userId, receiverId] } },
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

        // 🔐 MEMBER: Can only send to their OWN studio chat
        if (req.user.role === "member") {
            if (chat.member?.toString() !== userId.toString()) {
                throw new BadRequestError("Members can only chat through their assigned studio");
            }
            // Optional: Check if message goes to studio (not directly to staff)
            if (!chat.studio) {
                throw new BadRequestError("Invalid chat type for member");
            }
        }

        // 🔐 STAFF: Can reply to studio chats OR staff chats OR group chats
        if (req.user.role === "staff") {
            // Allow staff to reply to:
            // 1. Studio chats (chat.studio exists)
            // 2. Staff 1-1 chats (users array includes staff)
            // 3. Group chats (isGroupChat true)

            const isStudioChat = !!chat.studio;
            const isStaffChat = chat.users?.includes(userId);
            const isGroupChat = chat.isGroupChat;

            if (!isStudioChat && !isStaffChat && !isGroupChat) {
                throw new BadRequestError("Staff cannot reply to this chat type");
            }

            // If it's a studio chat, verify studio matches
            if (isStudioChat && chat.studio?.toString() !== req.user?.studio.toString()) {
                throw new BadRequestError("Not authorized for this studio chat");
            }
        }

        // Create and send message (rest of your existing code)
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



// Delete message 
const deleteMessage = async (req, res, next) => {
    try {
        const { messageId } = req.params;
        const message = await messageModel.findById(messageId)

        await messageModel.findByIdAndDelete(messageId)
        return res.status(200).json({
            success: true,
            message: "Deleted successfully"
        })
    }
    catch (error) {
        next(error)
    }
}

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

        await StudioModel.findByIdAndUpdate(studioId, {
            $push: { chat: chat._id }
        }, { new: true })

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


// --------------------------------------------------------------
//  Fetch ALL chats for logged-in user (Member or Staff)
// --------------------------------------------------------------
// Staff sees ALL studio-member chats + their 1-1 + group chats
// Member only has ONE chat - their studio chat
const fetchMemberChat = async (req, res, next) => {
    try {
        const memberId = req.user?._id;

        const chat = await chatModel.findOne({
            member: memberId
        })
            .populate('member', 'firstName lastName img')
            .populate('studio', 'name')
            .populate({
                path: 'messages',  // if you have messages reference
                options: { sort: { createdAt: -1 } }
            });

        if (!chat) {
            return res.status(200).json({
                success: true,
                chat: null,
                message: "No studio chat assigned yet"
            });
        }

        return res.status(200).json({
            success: true,
            chat: chat
        });

    } catch (error) {
        next(error);
    }
};


const fetchStaffAllChats = async (req, res, next) => {
    try {
        const staffId = req.user?._id;
        const studioId = req.user?.studio;

        // Get ALL chats relevant to this staff
        const chats = await chatModel.find({
            $or: [
                { studio: studioId },           // All studio-member chats
                { users: staffId },             // Staff's 1-1 with other staff
                {
                    isGroupChat: true,
                    users: staffId              // Group chats staff is in
                }
            ]
        })
            .populate('member', 'firstName lastName img')  // for studio-member chats
            .populate('users', 'firstName lastName img role')  // for 1-1 & group
            .populate('studio', 'studioName')
            .sort({ updatedAt: -1 });

        // Add metadata about chat type
        const enrichedChats = chats.map(chat => ({
            ...chat.toObject(),
            chatCategory: chat.studio ? 'studio-member' :
                (chat.isGroupChat ? 'group' : 'one-to-one'),
            canReply: true,  // Staff can reply to all
            replyVia: chat.studio ? 'studio' : 'direct'
        }));

        return res.status(200).json({
            success: true,
            count: enrichedChats.length,
            chats: enrichedChats
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    fetchMessages,
    sendMessage,
    deleteMessage,
    createGroupChat,
    accessChat,
    accessStudioChat,
    fetchStudioChat,
    fetchMemberChat,
    fetchStaffAllChats
}