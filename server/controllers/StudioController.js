const StudioModel = require('../models/StudioModel');
const { MemberModel, AdminModel } = require('../models/Discriminators');
const { NotFoundError, UnAuthorizedError, ConflictError } = require('../middleware/error/httpErrors')
const cloudinary = require('../utils/Cloudinary')
const { Readable } = require('stream')




const updateStudio = async (req, res, next) => {
  try {
    const { id } = req.params;
    const role = req.user?.role;

    if (role !== "admin") {
      throw new UnAuthorizedError("You are not authorized to update this studio");
    }

    const findStudio = await StudioModel.findById(id);
    if (!findStudio) throw new NotFoundError("Studio not found");

    const {
      studioName,
      studioOwner,
      email,
      phone,
      street,
      zipCode,
      city,
      country,
      website,
      openingHours,
      closingDays,
      overallCapacity,
      memberId
    } = req.body;

    const updateData = {
      studioName,
      studioOwner,
      email,
      phone,
      street,
      zipCode,
      city,
      country,
      website,
      openingHours,
      closingDays,
      overallCapacity
    };

    Object.keys(updateData).forEach(
      key => updateData[key] === undefined && delete updateData[key]
    );

    const updateObj = { $set: updateData };

    if (memberId) {
      const member = await MemberModel.findById(memberId);
      if (!member) throw new NotFoundError("Member not found");

      updateObj.$addToSet = { members: member._id };

      await MemberModel.findByIdAndUpdate(
        memberId,
        { $set: { studio: findStudio._id } },
        { new: true }
      );
    }

    const updatedStudio = await StudioModel.findByIdAndUpdate(
      id,
      updateObj,
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Studio updated successfully",
      studio: updatedStudio
    });

  } catch (error) {
    next(error);
  }
};




const getStudioByMemberId = async (req, res, next) => {
  try {
    const userId = req.user?._id;

    const studio = await StudioModel
      .findOne({ members: userId })
      .populate("members", "firstName lastName email phone role");

    if (!studio) throw new NotFoundError("Studio not found");

    return res.status(200).json({
      success: true,
      studio
    });

  } catch (error) {
    next(error);
  }
};


const createStudio = async (req, res, next) => {
  try {
    const role = req.user?.role;
    if (role !== "admin") {
      throw new UnAuthorizedError("You are not authorized to create a studio");
    }

    const {
      studioName,
      studioOwner,
      email,
      phone,
      street,
      zipCode,
      city,
      country,
      website,
      openingHours,   // array
      closingDays,    // array of { date, reason }
      overallCapacity,
      memberId
    } = req.body;

    const userId = req.user?._id;

    const existingStudio = await StudioModel.findOne({ studioName });
    if (existingStudio) {
      throw new ConflictError("Studio with this name already exists");
    }

    const member = await MemberModel.findById(memberId);
    if (!member) throw new NotFoundError("Member not found");

    const studio = await StudioModel.create({
      studioName,
      studioOwner,
      email,
      phone,
      street,
      zipCode,
      city,
      country,
      website,
      openingHours,
      closingDays,
      overallCapacity,
      createdBy: userId,
      members: [memberId]
    });

    await AdminModel.findByIdAndUpdate(
      userId,
      { $addToSet: { studio: studio._id } },
      { new: true }
    );

    await MemberModel.findByIdAndUpdate(
      memberId,
      { $set: { studio: studio._id } },
      { new: true }
    );

    return res.status(201).json({
      success: true,
      message: "Studio created successfully",
      studio
    });

  } catch (error) {
    next(error);
  }
};


module.exports = {
    updateStudio,
    getStudioByMemberId,
    createStudio
}
