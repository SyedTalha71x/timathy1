const PostModel = require('../models/PostModel')
const TagsModel = require('../models/TagsModel')


const createPost = async (req, res, next) => {
    try {
        const userId = req.user?._id;
        const role = req.user?.role
        const studioId = req.user?.studio
        if (role !== 'staff') throw new UnAuthorizedError('You are not authorized To create Post')

        const { title, content, schedule, scheduleTime, scheduleDate, scheduleEndTime, postType, status, tagsId } = req.body;


        let tagsArray = []
        if (tagsId) {
            const tagsIdArray = Array.isArray(tagsId) ? tagsId : [tagsId]

            const validTags = await TagsModel.find({
                _id: { $in: tagsIdArray },
                studioId: studioId
            });

            if (validTags.length !== tagsIdArray.length) {
                throw new BadRequestError("One or more tag IDs are invalid or don't belong to this studio");
            }

            tagsArray = validTags.map(tag => tag._id);
        }

        const post = await PostModel.create({
            title,
            content,
            schedule,
            scheduleDate,
            scheduleEndTime,
            scheduleTime,
            postType,
            status,
            tags: tagsArray
        })

        return res.status(201).json({
            success: true,
            post: post
        })
    }
    catch (error) {
        next(error)
    }
}

module.export = {
    createPost
}