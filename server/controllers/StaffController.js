const { StaffModel } = require('../models/Discriminators');
const UserModel = require('../models/UserModel')
const GenerateToken = require('../utils/GenerateToken');
const hashedPassword = require('../utils/HashedPassword');
const bcrypt = require('bcryptjs');
const {
  BadRequestError,
  UnAuthorizedError,
  NotFoundError,
  ConflictError,
  InternalServerError,
} = require('../middleware/error/httpErrors');
const { uploadToCloudinary } = require('../utils/CloudinaryUpload')

// const { Readable } = require('stream');
const StudioModel = require('../models/StudioModel');
const { generateStaffId } = require('../utils/GenerateRandomID')




// create staff/Staff
const createStaff = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    const studioId = req.user?.studio;

    const {
      firstName,
      lastName,
      email,
      phone,
      telephone,
      gender,
      dateOfBirth,
      street,
      zipCode,
      city,
      country,
      staffRole,
      staffColor,
      vacationDays,
      remainingDays,
      about,
      username,
      staffId,
      password,

    } = req.body;


    // Check email conflict
    const checkEmail = await UserModel.findOne({ email });
    if (checkEmail) throw new ConflictError("❗️ Email Conflict");

    const studio = await StudioModel.findById(studioId)
    // Image required
    if (!req.file) throw new NotFoundError("Image Not Uploaded");

    // upload image to cloudinary
    const cloudinaryResult = await uploadToCloudinary(req.file.buffer);
    // Password validation
    if (!password || password.length < 8)
      throw new BadRequestError("Invalid Password: Must be at least 8 characters");

    const securePassword = await hashedPassword(password);

    const staffNumber = await generateStaffId(staffId);

    // Create staff
    const staff = await StaffModel.create({
      firstName,
      lastName,
      email,
      phone,
      telephone,
      gender,
      dateOfBirth,
      street,
      zipCode,
      city,
      country,
      staffRole,
      staffColor,
      vacationDays,
      remainingDays,
      about,
      username,
      staffId: staffNumber,
      img: {
        url: cloudinaryResult.secure_url,
        public_id: cloudinaryResult.public_id
      },
      studio: studioId,
      password: securePassword,
    });

    // Tokens
    const { AccessToken, RefreshToken } = GenerateToken({
      _id: staff._id,
      firstName: staff.firstName,
      lastName: staff.lastName,
      username: staff.username,
      email: staff.email,
      role: staff.role,
      studioId: staff.studio
    });

    staff.refreshToken = RefreshToken;
    await staff.save();
    res.cookie("token", AccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "lax",

      maxAge: 24 * 60 * 1000, // 15 minutes (or whatever your access token expiry is)
    });

    res.cookie("refreshToken", RefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    await StudioModel.findByIdAndUpdate(
      studioId,
      { $addToSet: { users: staff._id } }
    );


    res.status(200).json({
      message: "Successfully Created",
      staff: staff,
    });
  } catch (err) {
    next(err);
  }
};

// login staff/Staff
const loginStaff = async (req, res, next) => {
  try {
    const { email, password, studioName } = req.body;

    // const studio = await StudioModel.findOne({
    //   studioName: { $regex: `^${studioName}$`, $options: "i" },
    // });
    // if (!studio) throw new BadRequestError("Invalid Studio Name");

    // const staff = await UserModel.find({ email: email })// studio: studio._id })
    // .select("+password")
    // // .populate("studio");

    const staff = await UserModel.findOne({ email })
      .populate('studio', 'studioName')
      .select('+password')

    if (!staff) throw new NotFoundError("Invalid Email && studioName");

    const isMatch = await bcrypt.compare(password, staff.password);
    if (!isMatch) throw new UnAuthorizedError("Invalid Password");

  
    staff.loginHistory.push({
      date: new Date(),
      ip: req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress,
      device: req.headers['user-agent'],
      action: 'login'
    });
    // Keep only last 5 records
    if (staff.loginHistory.length < 5) {
      staff.loginHistory = staff.loginHistory.slice(-10);
    }

    const { AccessToken, RefreshToken } = GenerateToken({
      _id: staff._id,
      firstName: staff.firstName,
      lastName: staff.lastName,
      // username: staff.username,
      email: staff.email,
      studioId: staff.studio._id,
      role: staff.role,
      // // img: staff.img, // full object
      // staffRole: staff.staffRole,
    });

    staff.refreshToken = RefreshToken;
    await staff.save();
    res.cookie("token", AccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "lax",

      maxAge: 24 * 60 * 1000, // 15 minutes (or whatever your access token expiry is)
    });

    res.cookie("refreshToken", RefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      message: "Successfully Logged In",
      token: AccessToken,
      user: {
        id: staff._id,
        firstName: staff.firstName,
        lastName: staff.lastName,
        username: staff.username,
        email: staff.email,
        studio: {
          studioName: staff.studio.studioName,
        },
        studioId: staff.studio._id,
        role: staff.role,
        // img: staff.img, // full object for consistency
        staffRole: staff.staffRole,
      },
    });

  } catch (err) {
    next(err);
  }
};

