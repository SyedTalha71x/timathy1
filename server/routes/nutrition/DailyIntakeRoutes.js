const express = require("express");
const router = express.Router();
const { getDailyIntake } = require("../../controllers/NutritentsController/DailyIntakeController");
const { verifyAccessToken } = require("../../middleware/verifyToken")
// Example: GET /api/daily-intake/:userId?date=2026-02-20
router.get("/dailyIntake", verifyAccessToken, async (req, res) => {
    try {
        const userId = req.user?._id;
        const date = req.query.date || new Date(); // default to today
        const result = await getDailyIntake(userId, date);
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong" });
    }
});

module.exports = router;
