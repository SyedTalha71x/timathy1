
const { ServiceModel, vatRateModel } = require('../models/ServiceModel');
const { uploadService } = require('../utils/CloudinaryUpload');
const cloudinary = require('../utils/Cloudinary');
const { BadRequestError, NotFoundError, UnAuthorizedError } = require('../middleware/error/httpErrors');
const StudioModel = require('../models/StudioModel');
const { AppointmentCategoryModel } = require('../models/AppointmentModel');

// URL validation helper function
const validateUrl = (v) => {
  if (!v) return true;
  try {
    new URL(v);
    return true;
  } catch {
    return false;
  }
};

// ========================
// SERVICE CRUD OPERATIONS
// ========================

// Create Service
const createService = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    const studioId = req.user?.studio;

    const { name, price, contingentCredit, link, vatId } = req.body;

    if (!studioId) {
      throw new UnAuthorizedError("You are not assigned to any studio");
    }

    if (!name) throw new BadRequestError("Name is required");
    if (!price) throw new BadRequestError("Price is required");

    const studio = await StudioModel.findOne({
      _id: studioId,
      createdBy: userId,
    });

    if (!studio) throw new NotFoundError("Studio not found");

    // Make vatRate optional
    let vatRate = null;
    if (vatId) {
      vatRate = await vatRateModel.findById(vatId);
      if (!vatRate) throw new NotFoundError("Invalid VAT rate ID");
    }

    // Make image optional
    let imageData = null;
    if (req.file) {
      const cloudinaryResult = await uploadService(req.file.buffer);
      imageData = {
        url: cloudinaryResult.secure_url,
        public_id: cloudinaryResult.public_id,
      };
    }

    const serviceData = {
      studio: studioId,
      name,
      price,
      contingentCredit: contingentCredit || 0,
      createdBy: userId,
      link: link || "",
    };

    if (vatRate) serviceData.vatRate = vatId;
    if (imageData) serviceData.image = imageData;

    const service = await ServiceModel.create(serviceData);

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

// Delete Service
const deleteService = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    const { serviceId } = req.params;

    const service = await ServiceModel.findById(serviceId);
    if (!service) throw new NotFoundError('Service not found');

    // Check authorization
    if (service.createdBy.toString() !== userId.toString()) {
      throw new UnAuthorizedError('You are not authorized to delete this service');
    }

    // Delete image from cloudinary if exists
    if (service.image?.public_id) {
      await cloudinary.uploader.destroy(service.image.public_id);
    }

    // Remove from studio's services array
    await StudioModel.findByIdAndUpdate(service.studio, {
      $pull: { services: service._id }
    });

    // Delete the service
    await ServiceModel.findByIdAndDelete(serviceId);

    return res.status(200).json({
      success: true,
      message: 'Service deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Get All Services for a Studio
const getAllServices = async (req, res, next) => {
  try {
    const studioId = req.user?.studio;

    if (!studioId) {
      throw new UnAuthorizedError("You are not assigned to any studio");
    }

    const services = await ServiceModel.find({ studio: studioId })
      .populate('vatRate', 'rate description')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: services.length,
      services
    });
  } catch (error) {
    next(error);
  }
};

// Get Service by ID
const getServiceById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const studioId = req.user?.studio;

    const service = await ServiceModel.findOne({ _id: id, studio: studioId })
      .populate('createdBy', 'firstName lastName role')
      .populate('vatRate', 'rate description');

    if (!service) throw new NotFoundError('Service not found');

    return res.status(200).json({
      success: true,
      service
    });
  } catch (error) {
    next(error);
  }
};

