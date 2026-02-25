const StudioModel = require('../models/StudioModel');
const { MemberModel, AdminModel, StaffModel } = require('../models/Discriminators');
const { NotFoundError, UnAuthorizedError, ConflictError } = require('../middleware/error/httpErrors')
const cloudinary = require('../utils/Cloudinary')
const { Readable } = require('stream');
const UserModel = require('../models/UserModel');




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
      userIdz
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

    if (userIdz) {
      const member = await UserModel.findById(userIdz);
      if (!member) throw new NotFoundError("Member not found");

      updateObj.$addToSet = { users: member._id };

      await MemberModel.findByIdAndUpdate(
        userIdz,
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
      .findOne({ users: userId })
      .populate("users", "firstName lastName email phone role");

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
    if (req.user.role !== "admin") {
      throw new UnAuthorizedError("Not authorized");
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
      openingHours,
      closingDays,
      overallCapacity,
      court,
      registrationNumber,
      texId

    } = req.body;

    const existingStudio = await StudioModel.findOne({ studioName });
    if (existingStudio) {
      throw new ConflictError("Studio already exists");
    }

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
      court,
      registrationNumber,
      texId,
      createdBy: req.user?._id,
      users: []
    });

    // Add studio to admin's studios array
    await AdminModel.findByIdAndUpdate(
      req.user?._id,
      { $addToSet: { studios: studio._id } },
      { new: true }
    );

    res.status(201).json({
      success: true,
      message: "Studio created successfully",
      studio
    });

  } catch (error) {
    next(error);
  }
};


const deleteStudioById = async (req, res, next) => {
  try {
    const userId = req.user?._id;

    const { studioId } = req.params;

    const studio = await StudioModel.findById(studioId);

    if (studio.createdBy?.toString() !== userId.toString()) throw new UnAuthorizedError("You Cannot delete studio");

    await StudioModel.findByIdAndDelete(studioId);

    return res.status(200).json({
      success: true,
      message: "Deleted Successfully"
    })
  }
  catch (error) {
    next(error)
  }
}

module.exports = {
  updateStudio,
  getStudioByMemberId,
  createStudio,
  deleteStudioById
}
