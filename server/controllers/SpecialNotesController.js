const SpecialNotesModel = require('../models/SpecialNotesModel')
const { BadRequestError, NotFoundError } = require('../middleware/error/httpErrors');
const LeadModel = require('../models/LeadModel');


const createSpecialNotes = async (req, res, next) => {
    try {
        const userId = req.user?._id
        const { status, note, isImportant, valid, leadId } = req.body;

        const specialNote = await SpecialNotesModel.create({
            status,
            note,
            isImportant,
            valid,
            leadId: leadId
        })
        await LeadModel.findByIdAndUpdate(leadId, {
            $addToSet: { specialsNotes: note._id }
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

        let notes;

        if (id === "all") {
            // fetch all notes
            notes = await SpecialNotesModel.find();
        } else {
            // validate ObjectId first
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ success: false, message: "Invalid ID" });
            }

            // fetch notes for lead or member
            notes = await SpecialNotesModel.find({
                $or: [{ memberId: id }, { leadId: id }],
            });
        }

        if (!notes || notes.length === 0)
            return res.status(404).json({ success: false, message: "No special notes found" });

        return res.status(200).json({ success: true, notes });
    } catch (error) {
        next(error);
    }
};


const fetchAll = async (req, res, next) => {
    try {
        const userId = req.user?._id;
        const notes = await SpecialNotesModel.find()

        return res.status(200).json({
            success: true,
            notes: notes
        })
    } catch (error) {
        next(error)
    }
}


module.exports = { createSpecialNotes, specialNotesByIdz, fetchAll }
