const VacationModel = require('../models/VacationModel')
const { StaffModel } = require('../models/Discriminators')
const { NotFoundError } = require('../middleware/error/httpErrors')


const sendVacationRequest = async (req, res, next) => {
    try {
        const userId = req.user?._id
        const studioId = req.user?.studio
        const { staffId, startDate, endDate, reason } = req.body;

        const staff = await StaffModel.findById(staffId)
        if (!staff) throw new NotFoundError('Invalid staff Id')

        const vacation = await VacationModel.create({
            staff: staffId,
            startDate,
            endDate,
            reason,
            studioId: studioId,
            createdAt: new Date()
        })

        await StaffModel.findByIdAndUpdate(staffId, {
            $push: { vacations: vacation._id }
        }, { new: true })
        return res.status(201).json({
            success: true,
            message: "request send Successfully",
            vacation: vacation,
        })
    } catch (error) {
        next(error)
    }
}

const approvedVacationRequest = async (req, res, next) => {
    try {
        const userId = req.user?._id;

        const { id } = req.params

        const vacation = await VacationModel.findById(id)

        const updatedVacation = await VacationModel.findByIdAndUpdate(id, {
            status: 'approved',
            isApproved: true,
            approvedBy: userId
        },
            { new: true })


        return res.status(200).json({
            success: true,
            vacation: updatedVacation
        })
    }
    catch (error) {
        next(error)
    }
}
const rejectedVacationRequest = async (req, res, next) => {
    try {
        const userId = req.user?._id;

        const { id } = req.params

        const vacation = await VacationModel.findById(id)

        const updatedVacation = await VacationModel.findByIdAndUpdate(id, {
            status: 'rejected',
            isRejected: true,
            rejectedBy: userId
        },
            { new: true })

        return res.status(200).json({
            success: true,
            vacation: updatedVacation
        })
    }
    catch (error) {
        next(error)
    }
}



const getAllVacationRequest = async (req, res, next) => {
    try {
        const userId = req.user?._id
        const studioId = req.user?.studio;


        const vacation = await VacationModel.find({ studioId: studioId })
            .populate('staff', 'firstName lastName')
            .sort({ createdAt: -1 })

        if (vacation.length === 0) {
            return res.status(404).json({
                vacation: []
            })
        }
        return res.status(200).json({
            success: true,
            vacation: vacation
        })
    }
    catch (error) {
        next(error)
    }
}

const showAllPendingRequests = async (req, res, next) => {
    try {
        const userId = req.user?._id;

        const vacation = await VacationModel.find({ status: 'pending' }).populate('staff', 'firstName lastName').populate('studioId', 'studioName')
        return res.status(200).json({
            success: true,
            vacation: vacation
        })

    }
    catch (error) {
        next(error)
    }



}

module.exports = {
    sendVacationRequest,
    getAllVacationRequest,
    approvedVacationRequest,
    rejectedVacationRequest,
    showAllPendingRequests
}