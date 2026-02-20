const { MemberModel } = require('../../models/Discriminators');
const UserGoals = require('../../models/nutritionModels/UserGoal')



const createMyGoals = async (req, res, next) => {
    try {
        const userId = req.user?._id;
        const { calories, protein, carbs, fats } = req.body;

        const goal = await UserGoals.create({
            member: userId,
            calories, protein, carbs, fats
        });

        await MemberModel.findByIdAndUpdate(userId,
            {
                $push: { goals: goal._id }
            }, { new: true }
        )
        return res.status(201).json({
            success: true,
            goal: goal
        })
    } catch (error) {
        next(error);
    }
}


module.exports = {
    createMyGoals
}