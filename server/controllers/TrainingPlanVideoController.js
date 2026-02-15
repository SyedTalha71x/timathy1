// const TrainingModel = require('../models/trainingModels/TrainingPlanModel')
const TrainingVideoModel = require('../models/trainingModels/TrainingVideoModel');
const { uploadThumbnail, uploadTrainingPlanVideo } = require('../utils/CloudinaryUpload');
const { NotFoundError } = require('../middleware/error/httpErrors')
const { AdminModel, StaffModel } = require('../models/Discriminators');





// format duration
const formatDuration = (seconds) => {
    const min = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${min}:${secs.toString().padStart(2, "0")}`
};

// upload training video with thumbnail
const createTrainingVideoUpload = async (req, res, next) => {
    try {
        const userId = req.user?._id;
        const { title, description, difficulty, category, targetMuscles } = req.body;

        const videoFile = req.files?.videoUrl?.[0];
        const thumbnailFile = req.files?.thumbnail?.[0];

        if (!videoFile) {
            throw new NotFoundError("Video file is required");
        }

        if (!thumbnailFile) {
            throw new NotFoundError("Thumbnail is required");
        }

        // Upload thumbnail
        const cloudinaryThumbnailUpload = await uploadThumbnail(
            thumbnailFile.buffer
        );

        // Upload video
        const cloudinaryVideoUpload = await uploadTrainingPlanVideo(
            videoFile.buffer
        );

        const videoUpload = await TrainingVideoModel.create({
            title,
            description,
            duration: formatDuration(cloudinaryVideoUpload.duration),
            difficulty,
            category,
            targetMuscles,
            instructor: userId,
            videoUrl: {
                url: cloudinaryVideoUpload.url,
                public_id: cloudinaryVideoUpload.public_id,
            },
            thumbnail: {
                url: cloudinaryThumbnailUpload.secure_url,
                public_id: cloudinaryThumbnailUpload.public_id,
            },
        });
        return res.status(201).json({
            success: true,
            video: videoUpload,
        });
    } catch (error) {
        next(error);
    }
};

// showing all videos with pagination and filtering
const getAllTrainingVideos = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, difficulty, category } = req.query;
        const filter = {};
        if (difficulty) filter.difficulty = difficulty;
        if (category) filter.category = category;

        const videos = await TrainingVideoModel.find(filter)
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .populate("instructor", "firstName lastName");

        const totalVideos = await TrainingVideoModel.countDocuments(filter);
        return res.status(200).json({
            success: true,
            videos,
            totalPages: Math.ceil(totalVideos / limit),
            currentPage: parseInt(page),
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { createTrainingVideoUpload, getAllTrainingVideos }
