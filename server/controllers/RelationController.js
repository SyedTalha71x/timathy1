const RelationModel = require('../models/RelationModel')
const UserModel = require('../models/UserModel');
const { NotFoundError } = require('../middleware/error/httpErrors');
const LeadModel = require('../models/LeadModel');
const { MemberModel } = require('../models/Discriminators');



const createRelations = async (req, res, next) => {
    try {

        const { entryType, name, category, relationType, customRelation, memberId, leadId } = req.body

        let relation

        // MANUAL PERSON
        if (entryType === "manual") {

            relation = await RelationModel.create({
                entryType,
                name,
                category,
                relationType,
                customRelation
            })

        }

        // EXISTING MEMBER
        else if (entryType === "existing_member") {

            const member = await MemberModel.findById(memberId)
            if (!member) throw new BadRequestError("Invalid member id")

            relation = await RelationModel.create({
                entryType,
                name,
                memberId,
                category,
                relationType,
                customRelation
            })

            await MemberModel.findByIdAndUpdate(memberId, {
                $addToSet: { relations: relation._id }
            })

        }

        // EXISTING LEAD
        else if (entryType === "existing_lead") {

            const lead = await LeadModel.findById(leadId)
            if (!lead) throw new BadRequestError("Invalid lead id")

            relation = await RelationModel.create({
                entryType,
                name,
                leadId,
                category,
                relationType,
                customRelation
            })

            await LeadModel.findByIdAndUpdate(leadId, {
                $addToSet: { relations: relation._id }
            })

        }

        console.log('relation', relation)
        return res.status(201).json({
            success: true,
            relation: relation
        })

    } catch (error) {
        next(error)
    }
}

const AllRelationByIdz = async (req, res, next) => {
    try {

        const { id } = req.params

        const relations = await RelationModel.find({
            $or: [{ memberId: id }, { leadId: id }]
        })
            .populate({
                path: "memberId",
                select: "firstName lastName img specialNotes",
                populate: {
                    path: "specialNotes",
                    select: "status note isImportant valid"
                }
            })
            .populate({
                path: "leadId",
                select: "firstName lastName img specialNotes",
                populate: {
                    path: "specialNotes",
                    select: "status note isImportant valid"
                }
            })

        return res.status(200).json({
            success: true,
            relations
        })

    } catch (error) {
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