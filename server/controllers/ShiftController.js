const shiftModel = require('../models/ShiftModel')
const { StaffModel } = require('../models/Discriminators')
const { NotFoundError, UnAuthorizedError } = require('../middleware/error/httpErrors')



const createShift = async (req, res, next) => {
    try {
        const userId = req.user?._id;
        const studioId = req.user?.studio
        const { startDate, endDate, type, startTime, endTime, notes, staffId } = req.body


        const findStaff = await StaffModel.findById(staffId)
        if (!findStaff) throw new NotFoundError('Invalid Staff Id')

        const shift = await shiftModel.create({
            startDate,
            endDate,
            type,
            startTime, endTime,
            staff: staffId,
            notes,
            createdBy: userId,
            studio: studioId
        })

        await StaffModel.findByIdAndUpdate(staffId, {
            $push: { shifts: shift._id }
        },
            { new: true })
        return res.status(201).json({
            success: true,
            shift: shift
        })


    }
    catch (error) {
        next(error)
    }
}


const getShifts = async (req, res, next) => {
    try {
        const studioId = req.user?.studio;
        const shift = await shiftModel.find({ studio: studioId })
            .populate('staff', 'firstName lastName img')
        if (shift.length === 0) throw new NotFoundError("staff shift doesn't found ")
        return res.status(200).json({
            success: true,
            shift: shift
        })
    }
    catch (error) {
        next(error)
    }
}
const updateShift = async (req, res, next) => {
    try {
        const userId = req.user?._id;
        const role = req.user?.role
        const { id } = req.params
        const { startDate, endDate, type, startTime, endTime, notes, staffId } = req.body

        const updateData = { startDate, endDate, type, startTime, endTime, notes, staffId }

        const shift = await shiftModel.findById(id)
        if (!shift) throw new BadRequestError('Invalid shift Id')
        const updatedShift = await shiftModel.findByIdAndUpdate(id, updateData, { new: true })
        return res.status(200).json({
            success: true,
            shift: updatedShift
        })

    }
    catch (error) {
        next(error)
    }
}
const deleteShift = async (req, res, next) => {
    try {
        const userId = req.user?._id;
        const role = req.user?.role
        const { id } = req.params

        const shift = await shiftModel.findById(id)
        if (!shift) throw new BadRequestError('Invalid shift Id')
        if (shift.userId?.role === 'staff' || shift.userId?.role === 'admin') {
            await shiftModel.findByIdAndDelete(id)
        } else {
            throw new UnAuthorizedError("You cannot delete this shift")
        }
        return res.status(200).json({
            success: true,
            message: "shift Deleted"
        })
    }
    catch (error) {
        next(error)
    }
}


const checkedInShift = async (req, res, next) => {
    const userId = req.user?._id;
    const { id } = req.params
    const shift = await shiftModel.findByIdAndUpdate(id, {
        checkedIn: true,
    }, { new: true })

    return res.status(200).json({
        success: true,
        shift: shift
    })
}


module.exports = {
    createShift,
    updateShift,
    deleteShift,
    getShifts,
    checkedInShift
}