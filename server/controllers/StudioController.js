const StudioModel = require('../models/StudioModel');
const { MemberModel, AdminModel, StaffModel } = require('../models/Discriminators');
const { NotFoundError, UnAuthorizedError, ConflictError } = require('../middleware/error/httpErrors')



const { uploadToCloudinary } = require('../utils/CloudinaryUpload');




const updateStudio = async (req, res, next) => {
  try {
    const { studioId } = req.params;

    // IMPORTANT: Check if req.body exists
    if (!req.body) {
      return res.status(400).json({
        success: false,
        message: "Request body is missing"
      });
    }


    const findStudio = await StudioModel.findById(studioId);
    if (!findStudio) throw new NotFoundError("Studio not found");

    // Define allowed fields
    const allowedFields = [
      'studioName', 'studioOwner', 'ownerPhone', 'ownerEmail',
      'phone', 'telephone', 'operatorTelephone', 'email',
      'street', 'zipCode', 'city', 'country', 'website',
      'overallCapacity', 'registrationNumber', 'texId', 'court',
      'openingHours', 'closingDays'
    ];

    // Process each field - parse JSON strings if needed
    const processedBody = {};

    Object.keys(req.body).forEach(key => {
      let value = req.body[key];

      // Try to parse if it looks like a JSON array or object
      if (typeof value === 'string') {
        const trimmed = value.trim();
        if ((trimmed.startsWith('[') && trimmed.endsWith(']')) ||
          (trimmed.startsWith('{') && trimmed.endsWith('}'))) {
          try {
            value = JSON.parse(trimmed);
            console.log(`Parsed ${key} as JSON:`, value);
          } catch (e) {
            console.log(`Failed to parse ${key} as JSON:`, e.message);
          }
        }
      }

      processedBody[key] = value;
    });

    // Safely build update object with only allowed fields
    const updateData = allowedFields.reduce((acc, field) => {
      if (processedBody[field] !== undefined) {
        acc[field] = processedBody[field];
      }
      return acc;
    }, {});

    // Handle file upload only if file exists
    if (req.file) {
      try {
        const imageData = await uploadToCloudinary(req.file.buffer);
        updateData.img = {
          url: imageData.secure_url,
          public_id: imageData.public_id
        };
      } catch (uploadError) {
        console.error('Image upload failed:', uploadError);
        // Continue with update even if image fails
      }
    }

    // Check if there's anything to update
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields to update"
      });
    }

    console.log('Updating studio with:', updateData);

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
    console.error('Update error:', error);
    next(error);
  }
};




const getStudioByMemberId = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    const studioId = req.user?.studio;
    const studio = await StudioModel
      .findOne(studioId)
      .populate({
        path: "users",
        select: "firstName lastName email phone role staffRole gender img username about vacations documents medicalResponse sepaMandates loginHistory updatedAt staffColor",
        populate: [
          { path: "vacations", select: 'startDate endDate reason status approvedBy rejectedBy createdAt' }, // 👈 ADD THIS
          { path: "appointments", select: "date timeSlotStart timeSlotEnd" },
          { path: "documents", select: 'displayName' },
        ]
      })
      .populate('services', 'image name description price duration')
      .populate('leads', "firstName lastName email phone role staffRole gender img username about")

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

    const userId = req.user?._id
    const role = req.user?.role

    if (role !== "admin") {
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


const getAllStudio = async (req, res, next) => {
  const userId = req.user?._id;

  const studios = await StudioModel.find()


  return res.status(200).json({
    success: true,
    // members: studios.users.length,
    studios: studios,
  })
}

module.exports = {
  updateStudio,
  getStudioByMemberId,
  createStudio,
  deleteStudioById,
  getAllStudio
}
