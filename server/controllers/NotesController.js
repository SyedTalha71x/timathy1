const NotesModel = require('../models/NotesModel')
const StudioModel = require('../models/StudioModel')
const { NotFoundError, BadRequestError } = require('../middleware/error/httpErrors');
const { uploadAttachment } = require('../utils/CloudinaryUpload')
const { StaffModel } = require('../models/Discriminators')
const TagsModel = require('../models/TagsModel')

const notesOfStudio = async (req, res, next) => {
    try {
        const userId = req.user?._id;
        const studioId = req.user?.studio

        const { title, content, tagsId } = req.body;

        let attachmentData = null

        if (req.file) {
            const imageData = await uploadAttachment(req.file.buffer)
            attachmentData = {
                url: imageData.secure_url,
                public_id: imageData.public_id
            }
        }

        let tagsArray = [];
        if (tagsId) {
            const tagsIdArray = Array.isArray(tagsId) ? tagsId : [tagsId];  // Convert to array if it's a single tag ID

            // Validate all tags exist and belong to this studio
            const validTags = await TagsModel.find({
                _id: { $in: tagsIdArray },
                studioId: studioId // Ensure tags belong to this studio
            });

            if (validTags.length !== tagsIdArray.length) {
                throw new BadRequestError("One or more tag IDs are invalid or don't belong to this studio");
            }

            tagsArray = validTags.map(tag => tag._id);  // Ensure tags are ObjectId references
        }


        const notes = await NotesModel.create({
            title,
            content,
            attachment: attachmentData,
            studio: studioId,
            createdBy: userId,
            tags: tagsArray,
        })

        await StudioModel.findByIdAndUpdate(studioId, {
            $addToSet: {
                notes: notes._id
            }
        },
            { new: true })

        return res.status(201).json({
            success: true,
            notes: notes
        })


    }
    catch (error) {
        next(error)
    }
}
const notesOfUser = async (req, res, next) => {
    try {
        const userId = req.user?._id;


        const { title, content, tagsId } = req.body;

        let attachmentData = null

        if (req.file) {
            const imageData = await uploadAttachment(req.file.buffer)
            attachmentData = {
                url: imageData.secure_url,
                public_id: imageData.public_id
            }
        }

        let tagsArray = [];
        if (tagsId) {
            const tagsIdArray = Array.isArray(tagsId) ? tagsId : [tagsId];  // Convert to array if it's a single tag ID

            // Validate all tags exist and belong to this studio
            const validTags = await TagsModel.find({
                _id: { $in: tagsIdArray },
                studioId: studioId // Ensure tags belong to this studio
            });

            if (validTags.length !== tagsIdArray.length) {
                throw new BadRequestError("One or more tag IDs are invalid or don't belong to this studio");
            }

            tagsArray = validTags.map(tag => tag._id);  // Ensure tags are ObjectId references
        }
        const notes = await NotesModel.create({
            title,
            content,
            attachment: attachmentData,
            staff: userId,
            createdBy: userId,
            tags: tagsArray
        })

        await StaffModel.findByIdAndUpdate(userId, {
            $addToSet: {
                notes: note._id
            }
        },
            { new: true })

        return res.status(201).json({
            success: true,
            notes: notes
        })


    }
    catch (error) {
        next(error)
    }
}



const getNotesOfStudio = async (req, res, next) => {
    try {
        const userId = req.user?._id;
        const studioId = req.user?.studio;

        const notes = await NotesModel.find(studioId)
            .populate('tags', 'name color')
            .populate('studio', 'studioName email')
            .populate('createdBy', 'firstName lastName')

        if (notes.length < 0) throw new NotFoundError('No notes Available')


        return res.status(200).json({
            success: true,
            notes: notes
        })


    }
    catch (error) {
        next(error)
    }
}


const getNotesOfStaff = async (req, res, next) => {
    try {
        const userId = req.user?._id;

        const notes = await NotesModel.find(userId)
            .populate('tags', 'name color')
            .populate('studio', 'studioName email')
            .populate('staff', 'firstName lastName')
            .populate('createdBy', 'firstName lastName')

        if (notes.length < 0) throw new NotFoundError('No notes Available')


        return res.status(200).json({
            success: true,
            notes: notes
        })


    }
    catch (error) {
        next(error)
    }
}

const deleteNotes = async (req, res, next) => {
    try {
        const userId = req.user?._id;
        const studioId = req.user?.studio;
        const { noteId } = req.params;

        const findNote = await NotesModel.findById(noteId)

        if (!findNote) throw new NotFoundError("Invalid Note Id")

        if (findNote.createdBy?.toString() === userId.toString || findNote.studio?.toString() === studioId.toString()) {
            await NotesModel.findByIdAndDelete(noteId)
        }

        return res.status(200).json({
            success: true,
            message: "Deleted Successfully"
        })
    }
    catch (error) {
        next(error)
    }
}



const updateNotes = async (req, res, next) => {
    try {
        const userId = req.user?._id;
        const studioId = req.user?.studio
        const { noteId } = req.params;
        const updateData = { ...req.body, updatedBy: userId, updatedAt: new Date() }

        const notes = await NotesModel.findById(noteId)

        if (notes.createdBy?.toString() === userId.toString()) {
            await NotesModel.findByIdAndUpdate(noteId, updateData, { new: true })
        }

        if (!notes) throw new BadRequestError(" Something went wrong")

        return res.status(304).json({
            success: true,
            note: notes
        })


    }
    catch (error) {
        next(error)
    }
}


module.exports = {
    notesOfStudio,
    notesOfUser,
    getNotesOfStaff,
    getNotesOfStudio,
    deleteNotes,
    updateNotes
}