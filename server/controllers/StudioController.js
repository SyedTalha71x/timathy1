const StudioModel = require('../models/StudioModel');
const { MemberModel, AdminModel, StaffModel } = require('../models/Discriminators');
const { NotFoundError, UnAuthorizedError, ConflictError } = require('../middleware/error/httpErrors')
const cloudinary = require('../utils/Cloudinary')
const { Readable } = require('stream');
const UserModel = require('../models/UserModel');
const { uploadToCloudinary } = require('../utils/CloudinaryUpload');




const updateStudio = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    const studioId = req.user?.studio;
 
    const findStudio = await StudioModel.findById(studioId);
    if (!findStudio) throw new NotFoundError("Studio not found");

    const updateData = { ...req.body };

    if (req.file) {
      const imageData = await uploadToCloudinary(req.file.buffer)
      updateData.img = {
        url: imageData.secure_url,
        public_id: imageData.public_id
      }
    }


    const updatedStudio = await StudioModel.findByIdAndUpdate(
      studioId,
      updateData,
      { new: true, runValidators: true }
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
    // const studioId = req.user?.studio;
    const studio = await StudioModel
      .findOne({ users: userId })
      .populate("users")
      .populate('services', 'name description duration price')
      .populate('leads', 'firstName lastName email phone img')

    if (!studio) throw new NotFoundError("Studio not found");

    return res.status(200).json({
      success: true,
      studio: studio
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
