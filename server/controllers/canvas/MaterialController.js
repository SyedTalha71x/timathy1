const materialModel = require('../../models/canvas/MaterialModel')
const { BadRequestError, UnAuthorizedError } = require('../../middleware/error/httpErrors')

const createIntroduction = async (req, res, next) => {
    try {
        const userId = req.user?._id;
        const studioId = req.user?.studio;

        const { name, pages } = req.body;

        const introduction = await materialModel.create({
            id: Date.now(),
            name: name || "Untitled Material",
            pages: pages || [{ id: Date.now(), title: "Page 1", content: "" }],
            studio: studioId,
            createdBy: userId
        })

        return res.status(200).json({
            success: true,
            introduction: introduction
        })
    }
    catch (error) {
        next(error)
    }
}

// update introduction-material
const updateIntroduction = async (req, res, next) => {
    try {
        const { id } = req.params
        const userId = req.user?._id;
        const studioId = req.user?.studio;

        const { name, pages } = req.body;

        // First verify the material exists and belongs to this studio
        const material = await materialModel.findOne({ _id: id, studio: studioId })
        
        if (!material) {
            throw new BadRequestError("Material not found or access denied")
        }

        // Update the material
        const updatedIntroduction = await materialModel.findByIdAndUpdate(
            id,  // Just the ID as first parameter
            {
                name: name || material.name,
                pages: pages || material.pages,
                updatedBy: userId,
                updatedAt: Date.now()
            },
            { new: true }  // Returns the updated document
        )

        return res.status(200).json({
            success: true,
            introduction: updatedIntroduction
        })
    }
    catch (error) {
        next(error)
    }
}

// delete introduction-material
const deleteIntroduction = async (req, res, next) => {
    try {
        const { id } = req.params
        const userId = req.user?._id;
        const studioId = req.user?.studio;
        const staffRole = req.user?.role;

        // Find material and verify it belongs to this studio
        const material = await materialModel.findOne({ _id: id, studio: studioId })

        if (!material) {
            throw new BadRequestError("Material not found or access denied")
        }

        // Check if user has permission to delete
        if (material.createdBy.toString() !== userId.toString() && staffRole !== 'admin') {
            throw new UnAuthorizedError(`You don't have permission to delete "${material.name}"`)
        }

        await materialModel.findByIdAndDelete(id)

        return res.status(200).json({
            success: true,
            message: `${material.name} deleted successfully`
        })
    }
    catch (error) {
        next(error)
    }
}

// get all
const getAllMaterial = async (req, res, next) => {
    try {
        const studioId = req.user?.studio;

        const materials = await materialModel.find({ studio: studioId }).sort({ order: 1, createdAt: -1 });
        
        return res.status(200).json({
            success: true,
            materials: materials
        })
    }
    catch (error) {
        next(error)
    }
}

module.exports = {
    getAllMaterial,
    createIntroduction,
    updateIntroduction,
    deleteIntroduction
}