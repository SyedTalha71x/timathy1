const RelationModel = require('../models/RelationModel')
const UserModel = require('../models/UserModel');
const { NotFoundError } = require('../middleware/error/httpErrors');
const LeadModel = require('../models/LeadModel');
const { MemberModel } = require('../models/Discriminators');



const createRelations = async (req, res, next) => {
    try {
        const userId = req.user?._id

        const { entryType, name, category, relationType, customRelation, memberId, leadId } = req.body

        const member = await MemberModel.findById(memberId)
        if (!member) throw new BadRequestError("Invalid Id")
        const lead = await LeadModel.findById(leadId)
        if (!lead) throw new BadRequestError("Invalid Id")

        const relation = await RelationModel.create({
            entryType,
            name,
            relationType,
            category,
            customRelation,
            leadId,
            memberId,
        })

        await MemberModel.findByIdAndUpdate(memberId, {
            $addToSet: { relations: relation._id }
        })
        await LeadModel.findByIdAndUpdate(leadId, {
            $addToSet: { relations: relation._id }
        })

        return res.status(200).json({
            success: true,
            relation: relation
        })
    }
    catch (error) {
        next(error)
    }
}

const AllRelationByIdz = async (req, res, next) => {
    try {
        const { id } = req.params

        const relation = await RelationModel.find({ $or: [{ memberId: id }, { leadId: id }] })
            .populate({
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
            })
            .populate({
                path: 'leadId',
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
            })

        return res.status(200).json({
            success: true,
            relation: relation
        })
    }
    catch (error) {
        next(error)
    }
}


// allrelation show
const allRelation = async (req, res, next) => {
    try {
        const userId = req.user?._id;

        const relation = await RelationModel.find();
        return res.status(200).json({
            success: true,
            relation: relation
        })
    }
    catch (error) {
        next(error)
    }
}


module.exports = {
    createRelations,
    AllRelationByIdz,
    allRelation
}