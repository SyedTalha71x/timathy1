const { UnAuthorizedError } = require('../middleware/error/httpErrors');
const TicketModel = require('../models/TicketModel');
const { uploadAttachment } = require('../utils/CloudinaryUpload');

// create Ticket
const createTicket = async (req, res, next) => {
    try {
        const userId = req.user?._id;
        const studioId = req.user?.studio;

        const { subject, reason, additionalDescription } = req.body;

        // Validate required fields
        if (!subject || !reason) {
            return res.status(400).json({
                success: false,
                message: "Subject and reason are required"
            });
        }

        let attachmentData = null;

        // Handle file upload if present
        if (req.file) {
            const imageData = await uploadAttachment(req.file.buffer);
            attachmentData = {
                url: imageData.secure_url,
                public_id: imageData.public_id
            };
        }

        // Create initial message from user
        const initialMessage = {
            sender: 'user',
            senderId: userId,
            content: additionalDescription || subject,
            timestamp: new Date(),
            uploadedImages: attachmentData
        };

        // Create ticket with messages array
        const ticket = await TicketModel.create({
            subject,
            reason,
            additionalDescription,
            createdBy: userId,
            studio: studioId,
            uploadedImages: attachmentData,
            messages: [initialMessage],
            status: 'open',
            isClosed: false
        });

        return res.status(201).json({
            success: true,
            ticket: ticket
        });
    } catch (error) {
        next(error);
    }
};

// update Ticket - Add reply to conversation
const updateTicket = async (req, res, next) => {
    try {
        const userId = req.user?._id;
        const { id } = req.params;
        const { replyText } = req.body;

        // Validate input
        if (!replyText && !req.file) {
            return res.status(400).json({
                success: false,
                message: "Reply text or attachment is required"
            });
        }

        // Find the ticket
        const ticket = await TicketModel.findById(id);

        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: "Ticket not found"
            });
        }

        // Check if ticket is closed
        if (ticket.status === 'close' || ticket.isClosed === true) {
            return res.status(400).json({
                success: false,
                message: "Ticket is closed. You cannot reply."
            });
        }

        // Handle image upload if present
        let imageData = null;
        if (req.file) {
            imageData = await uploadAttachment(req.file.buffer);
        }

        // Create new message
        const newMessage = {
            sender: 'support',
            senderId: userId,
            content: replyText || '',
            timestamp: new Date(),
            uploadedImages: imageData ? {
                url: imageData.secure_url,
                public_id: imageData.public_id
            } : null
        };

        // Prepare update object
        const updateData = {
            $push: { messages: newMessage }, // Add to messages array
            $set: {
                updatedAt: new Date(),
                // Optional: Update status when replied
                status: ticket.status === 'open' ? 'in-progress' : ticket.status
            }
        };

        // For backward compatibility, also update old fields
        updateData.$set.replyText = replyText;
        updateData.$set.repliedBy = userId;
        
        if (imageData) {
            updateData.$set.uploadedImagesBySupport = {
                url: imageData.secure_url,
                public_id: imageData.public_id
            };
        }

        const updatedTicket = await TicketModel.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        ).populate('createdBy', 'firstName lastName img email')
         .populate('repliedBy', 'firstName lastName img email')
         .populate('messages.senderId', 'firstName lastName img email');

        return res.status(200).json({
            success: true,
            ticket: updatedTicket
        });
    } catch (error) {
        next(error);
    }
};

// get all tickets
const getTicket = async (req, res, next) => {
    try {
        const studioId = req.user?.studio;

        if (!studioId) {
            return res.status(400).json({
                success: false,
                message: "Studio not found for this user"
            });
        }

        const tickets = await TicketModel.find({ studio: studioId })
            .populate('createdBy', 'firstName lastName img email')
            .populate('repliedBy', 'firstName lastName img email')
            .populate('messages.senderId', 'firstName lastName img email')
            .sort({ createdAt: -1 }); // Sort by newest first

        return res.status(200).json({
            success: true,
            ticket: tickets
        });
    } catch (error) {
        next(error);
    }
};

// get single ticket by ID
const getTicketById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const studioId = req.user?.studio;

        const ticket = await TicketModel.findOne({ _id: id, studio: studioId })
            .populate('createdBy', 'firstName lastName img email')
            .populate('repliedBy', 'firstName lastName img email')
            .populate('messages.senderId', 'firstName lastName img email');

        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: "Ticket not found"
            });
        }

        return res.status(200).json({
            success: true,
            ticket: ticket
        });
    } catch (error) {
        next(error);
    }
};

// delete Ticket
const deleteTicket = async (req, res, next) => {
    try {
        const { id } = req.params;
        const studioId = req.user?.studio;

        const ticket = await TicketModel.findOne({ _id: id, studio: studioId });

        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: "Ticket not found"
            });
        }

        // Optional: Delete uploaded images from Cloudinary
        // if (ticket.uploadedImages?.public_id) {
        //     await deleteFromCloudinary(ticket.uploadedImages.public_id);
        // }
        // if (ticket.uploadedImagesBySupport?.public_id) {
        //     await deleteFromCloudinary(ticket.uploadedImagesBySupport.public_id);
        // }

        await TicketModel.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: "Ticket deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};

// close Ticket
const isClosedTicket = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user?._id;
        const studioId = req.user?.studio;

        const ticket = await TicketModel.findOne({ _id: id, studio: studioId });

        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: "Ticket not found"
            });
        }

        // Check if already closed
        if (ticket.isClosed === true || ticket.status === 'close') {
            return res.status(400).json({
                success: false,
                message: "Ticket is already closed"
            });
        }

        // Add closing message to conversation
        const closingMessage = {
            sender: 'support',
            senderId: userId,
            content: 'This ticket has been closed.',
            timestamp: new Date(),
            uploadedImages: null
        };

        const updateData = {
            isClosed: true,
            status: 'close',
            $push: { messages: closingMessage },
            $set: {
                closedAt: new Date(),
                closedBy: userId,
                updatedAt: new Date()
            }
        };

        const updatedTicket = await TicketModel.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        ).populate('createdBy', 'firstName lastName img email')
         .populate('messages.senderId', 'firstName lastName img email');

        return res.status(200).json({
            success: true,
            ticket: updatedTicket,
            message: "Ticket closed successfully"
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createTicket,
    updateTicket,
    deleteTicket,
    getTicket,
    getTicketById,
    isClosedTicket
};