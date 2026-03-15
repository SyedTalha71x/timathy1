const LeadModel = require('../models/LeadModel');
const StudioModel = require('../models/StudioModel');
const { NotFoundError, BadRequestError, ConflictError } = require('../middleware/error/httpErrors');
const { uploadToCloudinary } = require('../utils/CloudinaryUpload');
const {generateLeadId} = require('../utils/GenerateRandomId');

const createLead = async (req, res, next) => {
    try {
        const userId = req.user?._id;
        const studioId = req.user?.studio;

        const {
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
            trainingGoal,
            about,
            notes,
            relation,
            leadId
        } = req.body;

        console.log('Received data:', { firstName, lastName, email, column, notes }); // Debug log

        const studio = await StudioModel.findById(studioId);
        if (!studio) throw new NotFoundError("Invalid studio Id");

        // Only check email if provided
        if (email) {
            const existingLead = await LeadModel.findOne({ email });
            if (existingLead) throw new ConflictError("Email Already Registered");
        }

        const leadNumber = await generateLeadId(leadId);

        // Handle image upload if file exists
        // let imgData = {};
        // if (req.file) {
        //     const cloudinaryResult = await uploadToCloudinary(req.file.buffer);
        //     imgData = {
        //         url: cloudinaryResult.secure_url,
        //         public_id: cloudinaryResult.public_id
        //     };
        // }

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
            relations: Array.isArray(relation) ? relation.map(r => ({
                entryType: r.entryType || "manual",
                name: r.name,
                leadId: r.leadId || null,
                memberId: r.memberId || null, // Added memberId field
                category: r.category || "family",
                relationType: r.relationType || null,
                customRelation: r.customRelation || null
            })) : [],
            specialsNotes: Array.isArray(notes) ? notes.map(n => ({
                status: n.status || "general",
                note: n.note,
                isImportant: n.isImportant || false,
                valid: n.valid || null
                // Removed createdAt as it's not in schema
            })) : [],
            isConverted: false, // Default value
            studioId: studioId,
            // img: imgData,
            leadNo: leadNumber
        });

        console.log('Lead created with notes:', lead.specialsNotes); // Check if notes were saved
        console.log('Lead created with relation:', lead.relations); // Check if notes were saved

        // Add lead to studio's leads array
        await StudioModel.findByIdAndUpdate(studioId, {
            $addToSet: { leads: lead._id }
        });

        return res.status(201).json({
            success: true,
            lead: lead
        });

    } catch (error) {
        next(error);
    }
};

// update lead
const updateLeadByStaff = async (req, res, next) => {
    try {
        const userId = req.user?._id;
        const { leadId } = req.params;

        const updateData = { ...req.body };

        // If specialsNotes exists, parse it from JSON string
        if (updateData.specialsNotes) {
            try {
                updateData.specialsNotes = JSON.parse(updateData.specialsNotes);
            } catch (err) {
                return res.status(400).json({ error: "Invalid specialsNotes format" });
            }
        }

        // If relations exists, parse it from JSON string
        if (updateData.relations) {
            try {
                updateData.relations = JSON.parse(updateData.relations);
            } catch (err) {
                return res.status(400).json({ error: "Invalid relations format" });
            }
        }

        // Handle file upload
        if (req.file) {
            const cloudinaryResult = await uploadToCloudinary(req.file.buffer);
            updateData.img = {
                url: cloudinaryResult.secure_url,
                public_id: cloudinaryResult.public_id,
            };
        }

        // Check if lead exists
        const existingLead = await LeadModel.findById(leadId);
        if (!existingLead) {
            throw new NotFoundError("Lead not found");
        }

        // Update lead in DB
        const updatedLead = await LeadModel.findByIdAndUpdate(
            leadId,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        return res.status(200).json({
            success: true,
            lead: updatedLead,
        });
    } catch (error) {
        next(error);
    }
};

const allLeads = async (req, res, next) => {
    try {
        const userId = req.user?._id;
        const studioId = req.user?.studio;

        // Build query based on user role
        const query = studioId ? { studioId } : {};

        // Get leads with proper population based on schema
        const leads = await LeadModel.find(query)
            .populate({
                path: 'studioId',
                select: 'name address'
            })
            .populate({
                path: 'relations.leadId',
                select: 'firstName lastName email phone img leadNo'
            })
            .populate({
                path: 'relations.memberId',
                select: 'firstName lastName email phone img memberNo'
            })
            .populate({
                path: 'appointments',
                select: 'date time status type'
            })
            .populate({
                path: 'specialsNotes',
                select: 'status note isImportant valid',
            })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: leads.length,
            leads: leads
        });

    } catch (error) {
        next(error);
    }
};

// Get single lead by ID
const getLeadById = async (req, res, next) => {
    try {
        const { leadId } = req.params;
        const studioId = req.user?.studio;

        const lead = await LeadModel.findOne({
            _id: leadId,
            studioId: studioId // Ensure lead belongs to user's studio
        })
            .populate({
                path: 'studioId',
                select: 'name address'
            })
            .populate({
                path: 'relations.leadId',
                select: 'firstName lastName email phone img leadNo'
            })
            .populate({
                path: 'relations.memberId',
                select: 'firstName lastName email phone img memberNo'
            })
            .populate({
                path: 'appointments',
                select: 'date time status type'
            });

        if (!lead) {
            throw new NotFoundError("Lead not found");
        }

        return res.status(200).json({
            success: true,
            lead: lead
        });

    } catch (error) {
        next(error);
    }
};

// Get leads by conversion status
const getLeadsByConversionStatus = async (req, res, next) => {
    try {
        const studioId = req.user?.studio;
        const { converted } = req.params; // 'true' or 'false'

        const isConverted = converted === 'true';

        const leads = await LeadModel.find({
            studioId,
            isConverted: isConverted
        })
            .populate({
                path: 'relations.leadId',
                select: 'firstName lastName email'
            })
            .populate({
                path: 'relations.memberId',
                select: 'firstName lastName email'
            })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: leads.length,
            leads: leads
        });

    } catch (error) {
        next(error);
    }
};

// Mark lead as converted
const convertLead = async (req, res, next) => {
    try {
        const { leadId } = req.params;
        const studioId = req.user?.studio;

        const lead = await LeadModel.findOneAndUpdate(
            { _id: leadId, studioId },
            { $set: { isConverted: true } },
            { new: true }
        );

        if (!lead) {
            throw new NotFoundError("Lead not found");
        }

        return res.status(200).json({
            success: true,
            message: "Lead marked as converted successfully",
            lead: lead
        });

    } catch (error) {
        next(error);
    }
};

// Delete lead
const deleteLead = async (req, res, next) => {
    try {
        const { leadId } = req.params;
        const studioId = req.user?.studio;

        // Find and delete lead
        const lead = await LeadModel.findOneAndDelete({
            _id: leadId,
            studioId: studioId
        });

        if (!lead) {
            throw new NotFoundError("Lead not found");
        }

        // Remove lead reference from studio
        await StudioModel.findByIdAndUpdate(studioId, {
            $pull: { leads: leadId }
        });

        return res.status(200).json({
            success: true,
            message: "Lead deleted successfully"
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    createLead,
    allLeads,
    updateLeadByStaff,
    getLeadById,
    getLeadsByConversionStatus,
    convertLead,
    deleteLead
};