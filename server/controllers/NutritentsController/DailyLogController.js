const dailyLogModel = require("../../models/nutritionModels/DailyLog")
const { NotFoundError } = require('../../middleware/error/httpErrors')
const foodModel = require('../../models/nutritionModels/Food')


const myDailySummery = async (req, res, next) => {

    try {
        const userId = req.user?._id;
        const { date } = req.query;

        const logDate = date ? new Date(date) : new Date;
        const startofDay = new Date(logDate.setHours(0, 0, 0, 0));
        const endofDay = new Date(logDate.setHours(23, 59, 59, 999));
        const mySummery = await dailyLogModel.findOne({ user: userId, date: { $gte: startofDay, $lte: endofDay } })
            .populate({
                path: "meals.breakfast.food meals.lunch.food meals.dinner.food meals.snacks.food",
                select: "name calories protien carbs fats"
            });
        return res.status(200).json({
            success: true,
            dailylog: mySummery
        })


    }
    catch (error) {
        next(error)
    }

}


module.exports = { myDailySummery }