const { pauseReasonModel, renewReasonModel, bonusReasonModel, changeReasonModel } = require('../../models/contract/ContractReasonModel')
const { BadRequestError } = require('../../middleware/error/httpErrors')


// *******
//  ALL PAUSE REASONS CONTROLLERS
// ************


// CREATE PAUSE REASON
const createPauseReason = async (req, res, next) => {
    try {
        const { name, maxDuration } = req.body;

        const studioId = req.user?.studio

        const pause = await pauseReasonModel.create({
            reasonName: name,
            maxDuration,
            studioId: studioId
        })
        return res.status(200).json({
            success: true,
            reason: pause
        })
    }
    catch (error) {
        next(error)
    }
}

// UPDATE PAUSE REASON
const updatePauseReason = async (req, res, next) => {
    try {
        const { pauseId } = req.params;
        const { name, maxDuration } = req.body;

        const findId = await pauseReasonModel.findById(pauseId);
        if (!findId) throw new BadRequestError('Invalid Id')

        const updatedPause = await pauseReasonModel.findByIdAndUpdate(pauseId, {
            reasonName: name,
            maxDuration,

        }, { new: true })
        return res.status(200).json({
            success: true,
            reason: updatedPause
        })
    }
    catch (error) {
        next(error)
    }
}

// DELETE PAUSE REASON

const deletePauseReason = async (req, res, next) => {
    try {
        const { pauseId } = req.params;

        const find = await pauseReasonModel.findById(pauseId)
        if (!find) throw BadRequestError("Invalid ID")
        await pauseReasonModel.findByIdAndDelete(pauseId)

        return res.status(200).json({
            success: true,
            message: "Deleted Successfully"
        })
    }
    catch (error) {
        next(error)
    }
}

// GET ALL PAUSE REASONS
const getAllPauseReason = async (req, res, next) => {
    try {
        const studioId = req.user?.studio

        const reasons = await pauseReasonModel.find({ studioId: studioId })

        if (reasons.length === 0) {
            return res.status(200).json({
                success: true,
                reasons: []
            })
        }
        return res.status(200).json({
            success: true,
            reasons: reasons
        })

    }
    catch (error) {
        next(error)
    }
}

// *******
//  ALL CHANGE REASONS CONTROLLERS
// ************

const createChangeReason = async (req, res, next) => {
    try {
        const { name } = req.body;

        const studioId = req.user?.studio

        const change = await changeReasonModel.create({
            reasonName: name,
            studioId: studioId
        })
        return res.status(200).json({
            success: true,
            reason: change
        })
    }
    catch (error) {
        next(error)
    }
}
const updateChangeReason = async (req, res, next) => {
    try {
        const { changeId } = req.params;
        const { name } = req.body;

        const findId = await changeReasonModel.findById(changeId);
        if (!findId) throw new BadRequestError('Invalid Id')

        const updatedChange = await changeReasonModel.findByIdAndUpdate(changeId, {
            reasonName: name,

        }, { new: true })
        return res.status(200).json({
            success: true,
            reason: updatedChange
        })
    }
    catch (error) {
        next(error)
    }
}

const deleteChangeReason = async (req, res, next) => {
    try {
        const { changeId } = req.params;

        const find = await changeReasonModel.findById(changeId)
        if (!find) throw BadRequestError("Invalid ID")
        await changeReasonModel.findByIdAndDelete(changeId)

        return res.status(200).json({
            success: true,
            message: "Deleted Successfully"
        })
    }
    catch (error) {
        next(error)
    }
}


const getAllChangeReason = async (req, res, next) => {
    try {
        const studioId = req.user?.studio

        const reasons = await changeReasonModel.find({ studioId: studioId })

        if (reasons.length === 0) {
            return res.status(200).json({
                success: true,
                reasons: []
            })
        }
        return res.status(200).json({
            success: true,
            reasons: reasons
        })

    }
    catch (error) {
        next(error)
    }
}

// *******
//  ALL RENEW REASONS CONTROLLERS
// ************

