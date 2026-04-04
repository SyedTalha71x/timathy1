// controllers/DocumentController.js
const DocumentModel = require('../../models/documents/DocumentModel');
const { StaffModel, MemberModel } = require('../../models/Discriminators');
const TagsModel = require('../../models/TagsModel');
const { uploadToCloudinary, uploadRawFile } = require('../../utils/CloudinaryUpload');
const { NotFoundError, BadRequestError } = require('../../middleware/error/httpErrors');
const cloudinary = require('../../utils/Cloudinary');
// const cloudinary = require('cloudinary').v2;

// Upload general documents
const uploadDocuments = async (req, res, next) => {
    try {
        const { entityId, entityType } = req.params;
        const { section, tagsId } = req.body;
        const userId = req.user?._id;
        const studioId = req.user?.studioId;

        const EntityModel = entityType === 'staff' ? StaffModel : MemberModel;

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

        const uploadedDocs = [];

        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const cloudinaryResult = await uploadRawFile(file.buffer, `${entityType}/documents`);

                const document = new DocumentModel({
                    url: cloudinaryResult.secure_url,
                    public_id: cloudinaryResult.public_id,
                    originalName: file.originalname,
                    displayName: file.originalname,
                    mimeType: file.mimetype,
                    size: file.size,
                    section: section || 'general',
                    tags: tagsArray,
                    uploadedBy: {
                        userId: userId,
                        userName: req.user?.username
                    }
                });

                await document.save();
                uploadedDocs.push(document._id);
            }
        }

        // Only one update operation
        const updatedEntity = await EntityModel.findByIdAndUpdate(
            entityId,
            { $push: { documents: { $each: uploadedDocs } } },
            { new: true }
        ).populate({
            path: 'documents',
            populate: { path: 'tags', model: 'Tags' }
        });

        console.log('Updated Entity with Documents:', updatedEntity);

        res.status(200).json({
            success: true,
            message: "Documents uploaded successfully",
            documents: updatedEntity.documents
        });
    } catch (err) {
        next(err);
    }
};

// Delete document
const deleteDocument = async (req, res, next) => {
    try {
        const { entityId, entityType, documentId } = req.params;

        // Log the received parameters for debugging
        console.log('Delete request params:', { entityId, entityType, documentId });

        // Validate required parameters
        if (!entityId || entityId === 'undefined') {
            return res.status(400).json({
                success: false,
                message: "Invalid entity ID: " + entityId
            });
        }

        if (!documentId || documentId === 'undefined') {
            return res.status(400).json({
                success: false,
                message: "Invalid document ID: " + documentId
            });
        }

        if (!entityType || (entityType !== 'staff' && entityType !== 'member')) {
            return res.status(400).json({
                success: false,
                message: "Invalid entity type: " + entityType
            });
        }

        const EntityModel = entityType === 'staff' ? StaffModel : MemberModel;
        const entity = await EntityModel.findById(entityId);

        if (!entity) {
            return res.status(404).json({
                success: false,
                message: `${entityType} not found with ID: ${entityId}`
            });
        }

        // Remove reference from entity
        const initialCount = entity.documents.length;
        entity.documents = entity.documents.filter(
            docId => docId.toString() !== documentId
        );

        if (entity.documents.length === initialCount) {
            console.log('Document not found in entity documents array');
        }

        await entity.save();

        // Delete document from database and Cloudinary
        const document = await DocumentModel.findById(documentId);
        if (document) {
            if (document.public_id) {
                await cloudinary.uploader.destroy(document.public_id, { resource_type: "raw" });
            }
            await DocumentModel.findByIdAndDelete(documentId);
        }

        res.status(200).json({
            success: true,
            message: "Document deleted successfully"
        });
    } catch (err) {
        console.error('Delete document error:', err);
        next(err);
    }
};
// Update document metadata
const updateDocument = async (req, res, next) => {
    try {
        const userId = req.user?._id;
        const studioId = req.user?.studio;
        const { documentId } = req.params;
        const { displayName, tagsId, section } = req.body;
        // console.log('Update request:', { documentId, displayName, tagsId, section });

        // Get studioId from authenticated user
        // console.log("studioId", studioId)
        let tagsArray = [];
        if (tagsId && tagsId.length > 0) {
            const tagsIdArray = Array.isArray(tagsId) ? tagsId : [tagsId];

            // Validate all tags exist and belong to this studio
            const validTags = await TagsModel.find({
                _id: { $in: tagsIdArray },
                studioId: studioId
            });

            if (validTags.length !== tagsIdArray.length) {
                throw new BadRequestError("One or more tag IDs are invalid or don't belong to this studio");
            }

            tagsArray = validTags.map(tag => tag._id);
        }


        // console.log('Validated tags:', tagsArray);
        const document = await DocumentModel.findById(documentId);
        if (!document) throw new NotFoundError("Document not found");

        // Update only the fields that are provided
        if (displayName) document.displayName = displayName;
        if (tagsId !== undefined) {
            document.tags = tagsArray; // allow empty []
        }
        if (section !== undefined) document.section = section;

        await document.save();

        res.status(200).json({
            success: true,
            message: "Document updated successfully",
            document
        });
    } catch (err) {
        console.error('Update document error:', err);
        next(err);
    }
};


const documentById = async (req, res, next) => {
    try {
        const { documentId } = req.params;

        const document = await DocumentModel.findById(documentId);
        if (!document) {
            return res.status(404).json({
                success: false,
                message: "Document not found"
            });
        }

        res.status(200).json({
            success: true,
            document
        });
    } catch (error) {
        next(error);
    }
}

const allDocumentByEntity = async (req, res, next) => {
    try {
        const { entityType, entityId } = req.params;
        const EntityModel = entityType === 'staff' ? StaffModel : MemberModel;

        const entity = await EntityModel.findById(entityId).populate('documents');
        if (!entity) {
            return res.status(404).json({
                success: false,
                message: `${entityType} not found`
            });
        }

        res.status(200).json({
            success: true,
            documents: entity.documents
        });
    } catch (error) {
        next(error);
    }
}


const viewDocumentById = async (req, res) => {
    try {
        const { documentId } = req.params;
        const document = await DocumentModel.findById(documentId);

        if (!document) {
            return res.status(404).json({ success: false, message: 'Document not found' });
        }

        // Just return the URL since it's now public
        res.status(200).json({
            success: true,
            url: document.url,
            name: document.displayName || document.originalName
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};
module.exports = {
    uploadDocuments,
    deleteDocument,
    updateDocument,
    documentById,
    allDocumentByEntity,
    viewDocumentById
}