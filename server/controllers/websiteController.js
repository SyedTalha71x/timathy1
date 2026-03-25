const { ConflictError, UnAuthorizedError } = require('../middleware/error/httpErrors');
const websiteModel = require('../models/websiteModel')




const createWebsite = async (req, res, next) => {
    try {
        const userId = req.user?._id;
        const studioId = req.user?.studio;


        const { title, url } = req.body

        const website = await websiteModel.findOne({ url: url.trim() })
        if (website) throw new ConflictError("Website url conflict ")

        const newWebsite = await websiteModel.create({
            title,
            url,
            studio: studioId,
            createdBy: userId
        })

        return res.status(201).json({
            success: true,
            website: newWebsite
        })


    }
    catch (error) {
        next(error)
    }
}


// delete website

const getWebsites = async (req, res, next) => {
    try {
        const userId = req.user?._id
        const studioId = req.user?.studio

        const website = await websiteModel.find({ studio: studioId })
        if (website.length === 0) {
            return res.status(400).json({
                success: false,
                website: []
            })
        }
        return res.status(200).json({
            success: true,
            website: website
        })


    }
    catch (error) {
        next(error)
    }
}


// update website
const updateWebsite = async (req, res, next) => {
    try {
        const userId = req.user?._id;
        const { id } = req.params;

        const {
            title,
            url
        } = req.body

        const updateData = { title, url }

        const website = await websiteModel.findById(id)
        if (website.createdBy.toString() !== userId.toString()) {
            throw new UnAuthorizedError('You are not authorized to edit this link')
        }

        const updated = await websiteModel.findByIdAndUpdate(id, updateData, { new: true })
        return res.status(200).json({
            success: true,
            website: updated
        })


    } catch (error) {
        next(error)
    }
}
// delete website
const deleteWebsite = async (req, res, next) => {
    try {
        const userId = req.user?._id;
        const role = req.user?.role
        const { id } = req.params
        const website = await websiteModel.findById(id)
        if (website.createdBy?.role !== "staff") {
            throw new UnAuthorizedError("you are not authorized to delete this link")
        }

        await websiteModel.findByIdAndDelete(id)
        return res.status(200).json({
            success: true,
            message: "Deleted successfully"
        })
    } catch (error) {
        next(error)
    }
}


module.exports = {
    createWebsite,
    updateWebsite,
    deleteWebsite,
    getWebsites
}