const foodModel = require('../../models/nutritionModels/Food');
const { NotFoundError, BadRequestError } = require("../../middleware/error/httpErrors")
const axios = require('axios')

// create Food by Studio
const createFood = async (req, res, next) => {
    try {
        const {
            name,
            serving,
            servingSize,
            calories,
            protein,
            carbs,
            fats
        } = req.body


        const food = await foodModel.create({
            name,
            serving,
            servingSize,
            protein,
            calories,
            fats,
            carbs
        })

        return res.status(200).json({
            success: true,
            food: food
        })
    }
    catch (error) {
        next(error)
    }
}


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
    createFood,
    getFood,
    getFoodByBarcode
}