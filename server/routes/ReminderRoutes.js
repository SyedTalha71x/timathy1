const express = require("express");
const router = express.Router();
const { getMemberReminders, updateMemberReminder } = require("../controllers/AppointmentReminderController");
const { verifyAccessToken } = require("../middleware/verifyToken"); // JWT middleware

// ensures req.user is set

router.get("/myReminder", verifyAccessToken, getMemberReminders);
router.put("/:appointmentId", verifyAccessToken, updateMemberReminder);

module.exports = router;