// update Staff
const updateStaffById = async (req, res, next) => {
  try {
    const { staffId } = req.params;
    let {
      firstName,
      lastName,
      email,
      phone,
      telephone,
      gender,
      dateOfBirth,
      street,
      zipCode,
      city,
      country,
      staffRole,
      staffColor,
      vacationDays,
      remainingDays,
      vacationEntitlement,
      about,
      username,
      password,
    } = req.body;

    // Create update object with only the fields that are provided
    const updateData = {};

    // Only add fields that are actually present in the request
    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (telephone !== undefined) updateData.telephone = telephone;
    if (gender !== undefined) updateData.gender = gender;
    if (dateOfBirth !== undefined) updateData.dateOfBirth = dateOfBirth;
    if (street !== undefined) updateData.street = street;
    if (zipCode !== undefined) updateData.zipCode = zipCode;
    if (city !== undefined) updateData.city = city;
    if (country !== undefined) updateData.country = country;
    if (staffRole !== undefined) updateData.staffRole = staffRole;
    if (staffColor !== undefined) updateData.staffColor = staffColor;
    if (vacationDays !== undefined) updateData.vacationDays = vacationDays;
    if (vacationEntitlement !== undefined) updateData.vacationEntitlement = vacationEntitlement;
    if (remainingDays !== undefined) updateData.remainingDays = remainingDays;
    if (about !== undefined) updateData.about = about;
    if (username !== undefined) updateData.username = username;
    if (password !== undefined) updateData.password = await hashedPassword(password);

    if (req.file) {
      const cloudinaryResult = await uploadToCloudinary(req.file.buffer);
      updateData.img = {
        url: cloudinaryResult.secure_url,
        public_id: cloudinaryResult.public_id,
      };
    }

    // ✅ CORRECT: Update directly without nesting
    const staff = await StaffModel.findByIdAndUpdate(
      staffId,
      { $set: updateData },  // Direct update
      { new: true, runValidators: true }
    );

    if (!staff) throw new NotFoundError("staff not found");

    res.status(200).json({
      success: true,
      message: "Successfully Updated",
      staff: staff,
    });
  } catch (err) {
    next(err);
  }
};


// get staff/Staff byID
const getStaffById = async (req, res, next) => {
  try {
    const { staffId } = req.params;
    const staff = await StaffModel.findById(staffId).populate('studio', 'studioName studioOwner logo email phone').select('-password');
    if (!staff) throw new NotFoundError("staff not found");

    res.status(200).json({ staff });
  } catch (err) {
    next(err);
  }
};


// delete Staff/staff
const deleteStaffById = async (req, res, next) => {
  try {
    const { staffId } = req.params;
    const staff = await StaffModel.findByIdAndDelete(staffId);
    if (!staff) throw new NotFoundError("staff not found");

    res.status(200).json({ message: "Successfully Deleted" });
  } catch (err) {
    next(err);
  }
};


// get all staff
const getStaff = async (req, res, next) => {
  try {
    const userId = req.user?._id
    const studioId = req.user?.studio;
    const page = parseInt(req.query.page || 1);
    const limit = parseInt(req.query.limit || 5);
    const skip = (page - 1) * limit;


    const staff = await StaffModel.find({ studio: studioId }).populate('studio', 'studioName studioOwner email phone')
      .populate('shifts')
      .populate('vacations')
      .skip(skip).limit(limit);

    const totalstaff = await StaffModel.countDocuments();
    const totalPages = Math.ceil(totalstaff / limit);



    res.status(200).json({
      page,
      limit,
      totalPages,
      totalstaff,
      staff: {
        staff
      }
    });
  } catch (err) {
    next(err);
  }
}



// update login staff
const updateById = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    const updateData = { ...req.body }

    console.log('Body', req.body)
    if (req.file) {
      const imgData = await uploadToCloudinary(req.file.buffer)
      updateData.img = {
        url: imgData.secure_url,
        public_id: imgData.public_id,
      }
    }

    if (req.body.password) {
      updateData.password = await hashedPassword(req.body.password)
    }

    const updatedStaff = await StaffModel.findByIdAndUpdate(userId, updateData, { new: true, runValidators: true })

    return res.status(200).json({
      success: true,
      staff: updatedStaff
    })

  }
  catch (error) {
    next(error)
  }
}


module.exports = {
  createStaff,
  loginStaff,
  updateStaffById,
  deleteStaffById,
  getStaff,
  getStaffById,
  updateById
};