// models/documents/MedicalHistoryResponse.js
const mongoose = require("mongoose");

const MedicalHistoryResponseSchema = new mongoose.Schema(
    {
        // Reference to the form template
        formTemplateId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "MedicalHistoryForm",
            required: true
        },
        
        // Reference to the entity (staff or member)
        entityType: {
            type: String,
            enum: ['staff', 'member'],
            required: true
        },
        entityId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            refPath: 'entityType'
        },
        
        // Entity display name
        entityName: {
            type: String,
            required: true
        },
        
        // Form title (copied from template at creation time)
        title: {
            type: String,
            required: true
        },
        
        // Answers to the form
        answers: {
            type: mongoose.Schema.Types.Mixed,
            default: {}
        },
        
        // Signature data
        signature: {
            type: String,
            required: true
        },
        
        signatureDate: {
            type: Date,
            default: Date.now
        },
        
        signatureLocation: {
            type: String,
            default: ""
        },
        
        // Status
        status: {
            type: String,
            enum: ['draft', 'completed', 'archived'],
            default: 'completed'
        },
        
        isActive: {
            type: Boolean,
            default: true
        },
        
        // Who created this response
        createdBy: {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            userName: String
        }
    },
    { timestamps: true }
);

// Index for faster queries
MedicalHistoryResponseSchema.index({ entityType: 1, entityId: 1 });
MedicalHistoryResponseSchema.index({ formTemplateId: 1 });
MedicalHistoryResponseSchema.index({ createdAt: -1 });

const MedicalHistoryResponse = mongoose.model("MedicalHistoryResponse", MedicalHistoryResponseSchema);
module.exports = MedicalHistoryResponse;