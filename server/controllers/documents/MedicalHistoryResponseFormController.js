// controllers/MedicalHistoryResponseController.js
const MedicalHistoryResponse = require("../../models/documents/MedicalResponseFormModel");
const MedicalHistoryModel = require("../../models/documents/MedicalHistoryModel");
const { StaffModel, MemberModel } = require("../../models/Discriminators");
const TagsModel = require('../../models/TagsModel')
// Create a new medical history response (filled form)
const createResponse = async (req, res) => {
    try {
        const { entityType, entityId } = req.params;
        const { formTemplateId, answers, signature, signatureLocation, entityName } = req.body;

        // Verify form template exists
        const formTemplate = await MedicalHistoryModel.findById(formTemplateId);
        if (!formTemplate) {
            return res.status(404).json({
                success: false,
                message: "Form template not found"
            });
        }

        // Verify entity exists
        const EntityModel = entityType === 'staff' ? StaffModel : MemberModel;
        const entity = await EntityModel.findById(entityId);
        if (!entity) {
            return res.status(404).json({
                success: false,
                message: `${entityType} not found`
            });
        }

        // Create response
        const response = new MedicalHistoryResponse({
            formTemplateId: formTemplateId,
            entityType,
            entityId,
            entityName: entityName || `${entity.firstName} ${entity.lastName}`,
            title: formTemplate.title,
            answers,
            signature,
            signatureLocation: signatureLocation || "",
            signatureDate: new Date(),
            createdBy: {
                userId: req.user._id,
                userName: req.user.username || req.user.email
            }
        });

        await response.save();

        // Add reference to entity
        entity.medicalHistoryResponses = entity.medicalHistoryResponses || [];
        entity.medicalHistoryResponses.push(response._id);
        await entity.save();

        // Populate response for return
        const populatedResponse = await MedicalHistoryResponse.findById(response._id)
            .populate('formTemplateId');

        res.status(201).json({
            success: true,
            message: "Medical history response created successfully",
            data: populatedResponse
        });
    } catch (error) {
        console.error('Error creating medical history response:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get all responses for an entity (staff or member)
const getResponsesByEntity = async (req, res) => {
    try {
        const { entityType, entityId } = req.params;

        const responses = await MedicalHistoryResponse.find({
            entityType,
            entityId,
            isActive: true
        })
            .populate('formTemplateId')
            .populate('answers')

            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: responses.length,
            data: responses
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get single response by ID
const getResponseById = async (req, res) => {
    try {
        const { id } = req.params;

        const response = await MedicalHistoryResponse.findById(id)
            .populate('formTemplateId');

        if (!response) {
            return res.status(404).json({
                success: false,
                message: "Response not found"
            });
        }

        res.status(200).json({
            success: true,
            data: response
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update response
const updateResponse = async (req, res) => {
    try {
        const studioId = req.user?.studio;
        const { id } = req.params;
        const { answers, signature, signatureLocation, tagsId } = req.body;

        const response = await MedicalHistoryResponse.findById(id);
        if (!response) {
            return res.status(404).json({
                success: false,
                message: "Response not found"
            });
        }
        let tagsArray = [];
        if (tagsId) {
            const tagsIdArray = Array.isArray(tagsId) ? tagsId : [tagsId];
            const validTags = await TagsModel.find({
                _id: { $in: tagsIdArray },
                studioId: studioId
            });

            if (validTags.length !== tagsIdArray.length) {
                throw new BadRequestError("One or more tag IDs are invalid or don't belong to this studio");
            }

            tagsArray = validTags.map(tag => tag._id);
        }


        if (answers) response.answers = answers;
        if (signature) response.signature = signature;
        if (signatureLocation) response.signatureLocation = signatureLocation;
        if (tagsId) response.tags = tagsArray
        await response.save();

        res.status(200).json({
            success: true,
            message: "Response updated successfully",
            data: response
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Delete response (soft delete)
const deleteResponse = async (req, res) => {
    try {
        const { id } = req.params;

        const response = await MedicalHistoryResponse.findById(id);
        if (!response) {
            return res.status(404).json({
                success: false,
                message: "Response not found"
            });
        }

        // Soft delete
        response.isActive = false;
        await response.save();

        // Remove reference from entity
        const EntityModel = response.entityType === 'staff' ? StaffModel : MemberModel;
        await EntityModel.findByIdAndUpdate(response.entityId, {
            $pull: { medicalHistoryResponses: response._id }
        });

        res.status(200).json({
            success: true,
            message: "Response deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Generate PDF for a response
const generateResponsePDF = async (req, res) => {
    try {
        const { id } = req.params;

        const response = await MedicalHistoryResponse.findById(id)
            .populate('formTemplateId');

        if (!response) {
            return res.status(404).json({
                success: false,
                message: "Response not found"
            });
        }

        // Generate PDF logic here (using your existing generateMedicalHistoryPDF function)
        // You can reuse the generateMedicalHistoryPDF function from your frontend

        res.status(200).json({
            success: true,
            message: "PDF generation endpoint"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createResponse,
    getResponsesByEntity,
    getResponseById,
    updateResponse,
    deleteResponse,
    generateResponsePDF
};