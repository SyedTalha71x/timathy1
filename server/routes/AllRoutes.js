const express = require('express');
const rateLimit = require('express-rate-limit')
const AdminRoutes = require('./AdminRoutes')
const StaffRoutes = require('./StaffRoutes');
const MemberRoutes = require('./MemberRoutes');
const AppointmentRoutes = require('./AppointmentRoutes');
const TrainingVideoUploadRoutes = require('./TrainingVideoUploadRoutes');
const TrainingPlanRoutes = require('./TrainingPlanRoutes');
const StudioRoutes = require('./StudioRoutes');
const ServiceRoutes = require('./ServiceRoutes');
const DailyIntakeRoutes = require('./nutrition/DailyIntakeRoutes')
const NotificationRoutes = require('./NotificationRoutes');
const EmailRoutes = require('./EmailRoutes');
const AuthRoutes = require('./AuthRoutes');
const FoodRoutes = require('./nutrition/FoodRoutes')
const UserGoalRoutes = require('./nutrition/UserGoalRoutes')
const ReminderRoutes = require('./ReminderRoutes')

const router = express.Router();

const strictLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 5,
    message: { error: "Too many attempts, try again later." },
    standardHeaders: true, // send rate limit info in headers
    legacyHeaders: false,
});

const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    message: { error: "Too many requests, slow down." },
    standardHeaders: true,
    legacyHeaders: false,
});







router.use('/', AdminRoutes)
router.use('/auth', AuthRoutes)
router.use('/staff', StaffRoutes)
router.use('/member', MemberRoutes)
router.use('/appointment', AppointmentRoutes)
// nurition all api
router.use('/daily', DailyIntakeRoutes)
router.use('/food', FoodRoutes)
router.use('/goal', UserGoalRoutes)

router.use('/studio', StudioRoutes)
router.use('/service', ServiceRoutes)
router.use('/training', TrainingVideoUploadRoutes)
router.use('/plan', TrainingPlanRoutes)



router.use('/reminder', ReminderRoutes)
router.use('/notification', NotificationRoutes)
router.use('/email', EmailRoutes)


module.exports = router