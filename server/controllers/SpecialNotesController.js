const SpecialNotesModel = require('../models/SpecialNotesModel')
const { BadRequestError, NotFoundError } = require('../middleware/error/httpErrors')


const createSpecialNotes = async (req, res, next) => {
    try {
        const userId = req.user?._id
        const { status, note, isImportant, valid } = req.body;

        const specialNote = await SpecialNotesModel.create({
            status,
            note,
            isImportant,
            valid
        })

        return res.status(201).json({
            success: true,
            notes: specialNote
        })



    } catch (error) {
        next(error)
    }
}

// shows special note by given id

const specialNotesByIdz = async (req, res, next) => {
    try {
        const { id } = req.params;

        const findNotes = await SpecialNotesModel.findById({ $or: [{ memberId: id }, { leadId: id }] })
        if (!findNotes) throw new NotFoundError("No special note for you")

        return res.status(200).json({
            success: true,
            notes: findNotes
        })


    } catch (error) {
        next(error)
    }
}


module.exports = { createSpecialNotes, specialNotesByIdz }
