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



// create staff/Staff
// create staff/Staff
const createStaff = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      email,
      username,
      password,
      studioId,
      phone,
      city,
      street,
      country,
      zipCode,
      dateOfBirth,
      houseNumber
    } = req.body;


    // Check email conflict
    const checkEmail = await UserModel.findOne({ email });
    if (checkEmail) throw new ConflictError("❗️ Email Conflict");

    const studio = await StudioModel.findById(studioId)
    // // Image required
    // if (!req.file) throw new NotFoundError("Image Not Uploaded");

    // // upload image to cloudinary
    // const cloudinaryResult = await uploadToCloudinary(req.file.buffer);
    // Password validation
    if (!password || password.length < 8)
      throw new BadRequestError("Invalid Password: Must be at least 8 characters");

    const securePassword = await hashedPassword(password);


    // Create staff
    const staff = await StaffModel.create({
      firstName,
      lastName,
      phone,
      username,
      city,
      street,
      country,
      zipCode,
      dateOfBirth,
      email,
      houseNumber,
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
      // img: staff.img,
      // staffRole: staff.staffRole,
    });

    staff.refreshToken = RefreshToken;
    await staff.save();
    res.cookie("token", AccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // true if on https
      //sameSite: "lax",
      sameSite: "None",

      maxAge: 24 * 60 * 1000, // 15 minutes (or whatever your access token expiry is)
    });

    res.cookie("refreshToken", RefreshToken, {
      httpOnly: true,
      //secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      //sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    await StudioModel.findByIdAndUpdate(
      studioId,
      { $addToSet: { users: staff._id } }
    );

    res.status(200).json({
      message: "Successfully Created",
      staff: {
        id: staff._id,
        firstName: staff.firstName,
        lastName: staff.lastName,
        username: staff.username,
        email: staff.email,
        role: staff.role,
        // img: staff.img,
        staffRole: staff.staffRole,
      },
    });
  } catch (err) {
    next(err);
  }
};

// login staff/Staff
const loginStaff = async (req, res, next) => {
  try {
    const { email, password, studioName } = req.body;

    const studio = await StudioModel.findOne({
      studioName: { $regex: `^${studioName}$`, $options: "i" },
    });
    if (!studio) throw new BadRequestError("Invalid Studio Name");

    const staff = await UserModel.findOne({ email, studio: studio._id })
      .select("+password")
      .populate("studio", "studioName");

    if (!staff) throw new NotFoundError("Invalid Email && studioName");

    const isMatch = await bcrypt.compare(password, staff.password);
    if (!isMatch) throw new UnAuthorizedError("Invalid Password");

    const { AccessToken, RefreshToken } = GenerateToken({
      _id: staff._id,
      firstName: staff.firstName,
      lastName: staff.lastName,
      username: staff.username,
      email: staff.email,
      studioId: staff.studio,
      role: staff.role,
      // img: staff.img, // full object
      // staffRole: staff.staffRole,
    });

    staff.refreshToken = RefreshToken;
    await staff.save();
    res.cookie("token", AccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // true if on https
      //sameSite: "lax",
      sameSite: "None",

      maxAge: 24 * 60 * 1000, // 15 minutes (or whatever your access token expiry is)
    });

    res.cookie("refreshToken", RefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      //sameSite: "lax",
      sameSite: "None",
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

// update staff/Staff
const updateStaffById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let updateStaff = { ...req.body };

    // if (!req.file) throw new NotFoundError("Image Not Uploaded");

    // const cloudinaryResult = await uploadToCloudinary(req.file.buffer);

    // // ✅ Save new image URL + public_id into update object
    // updateStaff.img = {
    //   url: cloudinaryResult.secure_url,
    //   public_id: cloudinaryResult.public_id,
    // };

    // Update staff in MongoDB
    const staff = await StaffModel.findByIdAndUpdate(id, updateStaff, { new: true });
    if (!staff) throw new NotFoundError("staff not found");

    res.status(200).json({
      message: "Successfully Updated",
      staff: {
        id: staff._id,
        firstName: staff.firstName,
        lastName: staff.lastName,
        username: staff.username,
        email: staff.email,
        studioName: staff.studioName,
        role: staff.role,
        // img: staff.img?.url, // ✅ now points to Cloudinary URL
        staffRole: staff.staffRole,
      },
    });
  } catch (err) {
    next(err);
  }
};






// get staff/Staff byID
const getStaffById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const staff = await StaffModel.findById(id).populate('studio', 'studioName studioOwner logo email phone').select('-password');
    if (!staff) throw new NotFoundError("staff not found");

    res.status(200).json({ staff });
  } catch (err) {
    next(err);
  }
};




// delete Staff/staff
const deleteStaffById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const staff = await StaffModel.findByIdAndDelete(id);
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


    const staff = await StaffModel.find({ studio: studioId }).populate('studio', 'studioName studioOwner email phone').skip(skip).limit(limit);

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



module.exports = {
  createStaff,
  loginStaff,
  updateStaffById,
  deleteStaffById,
  getStaff,
  getStaffById,

};
