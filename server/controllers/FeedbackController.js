const FeedbackModel = require('../models/FeedbackModel')
const UserModel = require('../models/UserModel')



const createFeedback = async (req, res, next) => {
    try {
        const userId = req.user?._id;
        const { type, subject, message, rating } = req.body;


        const feedback = await FeedbackModel.create({
            type,
            subject,
            message,
            rating,
            user: userId
        })

        return res.status(201).json({
            success: true,
            message: "Feedback Submitted successfully",
            feedback: feedback
        })
    }
    catch (error) {
        next(error)
    }
}

const getFeedback = async (req, res, next) => {
    try {
        const userId = req.user?._id;
        const feedback = await FeedbackModel.find().populate('user', 'firstName lastName img email').sort({ createdAt: -1 })

        return res.status(200).json({
            success: true,
            feedback: feedback
        })
    }
    catch (error) {
        next(error)
    }
}

const deleteFeedback = async (req, res, next) => {
    try {
        const userId = req.user?._id;
        const { id } = req.params;

        const feedback = await FeedbackModel.findById(id);

        await FeedbackModel.findByIdAndDelete(id)

        return res.status(200).json({
            success: true,
            message: "Deleted Successfully"
        })
    } catch (error) {
        next(error)
    }
}

module.exports = { createFeedback, getFeedback, deleteFeedback }