// Update Service
const updateService = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    const studioId = req.user?.studio;
    const { id } = req.params;

    const { name, price, contingentCredit, link, vatId } = req.body;

    // Find existing service
    const existingService = await ServiceModel.findOne({ _id: id, studio: studioId });
    if (!existingService) throw new NotFoundError('Service not found');

    // Check authorization
    if (existingService.createdBy.toString() !== userId.toString()) {
      throw new UnAuthorizedError('You are not authorized to update this service');
    }

    const updateData = {};

    if (name) updateData.name = name;
    if (price !== undefined) updateData.price = price;
    if (contingentCredit !== undefined) updateData.contingentCredit = contingentCredit;
    if (link !== undefined) updateData.link = link;
    if (vatId) {
      const vatRate = await vatRateModel.findById(vatId);
      if (!vatRate) throw new NotFoundError("Invalid VAT rate ID");
      updateData.vatRate = vatId;
    }

    // Handle image upload if new file provided
    if (req.file) {
      // Delete old image if exists
      if (existingService.image?.public_id) {
        await cloudinary.uploader.destroy(existingService.image.public_id);
      }

      const imageData = await uploadService(req.file.buffer);
      updateData.image = {
        url: imageData.secure_url,
        public_id: imageData.public_id
      };
    }

    const service = await ServiceModel.findByIdAndUpdate(id, updateData, { new: true });

    return res.status(200).json({
      success: true,
      message: 'Service updated successfully',
      service: service
    });
  } catch (error) {
    next(error);
  }
};

// ========================
// CATEGORY CRUD OPERATIONS
// ========================

// Create Category
const createCategory = async (req, res, next) => {
  try {
    const studioId = req.user?.studio;
    const userId = req.user?._id;

    if (!studioId) {
      throw new UnAuthorizedError("You are not assigned to any studio");
    }

    const { category, description } = req.body;

    if (!category) {
      throw new BadRequestError("Category name is required");
    }

    // Check if category already exists for this studio
    const existingCategory = await AppointmentCategoryModel.findOne({
      studio: studioId,
      categoryName: { $regex: new RegExp(`^${category}$`, 'i') }
    });

    if (existingCategory) {
      throw new BadRequestError("Category with this name already exists");
    }

    const newCategory = await AppointmentCategoryModel.create({
      categoryName: category,
      description: description || "",
      studio: studioId,
      createdBy: userId
    });

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      category: newCategory
    });
  } catch (error) {
    next(error);
  }
};

// Get All Categories
const getAllCategories = async (req, res, next) => {
  try {
    const studioId = req.user?.studio;

    if (!studioId) {
      throw new UnAuthorizedError("You are not assigned to any studio");
    }

    const categories = await AppointmentCategoryModel.find({ studio: studioId })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: categories.length,
      categories: categories
    });
  } catch (error) {
    next(error);
  }
};

// Update Category
const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const studioId = req.user?.studio;
    const { category } = req.body;

    if (!category) {
      throw new BadRequestError("Category name is required");
    }

    const categoryToUpdate = await AppointmentCategoryModel.findOne({ _id: id, studio: studioId });

    if (!categoryToUpdate) {
      throw new NotFoundError("Category not found");
    }

    // Check for duplicate name (excluding current category)
    const existingCategory = await AppointmentCategoryModel.findOne({
      studio: studioId,
      categoryName: { $regex: new RegExp(`^${category}$`, 'i') },
      _id: { $ne: id }
    });

    if (existingCategory) {
      throw new BadRequestError("Category with this name already exists");
    }

    const updatedCategory = await AppointmentCategoryModel.findByIdAndUpdate(
      id,
      { categoryName: category },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      category: updatedCategory
    });
  } catch (error) {
    next(error);
  }
};

// Delete Category
const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const studioId = req.user?.studio;

    const categoryToDelete = await AppointmentCategoryModel.findOne({
      _id: id,
      studio: studioId
    });

    if (!categoryToDelete) {
      throw new NotFoundError("Category not found");
    }

    // Check if category is being used by any appointment type
    const { AppointmentTypeModel } = require('../models/AppointmentModel');
    const isInUse = await AppointmentTypeModel.findOne({ category: id });

    if (isInUse) {
      throw new BadRequestError("Cannot delete category - It is being used by appointment types");
    }

    await AppointmentCategoryModel.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Category deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};

// ========================
// VAT RATE CRUD OPERATIONS (Optional)
// ========================

// ========================
// VAT RATE CRUD OPERATIONS
// ========================

