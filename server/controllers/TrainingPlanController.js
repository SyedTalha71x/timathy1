const TrainingPlanModel = require('../models/trainingModels/TrainingPlanModel');
const TrainingVideoModel = require('../models/trainingModels/TrainingVideoModel');
const { MemberModel } = require('../models/Discriminators');
const { NotFoundError, BadRequestError, UnAuthorizedError } = require('../middleware/error/httpErrors');


const createPlan = async (req, res, next) => {
    try {
        const userId = req.user?._id;
        const role = req.user?.role;
        const { name, description, duration, difficulty, category, workoutsPerWeek, exercises, memberId: bodyMemberId } = req.body;

        // checking all field is filled or not?
        if (!name || !description || !duration || !difficulty || !category || !workoutsPerWeek || !Array.isArray(exercises) || !exercises.length === 0) {
            throw new BadRequestError('All fields are required');
        }


        // to know who create plan (admin || staff) or member himself
        let finalMemberId;
        if (role === 'admin' || role === "staff") {
            if (!bodyMemberId) {
                throw new BadRequestError('Member ID is required for admin and staff');
            }
            finalMemberId = bodyMemberId;
        } else {
            finalMemberId = userId;
        }


        // checking videos which i add from exercise did it available in database or not?
        const videoIds = exercises.map(ex => ex.video);
        const findVideo = await TrainingVideoModel.find({ _id: { $in: videoIds } });

        // checking if video is not found in database then throw error
        if (!findVideo || findVideo.length === 0) {
            throw new NotFoundError('Training video not found');
        }


        // now create training plan
        const newPlan = await TrainingPlanModel.create({
            name,
            description,
            duration,
            difficulty,
            category,
            workoutsPerWeek,
            exercises,
            createdBy: userId,
            member: finalMemberId
        });



        // Add the plan to the user's createdPlans array
        await MemberModel.findByIdAndUpdate(userId, { $push: { createdPlans: newPlan._id } });

        res.status(201).json({ success: true, plan: newPlan });
    }
    catch (error) {
        next(error)
    }
}

const showMyPlan = async (req, res, next) => {
    try {
        const userId = req.user?._id

        const myPlans = await TrainingPlanModel.find({ createdBy: userId })
            .populate('exercises', 'video reps sets rest')
            .populate('exercises.video', 'title description videoUrl thumbnail duration difficulty')
            .populate('createdBy', 'firstName lastName');
        res.status(200).json({ success: true, plans: myPlans });

    }
    catch (error) {
        next(error)
    }
}

const updateTrainingPlan = async (req, res, next) => {
    try {
        const userId = req.user?._id
        const { planId } = req.params
        const existingPlan = await TrainingPlanModel.findById(planId)
        if (!existingPlan) {
            throw new NotFoundError("Training plan not found")
        }

        const isCreator = existingPlan.createdBy?.toString() === userId.toString()
        const isMember = existingPlan.member?.toString() === userId.toString()

        if (!isCreator && !isMember) {
            throw new UnAuthorizedError("You cannot update this plan")
        }

        if (!req.body.exercises || !req.body.exercises.length) {
            throw new BadRequestError("Exercises are required")
        }

        const videoIds = req.body.exercises.map(ex => ex.video)
        const foundVideos = await TrainingVideoModel.find({
            _id: { $in: videoIds }
        })

        if (foundVideos.length !== videoIds.length) {
            throw new NotFoundError("One or more training videos not found")
        }

        const updatedPlan = await TrainingPlanModel.findByIdAndUpdate(
            planId,
            req.body,
            { new: true }
        )

        res.status(200).json({
            success: true,
            plan: updatedPlan
        })
    } catch (error) {
        next(error)
    }
}


module.exports = {
    createPlan,
    showMyPlan,
    updateTrainingPlan
}