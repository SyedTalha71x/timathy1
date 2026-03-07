const LeadModel = require('../models/LeadModel')
const RelationModel = require('../models/RelationModel')
const { NotFoundError, BadRequestError, ConflictError } = require('../middleware/error/httpErrors');
const { uploadToCloudinary } = require('../utils/CloudinaryUpload');
const generateLeadId = require('../utils/GenerateLeadId');
const StudioModel = require('../models/StudioModel');
const specialNotesModel = require('../models/SpecialNotesModel');



const createLead = async (req, res, next) => {
    try {
        const userId = req.user?._id;
        const studioId = req.user?.studio;

        const { firstName, lastName, email, phone, telephone, gender, dateOfBirth, city, street, country, zipCode, column, source, trainingGoal, about, notes, relationId, leadId } = req.body;

        const studio = await StudioModel.findById(studioId)
        if (!studio) throw new NotFoundError("Invalid studio Id")

        // const note = await SpecialNotesModel.findById(noteId)
        // if (!note) throw new NotFoundError("Invalid Note Id")

        let relation = null;
        if (relationId) {
            relation = await RelationModel.findById(relationId);
            if (!relation) throw new NotFoundError("Invalid Relation Id");
        }
        // if (!req.file) throw new BadRequestError("File not found")

        // const cloudinaryResult = await uploadToCloudinary(req.file.buffer);

        const existingLead = await LeadModel.findOne({ email })
        if (existingLead) throw new ConflictError("Email Already Registered")

        const leadNumber = await generateLeadId(leadId)

        const lead = await LeadModel.create({
            firstName,
            lastName,
            email,
            phone,
            telephone,
            gender,
            dateOfBirth,
            city,
            street,
            country,
            zipCode,
            column,
            source,
            about,
            trainingGoal,
            relations: relationId || null,
            specialsNotes: Array.isArray(notes) ? notes.map(n => ({
                status: n.status || "general",
                note: n.note,
                isImportant: n.isImportant || false,
                valid: n.valid || null,
                createdAt: new Date(),
            })) : [],
            studioId: studioId,
            // img: {
            //     url: cloudinaryResult.secure_url,
            //     public_id: cloudinaryResult.public_id
            // },
            leadNo: leadNumber
        })

        // create notes if provided



        if (relationId) {
            await RelationModel.findByIdAndUpdate(relationId, {
                $addToSet: { leadId: lead._id }
            })
        }
        // if (noteId) {
        //     await specialNotesModel.findByIdAndUpdate(noteId, {
        //         $addToSet: { leadId: lead._id }
        //     }, { new: true })
        // }

        await StudioModel.findByIdAndUpdate(studioId, {
            $addToSet: { leads: lead._id }
        })

        return res.status(201).json({
            success: true,
            lead: lead
        })


    }
    catch (error) {
        next(error)
    }
}



const allLeads = async (req, res, next) => {
    try {
        const userId = req.user?._id

        // lead with all detail properly which help to show everything on frontend
        const lead = await LeadModel.find().populate(
            {
                path: 'relations',
                select: 'name entryType memberId category relationType customRelation',
                populate: [{
                    path: 'memberId',
                    select: 'firstName lastName img specialNotes',
                    populate: [
                        {
                            path: 'specialNote',
                            select: 'status note important valid',
                            populate: [{
                                path: 'valid',
                                select: 'from until'
                            }]
                        }
                    ]
                }]
            }
        )

        return res.status(200).json({
            success: true,
            lead: lead
        })


    }
    catch (error) {
        next(error)
    }
}

module.exports = {
    createLead,
    allLeads
}