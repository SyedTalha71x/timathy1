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
        const studioId = req.user?.studio;

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



const getNotesOfStudio = async (req, res, next) => {
    try {
        const userId = req.user?._id;
        const studioId = req.user?.studio;

        const notes = await NotesModel.findById({ studio: studioId })
            .populate('tags', 'name color')
            .populate('studio', 'studioName email')
            .populate('createdBy', 'firstName lastName')

        if (!notes || notes.length === 0) {
            return res.status(200).json({
                success: true,
                notes: [] // Return empty array instead of throwing error
            })
        }

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

        const notes = await NotesModel.findById({ createdBy: userId })
            .populate('tags', 'name color')
            .populate('studio', 'studioName email')
            .populate('staff', 'firstName lastName')
            // .populate('createdBy', 'firstName lastName')

        if (!notes || notes.length === 0) {
            return res.status(200).json({
                success: true,
                notes: []
            })
        }

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

        if (findNote.createdBy?.toString() === userId.toString() || findNote.studio?.toString() === studioId.toString()) {
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
        const studioId = req.user?.studio;
        const { noteId } = req.params;

        const {
            title,
            content,
            tagsId,
            attachment,
            isPinned
        } = req.body;

        // Build update object with only provided fields
        const updateData = {};
        if (title !== undefined) updateData.title = title;
        if (content !== undefined) updateData.content = content;
        if (tagsId !== undefined) updateData.tags = tagsId;
        if (attachment !== undefined) updateData.attachment = attachment;
        if (isPinned !== undefined) updateData.isPinned = isPinned;

        // Handle file upload if present
        if (req.file) {
            const imageData = await uploadAttachment(req.file.buffer);
            updateData.attachment = {
                url: imageData.secure_url,
                public_id: imageData.public_id
            };
        }

        // Add metadata
        updateData.updatedBy = userId;
        updateData.updatedAt = new Date();

        // Find the note
        const note = await NotesModel.findById(noteId);

        if (!note) {
            throw new BadRequestError("Note not found");
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
        if (tagsId) {
            updateData.tagsId = tagsArray

        }


        // Check permissions: user can update if they created it OR they're in the studio
        const isCreator = note.createdBy?.toString() === userId.toString();
        const isInStudio = note.studio?.toString() === req.user?.studio?.toString();

        if (!isCreator && !isInStudio) {
            throw new BadRequestError("You don't have permission to update this note");
        }

        // Update the note
        const updatedNote = await NotesModel.findByIdAndUpdate(
            noteId,
            updateData,
            { new: true } // This returns the updated document
        );

        // Return 200 with the updated note
        return res.status(200).json({
            success: true,
            notes: updatedNote
        });

    } catch (error) {
        next(error);
    }
};


module.exports = {
    notesOfStudio,
    notesOfUser,
    getNotesOfStaff,
    getNotesOfStudio,
    deleteNotes,
    updateNotes
}