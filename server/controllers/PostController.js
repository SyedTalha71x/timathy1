const PostModel = require('../models/PostModel');
const TagsModel = require('../models/TagsModel');
const { uploadToCloudinary } = require('../utils/CloudinaryUpload');
const { UnAuthorizedError, BadRequestError, NotFoundError } = require('../middleware/error/httpErrors'); // Make sure to import your error classes
const StudioModel = require('../models/StudioModel')


const createPost = async (req, res, next) => {
    try {
        const userId = req.user?._id;
        const role = req.user?.role;
        const studioId = req.user?.studio;

        if (role !== 'staff') throw new UnAuthorizedError('You are not authorized to create post');

        // Extract data from req.body (multer parses text fields)
        let {
            title,
            content,
            schedule,
            scheduleTime,
            scheduleDate,
            scheduleEndTime,
            postType,
            status,
            tagsId
        } = req.body;

        // Parse tagsId if it's a JSON string
        if (typeof tagsId === 'string') {
            try {
                tagsId = JSON.parse(tagsId);
            } catch (e) {
                // If parsing fails, keep as is
                console.log('Failed to parse tagsId:', e);
            }
        }

        // Process tags
        let tagsArray = [];
        if (tagsId && tagsId.length > 0) {
            const tagsIdArray = Array.isArray(tagsId) ? tagsId : [tagsId];

            // Validate that each ID is a valid ObjectId format
            const mongoose = require('mongoose');
            const validObjectIds = tagsIdArray.filter(id => mongoose.Types.ObjectId.isValid(id));

            if (validObjectIds.length !== tagsIdArray.length) {
                throw new BadRequestError("One or more tag IDs are invalid");
            }

            const validTags = await TagsModel.find({
                _id: { $in: validObjectIds },
                studioId: studioId
            });

            if (validTags.length !== validObjectIds.length) {
                throw new BadRequestError("One or more tag IDs are invalid or don't belong to this studio");
            }
            tagsArray = validTags.map(tag => tag._id);
        }

        // Process image data from multer
        let imageData = null;
        if (req.file) {
            imageData = await uploadToCloudinary(req.file.buffer);
        }

        let post;

        // Check if post should be published immediately or scheduled
        if (schedule === 'immediate' || schedule === 'immediately') {
            // Create and publish immediately
            post = await PostModel.create({
                title,
                content,
                schedule: 'immediate',
                status: 'active',
                tags: tagsArray,
                createdBy: userId,
                studioId: studioId,
                postType: postType || 'public',
                publishedAt: new Date(),
                img: imageData ? {
                    url: imageData.secure_url,
                    public_id: imageData.public_id
                } : null,
                createdBy: userId,
                studioId: studioId
            });
        } else if (schedule === 'scheduled') {
            // Validate scheduled date and time
            if (!scheduleDate || !scheduleTime) {
                throw new BadRequestError('Schedule date and time are required for scheduled posts');
            }

            // Combine date and time into a single datetime object
            const scheduledDateTime = new Date(`${scheduleDate}T${scheduleTime}`);

            // Check if scheduled time is in the future
            if (scheduledDateTime <= new Date()) {
                throw new BadRequestError('Scheduled time must be in the future');
            }

            // Create post with scheduled status
            post = await PostModel.create({
                title,
                content,
                schedule: 'scheduled',
                scheduleDate: scheduledDateTime,
                scheduleEndTime: scheduleEndTime || null,
                status: 'scheduled',
                tags: tagsArray,
                createdBy: userId,
                studioId: studioId,
                postType: postType || 'public',
                img: imageData ? {
                    url: imageData.secure_url,
                    public_id: imageData.public_id
                } : null,
                createdBy: userId,
                studioId: studioId
            });
        } else {
            throw new BadRequestError('Invalid schedule type. Must be "immediate", "immediately", or "scheduled"');
        }

        // Update studio with post reference
        await StudioModel.findByIdAndUpdate(studioId, {
            $push: {
                posts: post._id
            }
        }, { new: true });

        return res.status(201).json({
            success: true,
            message: schedule === 'scheduled' ? 'Post scheduled successfully' : 'Post published successfully',
            post: post
        });

    } catch (error) {
        next(error);
    }
};

