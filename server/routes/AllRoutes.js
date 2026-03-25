const express = require('express');
const rateLimit = require('express-rate-limit')


// all routes
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
const NutritionNotificationRoutes = require('./nutrition/NutritionNotificationRoutes')
const ChatRoutes = require('./ChatRoutes');
const RelationRoutes = require('./RelationRoutes')
const SpecialNoteRoutes = require('./SpecialNoteRoutes')
const LeadRoutes = require('./LeadRoutes')
const TodoRoutes = require('./TodoRoutes')
const NotesRoutes = require('./NotesRoutes')
const MedicalHistoryRoutes = require('./MedicalHistoryRoutes')
const WebsiteRoutes = require('./WebsiteRoutes')



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

router.use('/chat', ChatRoutes)


// nurition all api
router.use('/daily', DailyIntakeRoutes)
router.use('/food', FoodRoutes)
router.use('/goal', UserGoalRoutes)

router.use('/studio', StudioRoutes)
router.use('/service', ServiceRoutes)
router.use('/training', TrainingVideoUploadRoutes)
router.use('/plan', TrainingPlanRoutes)
router.use('/nutrition/reminder', NutritionNotificationRoutes)


router.use('/reminder', ReminderRoutes)
router.use('/notification', NotificationRoutes)
router.use('/email', EmailRoutes)

router.use('/relation', RelationRoutes);
router.use('/special', SpecialNoteRoutes);
router.use('/lead', LeadRoutes);
router.use('/todos', TodoRoutes)
router.use('/notes', NotesRoutes)
router.use('/medical', MedicalHistoryRoutes)
router.use('/website', WebsiteRoutes)




module.exports = router