const express = require('express');
const rateLimit = require('express-rate-limit')
const AdminRoutes = require('./AdminRoutes')
const StaffRoutes = require('./StaffRoutes');
const MemberRoutes = require('./MemberRoutes');
const AppointmentRoutes = require('./AppointmentRoutes');
const LeadRoutes = require('./LeadRoutes');

const StudioRoutes = require('./StudioRoutes');
const ServiceRoutes = require('./ServiceRoutes');

const ContractRoutes = require('./ContractRoutes');
const ChatRoutes = require('./ChatRoutes');
const MessageRoutes = require('./MessageRoutes');
const IdlePeriodRoutes = require('./IdlePeriodRoutes');
const NotificationRoutes = require('./NotificationRoutes');
const EmailRoutes = require('./EmailRoutes');
const AuthRoutes = require('./AuthRoutes');


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
router.use('/lead', LeadRoutes)

router.use('/studio', StudioRoutes)
router.use('/service', ServiceRoutes)

router.use('/contract', ContractRoutes)
router.use('/chat', ChatRoutes)
router.use('/message', MessageRoutes)

router.use('/vacation', IdlePeriodRoutes)
router.use('/notification', NotificationRoutes)
router.use('/email', EmailRoutes)


module.exports = router