// Create VAT Rate
const createVatRate = async (req, res, next) => {
  try {
    const studioId = req.user?.studio;
    const userId = req.user?._id;
    const { rate, description } = req.body;

    if (!studioId) {
      throw new UnAuthorizedError("You are not assigned to any studio");
    }

    if (!rate) {
      throw new BadRequestError("VAT rate is required");
    }

    if (rate < 0 || rate > 100) {
      throw new BadRequestError("VAT rate must be between 0 and 100");
    }

    // Check if VAT rate with same percentage already exists for this studio
    const existingVatRate = await vatRateModel.findOne({
      studioId,
      rate: rate
    });

    if (existingVatRate) {
      throw new BadRequestError("VAT rate with this percentage already exists");
    }

    const vatRate = await vatRateModel.create({
      rate,
      description: description || "",
      studioId,
      createdBy: userId
    });

    return res.status(201).json({
      success: true,
      message: "VAT rate created successfully",
      vatRate
    });
  } catch (error) {
    next(error);
  }
};

// Get All VAT Rates for a Studio
const getAllVatRates = async (req, res, next) => {
  try {
    const studioId = req.user?.studio;

    if (!studioId) {
      throw new UnAuthorizedError("You are not assigned to any studio");
    }

    const vatRates = await vatRateModel.find({ studioId })
      .sort({ rate: 1 });

    return res.status(200).json({
      success: true,
      count: vatRates.length,
      vatRates
    });
  } catch (error) {
    next(error);
  }
};

// Get Single VAT Rate by ID
const getVatRateById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const studioId = req.user?.studio;

    if (!studioId) {
      throw new UnAuthorizedError("You are not assigned to any studio");
    }

    const vatRate = await vatRateModel.findOne({
      _id: id,
      studioId
    });

    if (!vatRate) {
      throw new NotFoundError("VAT rate not found");
    }

    return res.status(200).json({
      success: true,
      vatRate
    });
  } catch (error) {
    next(error);
  }
};

// Update VAT Rate
const updateVatRate = async (req, res, next) => {
  try {
    const { id } = req.params;
    const studioId = req.user?.studio;
    const { rate, description } = req.body;

    if (!studioId) {
      throw new UnAuthorizedError("You are not assigned to any studio");
    }

    const vatRate = await vatRateModel.findOne({
      _id: id,
      studioId
    });

    if (!vatRate) {
      throw new NotFoundError("VAT rate not found");
    }

    const updateData = {};

    if (rate !== undefined) {
      if (rate < 0 || rate > 100) {
        throw new BadRequestError("VAT rate must be between 0 and 100");
      }

      // Check for duplicate rate (excluding current)
      const existingVatRate = await vatRateModel.findOne({
        studioId,
        rate: rate,
        _id: { $ne: id }
      });

      if (existingVatRate) {
        throw new BadRequestError("VAT rate with this percentage already exists");
      }

      updateData.rate = rate;
    }

    if (description !== undefined) {
      updateData.description = description;
    }

    const updatedVatRate = await vatRateModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "VAT rate updated successfully",
      vatRate: updatedVatRate
    });
  } catch (error) {
    next(error);
  }
};

// Delete VAT Rate
const deleteVatRate = async (req, res, next) => {
  try {
    const { id } = req.params;
    const studioId = req.user?.studio;

    if (!studioId) {
      throw new UnAuthorizedError("You are not assigned to any studio");
    }

    const vatRate = await vatRateModel.findOne({
      _id: id,
      studioId
    });

    if (!vatRate) {
      throw new NotFoundError("VAT rate not found");
    }

    // Check if this VAT rate is being used by any service
    const { ServiceModel } = require('../models/ServiceModel');
    const isInUse = await ServiceModel.findOne({ vatRate: id });

    if (isInUse) {
      throw new BadRequestError("Cannot delete VAT rate - It is being used by one or more services");
    }

    await vatRateModel.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "VAT rate deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  // Service operations
  createService,
  deleteService,
  getAllServices,
  getServiceById,
  updateService,

  // Category operations
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,

  // VAT Rate operations (optional)
  createVatRate,
  getAllVatRates,
  getVatRateById,
  updateVatRate,
  deleteVatRate
};