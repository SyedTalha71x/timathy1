const foodModel = require('../../models/nutritionModels/Food');
const { NotFoundError, BadRequestError } = require("../../middleware/error/httpErrors")
const axios = require('axios')
const dailyLogModel = require('../../models/nutritionModels/DailyLog');
const { MemberModel } = require('../../models/Discriminators');

// to daliy log
const addFoodById = async (req, res) => {
    try {
        const userId = req.user?._id;
        const { date, mealType, foodId, quantity, unit, notes } = req.body;

        if (!date || !mealType || !foodId) {
            return res.status(400).json({
                message: "Date, mealType and foodId are required",
            });
        }

        const logDate = new Date(date);
        logDate.setHours(0, 0, 0, 0);

        const food = await foodModel.findById(foodId);
        if (!food) {
            return res.status(404).json({ message: "Food not found" });
        }

        let dailyLog = await dailyLogModel.findOne({
            user: userId,
            date: logDate,
        });

        let isNewLog = false;

        if (!dailyLog) {
            dailyLog = await dailyLogModel.create({
                user: userId,
                date: logDate,
                meals: {
                    breakfast: [],
                    lunch: [],
                    dinner: [],
                    snacks: [],
                },
            });

            isNewLog = true;
        }

        const allowedMeals = ["breakfast", "lunch", "dinner", "snacks"];
        if (!allowedMeals.includes(mealType)) {
            return res.status(400).json({ message: "Invalid meal type" });
        }

        const mealItem = {
            food: food._id,
            quantity: quantity || 1,
            unit: unit || "",
            notes: notes || "",
        };

        // ✅ correct object
        dailyLog.meals[mealType].push(mealItem);
        await dailyLog.save();

        // ✅ avoid duplicate dailyLog IDs
        if (isNewLog) {
            await MemberModel.findByIdAndUpdate(userId, {
                $addToSet: { dailyLogs: dailyLog._id },
            });
        }

        return res.status(200).json({
            message: "Food added successfully",
            dailyLog: dailyLog,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};


const getFoodByBarcode = async (req, res, next) => {
    try {
        const { code } = req.params;
        let food = await foodModel.findOne({ barcode: code })
        if (food) {
            return res.status(200).json(food);
        }
        const response = await axios.get(`https://world.openfoodfacts.org/api/v0/product/${code}.json`);

        if (!response.data || response.data.status === 0) throw new NotFoundError("Product not found")
        const product = response.data.product;

        const newFood = new foodModel({
            name: product.product_name || "Unknown Product",
            calories: product.nutriments?.["energy-kcal_100g"] || 0,
            protein: product.nutriments?.protein_100g || 0,
            carbs: product.nutriments?.carbohydrates_100g || 0,
            fats: product.nutriments?.fat_100g || 0,
            servingSize: "100",
            serving: "100g",
            barcode: code
        })
        await newFood.save();

        return res.json({ success: true, food: newFood });
    } catch (error) {
        next(error)
    }
}

// getFood

const getFood = async (req, res, next) => {
    try {
        const food = await foodModel.find().sort({ createdAt: -1 })
        if (!food) throw NotFoundError("No Food Available")
        return res.status(200).json({
            success: true,
            food: food
        })
    } catch (error) {
        next(error)
    }
}


module.exports = {
    addFoodById,
    getFood,
    getFoodByBarcode
}