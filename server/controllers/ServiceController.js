const ServiceModel = require('../models/ServiceModel');
const { uploadService } = require('../utils/CloudinaryUpload');
const { StaffModel } = require('../models/Discriminators');
const { BadRequestError, NotFoundError, UnAuthorizedError } = require('../middleware/error/httpErrors');
const StudioModel = require('../models/StudioModel');
const UserModel = require('../models/UserModel');

const createService = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    const { name, description, duration, contingentUsage, maxSimultaneous, studioId, category, price } = req.body;

    // if (!trainerId) throw new NotFoundError("Invalid Trainer Id")

    // const trainer = await UserModel.findById(trainerId)
    // if (!trainer) throw new NotFoundError("Invalid Trainer")
    if (!studioId) throw new UnAuthorizedError("You are not assigned to any studio");
    const studio = await StudioModel.findOne({ _id: studioId, createdBy: userId })

    if (!studio) {
      throw new UnAuthorizedError("You are not allowed to add services to this studio");
    }

    if (!req.file) throw new BadRequestError('Image not uploaded');

    const cloudinaryResult = await uploadService(req.file.buffer);

    const service = await ServiceModel.create({
      studio: studioId,
      name,
      price,
      // trainer: trainerId,
      description,
      duration,
      contingentUsage,
      maxSimultaneous,
      category,
      image: {
        url: cloudinaryResult.secure_url,
        public_id: cloudinaryResult.public_id,
      },
      createdBy: userId
    });

    await StudioModel.findByIdAndUpdate(studioId, {
      $push: { services: service._id }
    })

    return res.status(201).json({
      success: true,
      message: 'Service created successfully',
      service
    });
  } catch (error) {
    next(error);
  }
};

const deleteService = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    const { serviceId } = req.params;

    const service = await ServiceModel.findById(serviceId);
    if (!service) throw new NotFoundError('Service not found');

    if (service.createdBy.toString() !== userId.toString()) {
      throw new UnAuthorizedError('You are not authorized to delete this service');
    }

    await ServiceModel.findByIdAndDelete(serviceId);

    return res.status(200).json({
      success: true,
      message: 'Service deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

const getAllServices = async (req, res, next) => {
  try {
    const studioId = req.user?.studioId;
    const services = await ServiceModel.find({ studio: studioId }).sort({ createdAt: -1 });
    if (!services.length) throw new NotFoundError('No services available');

    return res.status(200).json({
      success: true,
      services
    });
  } catch (error) {
    next(error);
  }
};

const getServiceById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const service = await ServiceModel.findById(id).populate('createdBy', 'firstName lastName role');
    if (!service) throw new NotFoundError('Service not found');

    return res.status(200).json({
      success: true,
      service
    });
  } catch (error) {
    next(error);
  }
};

// const myServices = async (req, res, next) => {
//   try {
//     const userId = req.user?._id;
//     const services = await ServiceModel.find({ : userId }).sort({ createdAt: -1 });
//     if (!services.length) throw new NotFoundError('You have not created any services');

//     return res.status(200).json({
//       success: true,
//       services
//     });
//   } catch (error) {
//     next(error);
//   }
// };

module.exports = {
  createService,
  deleteService,
  getAllServices,
  getServiceById,
  //   myServices
};