const updatePost = async (req, res, next) => {
    try {
        const { postId } = req.params;
        const userId = req.user?._id;
        const role = req.user?.role;
        const studioId = req.user?.studio;

        if (role !== 'staff') throw new UnAuthorizedError('You are not authorized to update post');

        const {
            title,
            content,
            schedule,
            scheduleTime,
            scheduleDate,
            scheduleEndTime,
            postType,
            status,
            tagsId,
            img
        } = req.body;

        // Check if post exists
        const existingPost = await PostModel.findById(postId);
        if (!existingPost) {
            throw new NotFoundError('Post not found');
        }

        // Check if user owns this post or has permission
        // if (existingPost.createdBy.toString() !== userId.toString()) {
        //     throw new UnAuthorizedError('You are not authorized to update this post');
        // }

        // Prepare update data - ONLY include fields that are explicitly provided
        let updateData = {};

        // Check each field with hasOwnProperty or !== undefined
        if (title !== undefined && title !== null) updateData.title = title;
        if (content !== undefined && content !== null) updateData.content = content;
        if (schedule !== undefined && schedule !== null) updateData.schedule = schedule;
        if (postType !== undefined && postType !== null) updateData.postType = postType;
        if (status !== undefined && status !== null) updateData.status = status;

        // Process tags if provided (and not empty array)
        if (tagsId !== undefined && tagsId !== null) {
            let tagsIdArray = [];

            // Handle different types of tagsId input
            if (typeof tagsId === 'string') {
                try {
                    // Try to parse as JSON (for stringified array)
                    tagsIdArray = JSON.parse(tagsId);
                } catch {
                    // If parsing fails, treat as single ID
                    tagsIdArray = [tagsId];
                }
            } else if (Array.isArray(tagsId)) {
                tagsIdArray = tagsId;
            } else if (typeof tagsId === 'object' && tagsId !== null) {
                tagsIdArray = [tagsId];
            }

            // Only validate if there are tags
            if (tagsIdArray.length > 0) {
                const validTags = await TagsModel.find({
                    _id: { $in: tagsIdArray },
                    studioId: studioId
                });

                if (validTags.length !== tagsIdArray.length) {
                    throw new BadRequestError("One or more tag IDs are invalid or don't belong to this studio");
                }
                updateData.tags = validTags.map(tag => tag._id);
            } else {
                // If empty array is provided, clear the tags
                updateData.tags = [];
            }
        }

        // Handle schedule changes - only if schedule is provided and it's 'scheduled'
        if (schedule !== undefined && schedule !== null) {
            if (schedule === 'scheduled' && scheduleDate && scheduleTime) {
                const scheduledDateTime = new Date(`${scheduleDate}T${scheduleTime}`);
                if (scheduledDateTime <= new Date()) {
                    throw new BadRequestError('Scheduled time must be in the future');
                }
                updateData.scheduleDate = scheduledDateTime;
                updateData.scheduleEndTime = scheduleEndTime || null;
            } else if (schedule === 'immediate') {
                // If immediate, clear schedule dates
                updateData.scheduleDate = null;
                updateData.scheduleEndTime = null;
            }
        }

        // Handle image update - check if img field was provided and file exists
        if (req.file) {
            // Upload new image to Cloudinary
            const imageData = await uploadToCloudinary(req.file.buffer);
            updateData.img = {
                url: imageData.secure_url,
                public_id: imageData.public_id
            };
        }

        // Update the post
        const updatedPost = await PostModel.findByIdAndUpdate(
            postId,
            updateData,
            { new: true, runValidators: true }
        );

        return res.status(200).json({
            success: true,
            message: 'Post updated successfully',
            post: updatedPost
        });

    } catch (error) {
        next(error);
    }
};

const deletePost = async (req, res, next) => {
    try {
        const { postId } = req.params;
        const userId = req.user?._id;
        const role = req.user?.role;

        if (role !== 'staff') throw new UnAuthorizedError('You are not authorized to delete post');

        // Check if post exists
        const post = await PostModel.findById(postId);
        if (!post) throw new NotFoundError("Post not found");

        // // Check if user owns this post or has admin privileges
        // if (post.createdBy.toString() !== userId.toString() || role !== 'staff') {
        //     throw new UnAuthorizedError('You are not authorized to delete this post');
        // }

        // Delete the post
        await PostModel.findByIdAndDelete(postId);

        return res.status(200).json({
            success: true,
            message: "Post deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};

const activePost = async (req, res, next) => {
    try {
        const { postId } = req.params;
        const role = req.user?.role;

        if (role !== 'staff') throw new UnAuthorizedError('You are not authorized to activate posts');

        const post = await PostModel.findById(postId);
        if (!post) throw new NotFoundError("Post not found");

        const updatedPost = await PostModel.findByIdAndUpdate(
            postId,
            {
                status: 'active',
                isActive: true,
                publishedAt: new Date() // Set published date when activating
            },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: 'Post activated successfully',
            post: updatedPost
        });
    } catch (error) {
        next(error);
    }
};

const deactivatePost = async (req, res, next) => {
    try {
        const { postId } = req.params;
        const role = req.user?.role;

        if (role !== 'staff') throw new UnAuthorizedError('You are not authorized to deactivate posts');

        const post = await PostModel.findById(postId);
        if (!post) throw new NotFoundError("Post not found");

        const updatedPost = await PostModel.findByIdAndUpdate(
            postId,
            {
                status: 'inactive',
                isActive: false
            },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: 'Post deactivated successfully',
            post: updatedPost
        });
    } catch (error) {
        next(error);
    }
};

const getAllPosts = async (req, res, next) => {
    try {
        const studioId = req.user?.studio;
        const { status, postType, page = 1, limit = 10 } = req.query;

        // Build query
        let query = { studioId: studioId };

        if (status) query.status = status;
        if (postType) query.postType = postType;

        // Pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const posts = await PostModel.find(query)
            .populate('tags', 'name color')
            .populate('createdBy', 'firstName lastName email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await PostModel.countDocuments(query);

        return res.status(200).json({
            success: true,
            posts,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / parseInt(limit)),
                totalItems: total,
                itemsPerPage: parseInt(limit)
            }
        });
    } catch (error) {
        next(error);
    }
};

const getPostById = async (req, res, next) => {
    try {
        const { postId } = req.params;
        const studioId = req.user?.studio;

        const post = await PostModel.findOne({ _id: postId, studioId: studioId })
            .populate('tags', 'name')
            .populate('createdBy', 'firstName lastName email');

        if (!post) throw new NotFoundError("Post not found");

        return res.status(200).json({
            success: true,
            post
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createPost,
    updatePost,
    deletePost,
    activePost,
    deactivatePost,
    getAllPosts,
    getPostById,

};