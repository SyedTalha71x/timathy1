// const bulletinModel = require('../models/BulletinModel')



// const createPost = async (req, res, next) => {
//     try {
//         const userId = req.user?._id;
//         const role = req.user?.role

//         if (role !== 'staff') throw new UnAuthorizedError('You are not authorized To create Post')

//         const { title, content, schedule, scheduleTime, scheduleDate, scheduleEndTime, postType, status } = req.body;
//     }
//     catch (error) {
//         next(error)
//     }
// }