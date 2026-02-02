const { AdminModel } = require('../models/Discriminators');
const bcrypt = require('bcryptjs');
const GenerateToken = require('../utils/GenerateToken');
const hashedPassword = require('../utils/HashedPassword');
const {
    BadRequestError,
    UnauthorizedError,
    NotFoundError,
    ConflictError
} = require('../middleware/error/httpErrors');
const UserModel = require('../models/UserModel');
// const { uploadToCloudinary } = require('../utils/CloudinaryUpload');

// Create Admin
const createAdmin = async (req, res, next) => {
    try {
        const {
            firstName,
            lastName,
            phone,
            gender,
            dateOfBirth,
            city,
            zipCode,
            street,
            about,
            email,
            password,
            country,
            authCode } = req.body;

        if (authCode !== process.env.AUTH_CODE)
            throw new UnauthorizedError("Auth Code Invalid");

        const checkEmail = await AdminModel.findOne({ email });
        if (checkEmail) throw new ConflictError("Email Conflict");

        if (!password || password.length < 8)
            throw new BadRequestError("Invalid Password: Must be at least 8 characters");

        const securePassword = await hashedPassword(password);





        // role automatically set to 'admin' via discriminator
        const admin = await AdminModel.create({
            firstName,
            lastName,
            phone,
            gender,
            dateOfBirth,
            city,
            zipCode,
            street,
            about,
            email,
            country,
            password: securePassword
        });

        const { AccessToken, RefreshToken } = GenerateToken({
            firstName: admin.firstName,
            lastName: admin.lastName,
            _id: admin._id,
            email: admin.email,
            role: admin.role,
        });
        admin.refreshToken = RefreshToken;
        await admin.save();

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
        return res.status(200).json({
            message: "Created Successfully",
            admin: {
                firstName: admin.firstName,
                lastName: admin.lastName,
                _id: admin._id,
                email: admin.email,
                role: admin.role,
            }
        });

    } catch (err) {
        next(err);
    }
};

// Admin Login
const loginAdmin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const admin = await AdminModel.findOne({ email }).select('+password');
        if (!admin) throw new NotFoundError("Invalid Email");

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) throw new UnauthorizedError("Invalid Password");

        const { AccessToken, RefreshToken } = GenerateToken({
            firstName: admin.firstName,
            lastName: admin.lastName,
            _id: admin._id,
            email: admin.email,
            role: admin.role,
        });

        admin.refreshToken = RefreshToken;
        await admin.save();

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
        return res.status(200).json({
            message: "Login Successfully",
            token: AccessToken,
            admin: {
                firstName: admin.firstName,
                lastName: admin.lastName,
                _id: admin._id,
                email: admin.email,
                role: admin.role,
                studio: admin.studio,
            }
        });
    } catch (error) {
        next(error);
    }
};

// update Admin Details

const updateAdminById = async (req, res, next) => {
    try {
        const { id } = req.params;
        let updateAdmin = { ...req.body };

        if (!req.file) throw new NotFoundError("Image Not Uploaded");
        // const cloudinaryResult = await uploadToCloudinary(req.file.buffer);
        // ✅ Save new image URL + public__id into update object
        // updateAdmin.img = {
        //     url: cloudinaryResult.secure_url,
        //     public__id: cloudinaryResult.public__id,
        // };

        // Update admin in MongoDB
        const admin = await AdminModel.findByIdAndUpdate(id, updateAdmin, { new: true });
        if (!admin) throw new NotFoundError("admin not found");

        res.status(200).json({
            message: "Successfully Updated",
            admin: {
                _id: admin._id,
                firstName: admin.firstName,
                lastName: admin.lastName,
                email: admin.email,
                studioName: admin.studioName,
                role: admin.role,
                // img: admin.img?.url, // ✅ now points to Cloudinary URL
            },
        });
    } catch (err) {
        next(err);
    }
};

const getUsers = async (req, res, next) => {
    try {
        const users = await UserModel.find().select('-password')
        if (!users.length) throw new NotFoundError("No user Available")
        return res.status(200).json({
            message: 'All User is Available ',
            users: users.map(user => (
                {
                    _id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    studioName: user.studioName,
                    email: user.email,
                    role: user.role,
                    adminRole: user.adminRole,
                    leadsCount: user.leads?.length || 0,
                    appointmentsCount: user.appointments?.length || 0,
                    relationsCount: user.relations?.length || 0,
                    bookTrialsCount: user.bookTrials?.length || 0
                }
            ))
        })
    }
    catch (error) {
        next(error)
    }
}

const deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await UserModel.findByIdAndDelete(id);
        if (!user) throw new NotFoundError("User not found");

        res.status(200).json({ status: true, message: "Successfully Deleted" });
    } catch (err) {
        next(err);
    }
};


module.exports = {
    createAdmin,
    loginAdmin,
    getUsers,
    deleteUser,
    updateAdminById
};
