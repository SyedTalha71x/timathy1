const crypto = require('crypto');
const bcrypt = require('bcryptjs')
const { NotFoundError, BadRequestError } = require('../middleware/error/httpErrors');
const UserModel = require('../models/UserModel');
const sendEmail = require('../utils/sendEmail');
const hashedPassword = require('../utils/HashedPassword')
const { userModel } = require('../models/Discriminators')
const GenerateToken = require('../utils/GenerateToken');
const forgetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) throw new NotFoundError("Invalid email");

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000
    await user.save();

    const resetUrl = `${req.protocol}://${req.get("host")}/api/auth/resetPassword/${resetToken}`;

    const message = `You required a password Reset, Click here to reset: \n\n ${resetUrl}`;

    await sendEmail({
      to: user.email,
      subject: "Password Rest Request",
      text: message,
    })
    return res.status(200).json({ message: 'Password Reset Link send to email successfully' })
  }
  catch (error) {
    next(error)
  }
}

const resetPassword = async (req, res, next) => {
  try {
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest('hex');
    const user = await UserModel.findOne({ resetPasswordToken, resetPasswordExpire: { $gt: Date.now() } });
    if (!user) throw new BadRequestError("Invalid or Expire Token")
    user.password = await hashedPassword(req.body.password);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();
    return res.status(200).json({ message: "Password REset Successfully" })
  }
  catch (error) {
    next(error)
  }
}

const requestEmailChange = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { newEmail } = req.body;

    if (!newEmail) throw new BadRequestError('New email is required');

    const user = await userModel.findById(userId);
    if (!user) throw new NotFoundError('user not found');

    // Save as pending email until verified
    user.pendingEmail = newEmail;
    await user.save();

    res.status(200).json({ message: 'Email change requested. Please verify to complete.' });
  } catch (err) {
    next(err);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const userId = req.user?.id;   // from token
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      throw new BadRequestError('Old and new passwords are required');
    }

    const user = await UserModel.findById(userId);
    if (!user) throw new NotFoundError('User not found');

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) throw new BadRequestError('Old password is incorrect');

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    next(error);
  }
}


const logout = async (req, res, next) => {
  try {
    const userId = req.user?.id; // assuming auth middleware adds user
    if (userId) {
      await UserModel.findByIdAndUpdate(userId, { $unset: { refreshToken: 1 } });
    }
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
      //sameSite: "lax",
      path: "/", // must match login
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
      //sameSite: "lax",
      path: "/", // must match login
    });
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const userId = req.user?._id;

    const user = await UserModel.findById(req.user._id)
      .select('-password -refreshToken')
      .populate('studio', 'studioName city country email phone openingHours') // studio details
      .populate({
        path: 'appointments',
        populate: {
          path: 'service', // if your appointment references service
          select: 'name timeSlot date' // fields you want
        }
      })
      .lean();

    if (!user) throw new NotFoundError('User not found');

    res.status(200).json({
      success: true,
      user
    });
  }
  catch (error) {
    next(error)
  }
}


// new accessToken

const newAccessToken = async (req, res, next) => {
  try {
    const { userId } = req.user?._id;

    if (!userId) throw new NotFoundError("Invalid user")


    const { AccessToken } = GenerateToken({ _id: userId })
    res.cookie('token', AccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // true if on https
      sameSite: "None",
      //sameSite: "lax",
      maxAge: 15 * 60 * 1000, // 24 minutes (or whatever your access token expiry is)
    })
    return res.status(200).json({ success: true })

  } catch (error) {
    next(error)
  }
}




module.exports = { resetPassword, forgetPassword, requestEmailChange, changePassword, logout, getMe, newAccessToken }