const createRenewReason = async (req, res, next) => {
    try {
        const { name } = req.body;

        const studioId = req.user?.studio

        const renew = await renewReasonModel.create({
            reasonName: name,
            studioId: studioId
        })
        return res.status(200).json({
            success: true,
            reason: renew
        })
    }
    catch (error) {
        next(error)
    }
}
const updateRenewReason = async (req, res, next) => {
    try {
        const { renewId } = req.params;
        const { name } = req.body;

        const findId = await renewReasonModel.findById(renewId);
        if (!findId) throw new BadRequestError('Invalid Id')

        const updatedRenew = await renewReasonModel.findByIdAndUpdate(renewId, {
            reasonName: name,

        }, { new: true })
        return res.status(200).json({
            success: true,
            reason: updatedRenew
        })
    }
    catch (error) {
        next(error)
    }
}

const deleteRenewReason = async (req, res, next) => {
    try {
        const { renewId } = req.params;

        const find = await renewReasonModel.findById(renewId)
        if (!find) throw BadRequestError("Invalid ID")
        await renewReasonModel.findByIdAndDelete(renewId)

        return res.status(200).json({
            success: true,
            message: "Deleted Successfully"
        })
    }
    catch (error) {
        next(error)
    }
}


const getAllRenewReason = async (req, res, next) => {
    try {
        const studioId = req.user?.studio

        const reasons = await renewReasonModel.find({ studioId: studioId })

        if (reasons.length === 0) {
            return res.status(200).json({
                success: true,
                reasons: []
            })
        }
        return res.status(200).json({
            success: true,
            reasons: reasons
        })

    }
    catch (error) {
        next(error)
    }
}
// *******
//  ALL BONUS REASONS CONTROLLERS
// ************

const createBonusReason = async (req, res, next) => {
    try {
        const { name } = req.body;

        const studioId = req.user?.studio

        const bonus = await bonusReasonModel.create({
            reasonName: name,
            studioId: studioId
        })
        return res.status(200).json({
            success: true,
            reason: bonus
        })
    }
    catch (error) {
        next(error)
    }
}
const updateBonusReason = async (req, res, next) => {
    try {
        const { bonusId } = req.params;
        const { name } = req.body;

        const findId = await bonusReasonModel.findById(bonusId);
        if (!findId) throw new BadRequestError('Invalid Id')

        const updatedBonus = await bonusReasonModel.findByIdAndUpdate(bonusId, {
            reasonName: name,

        }, { new: true })
        return res.status(200).json({
            success: true,
            reason: updatedBonus
        })
    }
    catch (error) {
        next(error)
    }
}

const deleteBonusReason = async (req, res, next) => {
    try {
        const { bonusId } = req.params;

        const find = await bonusReasonModel.findById(bonusId)
        if (!find) throw BadRequestError("Invalid ID")
        await bonusReasonModel.findByIdAndDelete(bonusId)

        return res.status(200).json({
            success: true,
            message: "Deleted Successfully"
        })
    }
    catch (error) {
        next(error)
    }
}


const getAllBonusReason = async (req, res, next) => {
    try {
        const studioId = req.user?.studio

        const reasons = await bonusReasonModel.find({ studioId: studioId })

        if (reasons.length === 0) {
            return res.status(200).json({
                success: true,
                reasons: []
            })
        }
        return res.status(200).json({
            success: true,
            reasons: reasons
        })

    }
    catch (error) {
        next(error)
    }
}


// &&&&&&&&&&&&&&
// Contract Form Types
// &&&&&&&&&&&&&&&&&&&&&



module.exports = {
    // pause Reason
    createPauseReason,
    updatePauseReason,
    deletePauseReason,
    getAllPauseReason,

    // renew Reason
    createRenewReason,
    updateRenewReason,
    deleteRenewReason,
    getAllRenewReason,

    // bonus Reason
    createBonusReason,
    updateBonusReason,
    deleteBonusReason,
    getAllBonusReason,

    // change Reason
    createChangeReason,
    updateChangeReason,
    deleteChangeReason,
    getAllChangeReason,


    // Contract Forms Types
}