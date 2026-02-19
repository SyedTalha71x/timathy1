// server/controllers/NutrientsController/DailyIntakeController.js
const dailyLogModel = require('../../models/nutritionModels/DailyLog');
const foodModel = require("../../models/nutritionModels/Food");
const UserGoals = require("../../models/nutritionModels/UserGoal");

async function getDailyIntake(userId, date) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const dailyLogs = await dailyLogModel.findOne({
        user: userId,
        date: { $gte: start, $lte: end }
    })
    .populate("meals.breakfast.food meals.lunch.food meals.dinner.food meals.snacks.food")
    .lean();

    if (!dailyLogs) return { message: "No log for this day" };

    const allMeals = [
        ...dailyLogs.meals.breakfast,
        ...dailyLogs.meals.lunch,
        ...dailyLogs.meals.dinner,
        ...dailyLogs.meals.snacks,
    ];

    const totals = allMeals.reduce((acc, item) => {
        const quantity = item.quantity || 1;
        const food = item.food;

        if (food) {
            acc.calories += food.calories * quantity;
            acc.protein += food.protein * quantity;
            acc.carbs += food.carbs * quantity;
            acc.fats += food.fats * quantity;
        }
        return acc;
    }, { calories: 0, protein: 0, carbs: 0, fats: 0 });

    const goals = await UserGoals.findOne({ user: userId }).lean();

    const progress = {
        calories: goals ? ((totals.calories / goals.calories) * 100).toFixed(1) : null,
        protein: goals ? ((totals.protein / goals.protein) * 100).toFixed(1) : null,
        carbs: goals ? ((totals.carbs / goals.carbs) * 100).toFixed(1) : null,
        fats: goals ? ((totals.fats / goals.fats) * 100).toFixed(1) : null,
    };

    return { totals, goals, progress };
}

module.exports = { getDailyIntake };
