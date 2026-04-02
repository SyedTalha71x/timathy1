const ServiceModel = require('../models/ServiceModel');
const { uploadService } = require('../utils/CloudinaryUpload');
const { StaffModel } = require('../models/Discriminators');
const { BadRequestError, NotFoundError, UnAuthorizedError } = require('../middleware/error/httpErrors');
const StudioModel = require('../models/StudioModel');
const UserModel = require('../models/UserModel');
const { AppointmentCategoryModel } = require('../models/AppointmentModel')
const createService = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    const studioId = req.user?.studio;
    // console.log("REQ.USER:", req.user);
    // console.log("REQ.USER.STUDIOS:", req.user?.studios);
    const { name, description, duration, contingentUsage, maxSimultaneous, category, price, interval, calenderColor } = req.body;

    // if (!trainerId) throw new NotFoundError("Invalid Trainer Id")

    // const trainer = await UserModel.findById(trainerId)
    // if (!trainer) throw new NotFoundError("Invalid Trainer")

    if (!studioId) {
      throw new UnAuthorizedError("You are not assigned to any studio");
    }

    const studio = await StudioModel.findOne({
      _id: studioId,
      createdBy: userId,
    });

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
      slot,
      calenderColor,
      image: {
        url: cloudinaryResult.secure_url,
        public_id: cloudinaryResult.public_id,
      },
      createdBy: userId
    });

    // console.log("USer", userId)
    // console.log("body", req.body)

    await StudioModel.findByIdAndUpdate(studioId, { $push: { services: service._id } }, { new: true });


    return res.status(201).json({
      success: true,
      message: 'Service created successfully',
      service: service
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
    const studioId = req.user?.studio;
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

// const studioServices = async (req, res, next) => {
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


const updateService = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    const { id } = req.params;

    const { name, description, duration, contingentUsage, maxSimultaneous, category, price, interval, calenderColor } = req.body;

    const updateData = { name, description, duration, contingentUsage, maxSimultaneous, category, price, interval, calenderColor }

    if (req.file) {
      const imageData = await uploadService(req.file.buffer);

      updateData.image = {
        url: imageData.secure_url,
        public_id: imageData.public_id
      }
    }
    const service = await ServiceModel.findByIdAndUpdate(id, updateData, { new: true })

    return res.status(200).json({
      success: true,
      service: service
    })

  }
  catch (error) {
    next(error)
  }
}





// ********
// CREATE CATEGORY CONTROLLER
// ********

// *** create Categories ***

const createCategory = async (req, res, next) => {
  try {
    const studioId = req.user?.studio;

    const { category, description } = req.body;

    const newCategory = await AppointmentCategoryModel.create({
      categoryName: category,
      description,
      studio: studioId
    });
    res.status(201).json({
      success: true,
      category: newCategory
    });

  }
  catch (error) {
    next(error);
  }
}


// *** get all Categories ***
const getAllCategories = async (req, res, next) => {
  try {
    const studioId = req.user?.studio;

    const categories = await AppointmentCategoryModel.find({ studio: studioId });
    res.status(200).json({
      success: true,
      categories: categories
    });

  }
  catch (error) {
    next(error);
  }
}

// *** update category ***

const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params

    const { category } = req.body;

    const categoryToUpdate = await AppointmentCategoryModel.findById(id);
    if (!categoryToUpdate) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    const updateCategory = await AppointmentCategoryModel.findByIdAndUpdate(id, { categoryName: category }, { new: true });

    res.status(200).json({
      success: true,
      category: updateCategory
    });
  }
  catch (error) {
    next(error)
  }
}


// *** Delete Category ***

const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params

    const categoryToDelete = await AppointmentCategoryModel.findById(id);
    if (!categoryToDelete) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    await AppointmentCategoryModel.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Category deleted successfully"
    });
  }
  catch (error) {
    next(error)
  }
}

module.exports = {
  createService,
  deleteService,
  getAllServices,
  getServiceById,
  //   studioServices,
  updateService,
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory
};
