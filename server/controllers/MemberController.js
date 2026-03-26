const { MemberModel } = require('../models/Discriminators');
const GenerateToken = require('../utils/GenerateToken');
const hashedPassword = require('../utils/HashedPassword');
const bcrypt = require('bcryptjs');
const { uploadToCloudinary } = require('../utils/CloudinaryUpload');

// generate Random Member number like #ORGA-2025-001
const { generateMemberNo } = require('../utils/GenerateRandomID')

const {
  BadRequestError,
  UnAuthorizedError,
  NotFoundError,
  ConflictError,
} = require('../middleware/error/httpErrors');
const UserModel = require('../models/UserModel');
const StudioModel = require('../models/StudioModel');
const RelationModel = require('../models/RelationModel');
const specialNotesModel = require('../models/SpecialNotesModel');

/**
 * Create new member
 */
const createMember = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      gender,
      city,
      street,
      country,
      zipCode,
      dateOfBirth,
      houseNumber,
      studioId,
      notes,
      trainingGoal
    } = req.body;

    const studio = await StudioModel.findById(studioId);
    if (!studio) throw new NotFoundError('Studio not found');

    // check for duplicate email
    const checkEmail = await UserModel.findOne({ email });
    if (checkEmail) throw new ConflictError('Email already exists');

    // Handle image upload if file exists
    let imgData = {};
    if (req.file) {
      const cloudinaryResult = await uploadToCloudinary(req.file.buffer);
      imgData = {
        url: cloudinaryResult.secure_url,
        public_id: cloudinaryResult.public_id,
      };
    }

    if (!password || password.length < 8) {
      throw new BadRequestError('Invalid password: must be at least 8 characters');
    }

    const securePassword = await hashedPassword(password);

    // generate Random MemberNo
    const memberNumber = await generateMemberNo();

    const user = await MemberModel.create({
      firstName,
      lastName,
      gender,
      phone,
      city,
      street,
      zipCode,
      dateOfBirth,
      houseNumber,
      country,
      email,
      memberNumber,
      password: securePassword,
      trainingGoal,
      studio: studioId,
      specialsNotes: Array.isArray(notes) ? notes.map(n => ({
        status: n.status || "general",
        note: n.note,
        isImportant: n.isImportant || false,
        valid: n.valid || null,
      })) : [],
      img: imgData,
      memberType: 'regular', // Add default member type
      status: 'active', // Add default status
    });

    const { AccessToken, RefreshToken } = GenerateToken({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      gender: user.gender,
      studioId: user.studio
    });

    user.refreshToken = RefreshToken;
    await user.save();

    res.cookie("token", AccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "lax",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours (fixed from 24 * 60 * 1000 which was 24 minutes)
    });

    res.cookie("refreshToken", RefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    await StudioModel.findByIdAndUpdate(
      studioId,
      { $addToSet: { users: user._id } }
    );

    // Remove sensitive data
    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.refreshToken;

    res.status(201).json({
      message: 'Member created successfully',
      user: userResponse
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Login member
 */
const loginMember = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new BadRequestError('Email and password are required');
    }

    const member = await UserModel.findOne({ email }).select('+password');
    if (!member) throw new NotFoundError('Invalid email');

    const isMatch = await bcrypt.compare(password, member.password);
    if (!isMatch) throw new UnAuthorizedError('Invalid password');

    const { AccessToken, RefreshToken } = GenerateToken({
      _id: member._id,
      firstName: member.firstName,
      lastName: member.lastName,
      email: member.email,
      role: member.role,
      // gender: member.gender,
      studioId: member.studio._id
    });

    member.refreshToken = RefreshToken;

    // Save last login
    member.loginHistory = member.loginHistory || [];
    member.loginHistory.push({
      date: new Date(),
      ip: req.ip || req.connection.remoteAddress,
      device: req.headers["user-agent"]
    });

    // Keep only last 10 logins
    if (member.loginHistory.length > 10) {
      member.loginHistory = member.loginHistory.slice(-10);
    }

    await member.save();

    const memberData = member.toObject();
    delete memberData.password;
    delete memberData.refreshToken;

    res.cookie("token", AccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "lax",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    res.cookie("refreshToken", RefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      message: 'Logged in successfully',
      user: memberData,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Update member
 */
/**
 * Update member with approval workflow
 */
const updateUserById = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    const {
      firstName,
      lastName,
      gender,
      phone,
      city,
      country,
      houseNumber,
      street,
      zipCode,
      dateOfBirth,
      about,
      email,
    } = req.body;

    // Build update data object
    let updateData = {
      firstName,
      lastName,
      gender,
      phone,
      city,
      street,
      zipCode,
      dateOfBirth,
      country,
      houseNumber,
      about,
      email,
    };

    // Handle image upload if file exists
    if (req.file) {
      const cloudinaryResult = await uploadToCloudinary(req.file.buffer);
      updateData.img = {
        url: cloudinaryResult.secure_url,
        public_id: cloudinaryResult.public_id,
      };
    }

    // Handle password update separately
    if (req.body.password) {
      updateData.password = await hashedPassword(req.body.password);
    }

    // Remove undefined fields
    Object.keys(updateData).forEach(key =>
      updateData[key] === undefined && delete updateData[key]
    );

    // Check if there are actual changes
    const currentMember = await UserModel.findById(userId).select('-password -refreshToken');

    if (!currentMember) throw new NotFoundError("Member not found");

    // Compare current data with update data to see if there are changes
    const hasChanges = Object.keys(updateData).some(key => {
      if (key === 'img') {
        return JSON.stringify(currentMember.img) !== JSON.stringify(updateData.img);
      }
      return currentMember[key] !== updateData[key];
    });

    if (!hasChanges) {
      return res.status(200).json({
        message: "No changes detected",
        user: currentMember,
        profileUpdateStatus: currentMember.profileUpdateStatus
      });
    }

    // Store pending updates instead of applying directly
    const updatedMember = await UserModel.findByIdAndUpdate(
      userId,
      {
        pendingUpdates: updateData,
        profileUpdateStatus: 'pending',
        profileUpdateRequestedAt: new Date()
      },
      { new: true, runValidators: true }
    ).select('-password -refreshToken');

    res.status(200).json({
      message: "Profile update request submitted for approval",
      user: updatedMember,
      profileUpdateStatus: 'pending',
      requiresApproval: true
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Delete member
 */
const deleteMemberById = async (req, res, next) => {
  try {
    const memberId = req.user?._id;

    const member = await MemberModel.findByIdAndDelete(memberId);

    if (!member) throw new NotFoundError('Member not found');

    // Remove member reference from studio
    if (member.studio) {
      await StudioModel.findByIdAndUpdate(member.studio, {
        $pull: { users: memberId }
      });
    }

    res.status(200).json({ message: 'Member deleted successfully' });
  } catch (err) {
    next(err);
  }
};

/**
 * Get logged-in member profile
 */
const getMemberById = async (req, res, next) => {
  try {
    const memberId = req.user?._id;

    const member = await MemberModel.findById(memberId)
      .populate({
        path: 'appointments',
        select: 'appointmentType date timeSlot bookingType relation',
        populate: {
          path: 'relation',
          select: 'relationType category',
        },
      })
      .populate('bookTrials', 'trialType trialDate trialTime')
      .populate('payments', 'amount paymentDate paymentMethod status')
      .populate('studio', 'studioName location contactInfo')
      .select('-password -refreshToken');

    if (!member) throw new NotFoundError('Member not found');

    res.status(200).json({ member });
  } catch (err) {
    next(err);
  }
};

/**
 * Get all members (with pagination)
 */
const getMembers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const studioId = req.user?.studio;

    let query = studioId ? { studio: studioId } : {};

    // Add search functionality
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { memberNumber: { $regex: search, $options: 'i' } }
      ];
    }

    const members = await MemberModel.find(query)
      .select('-password -refreshToken')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await MemberModel.countDocuments(query);

    if (!members || members.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No members available',
        members: [],
        totalPages: 0,
        currentPage: page,
        total: 0
      });
    }

    return res.status(200).json({
      success: true,
      members: members,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total: total
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update member check-in by id
 */
const updateMemberCheckIn = async (req, res, next) => {
  try {
    const { id } = req.params;

    const member = await MemberModel.findByIdAndUpdate(
      id,
      {
        checkIn: true,
        lastCheckIn: new Date()
      },
      { new: true }
    ).select('-password -refreshToken');

    if (!member) throw new NotFoundError('Member not found');

    return res.status(200).json({
      success: true,
      member
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create temporary member
 */
const createTemporaryMember = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    const studioId = req.user?.studio;
    let {
      firstName,
      lastName,
      email,
      gender,
      telephone,
      phone,
      street,
      city,
      zipCode,
      country,
      about,
      archivedAt,
      relation,
      notes,
      trainingGoal
    } = req.body;

    // Parse notes if it's a string
    if (notes && typeof notes === 'string') {
      try {
        notes = JSON.parse(notes);
        console.log('Parsed notes:', notes);
      } catch (e) {
        console.error('Error parsing notes:', e);
        notes = [];
      }
    }

    // Parse relation if it's a string
    if (relation && typeof relation === 'string') {
      try {
        relation = JSON.parse(relation);
        console.log('Parsed relation:', relation);
      } catch (e) {
        console.error('Error parsing relation:', e);
        relation = [];
      }
    }

    // Check for duplicate email if provided
    if (email) {
      const checkEmail = await UserModel.findOne({ email });
      if (checkEmail) throw new ConflictError('Email already exists');
    }

    // Handle image upload
    let imgData = {};
    if (req.file) {
      const cloudinaryResult = await uploadToCloudinary(req.file.buffer);
      imgData = {
        url: cloudinaryResult.secure_url,
        public_id: cloudinaryResult.public_id
      };
    }

    // Generate temporary member number
    const memberNumber = await generateMemberNo('TMP');

    // Now notes and relation are properly parsed arrays
    const member = await MemberModel.create({
      firstName,
      lastName,
      gender,
      email,
      telephone,
      phone,
      about,
      country,
      archivedAt,
      street,
      city,
      zipCode,
      trainingGoal,
      studio: studioId,
      memberNumber,
      memberType: 'temporary',
      status: 'active',
      img: imgData,
      specialsNotes: Array.isArray(notes) ? notes.map(n => ({
        status: n.status || "general",
        note: n.note,
        isImportant: n.isImportant || false,
        valid: n.valid || null,
      })) : [],
      relations: Array.isArray(relation) ? relation.map(r => ({
        entryType: r.entryType || "manual",
        name: r.name,
        leadId: r.leadId || null,
        memberId: r.memberId || null, // Make sure to include memberId
        category: r.category || "family",
        relationType: r.relationType || null,
        customRelation: r.customRelation || null
      })) : [],
      createdBy: userId
    });

    await StudioModel.findByIdAndUpdate(
      studioId,
      { $addToSet: { users: member._id } },
      { new: true }
    );

    const memberResponse = member.toObject();
    delete memberResponse.password;
    delete memberResponse.refreshToken;

    return res.status(200).json({
      success: true,
      user: memberResponse
    });
  } catch (error) {
    console.error('Error creating temporary member:', error);
    next(error);
  }
};

/**
 * Update member by staff
 */
const updateMemberByStaff = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    const { memberId } = req.params;

    const updateData = { ...req.body };

    // Parse JSON strings if they exist
    if (updateData.specialsNotes && typeof updateData.specialsNotes === 'string') {
      try {
        updateData.specialsNotes = JSON.parse(updateData.specialsNotes);
      } catch (err) {
        return res.status(400).json({ error: "Invalid specialsNotes format" });
      }
    }

    if (updateData.relations && typeof updateData.relations === 'string') {
      try {
        updateData.relations = JSON.parse(updateData.relations);
      } catch (err) {
        return res.status(400).json({ error: "Invalid relations format" });
      }
    }

    // Handle file upload
    if (req.file) {
      const cloudinaryResult = await uploadToCloudinary(req.file.buffer);
      updateData.img = {
        url: cloudinaryResult.secure_url,
        public_id: cloudinaryResult.public_id,
      };
    }

    // Remove undefined fields
    Object.keys(updateData).forEach(key =>
      updateData[key] === undefined && delete updateData[key]
    );

    // Update member in DB
    const updatedMember = await MemberModel.findByIdAndUpdate(
      memberId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password -refreshToken');

    if (!updatedMember) {
      throw new NotFoundError('Member not found');
    }

    return res.status(200).json({
      success: true,
      member: updatedMember,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * Get pending profile updates (for staff/admin)
 */
const getPendingProfileUpdates = async (req, res, next) => {
  try {
    const studioId = req.user?.studio;

    const members = await MemberModel.find({
      studio: studioId,
      profileUpdateStatus: 'pending',
      pendingUpdates: { $ne: null }
    }).select('-password -refreshToken');

    return res.status(200).json({
      success: true,
      members: members.map(member => ({
        _id: member._id,
        firstName: member.firstName,
        lastName: member.lastName,
        email: member.email,
        memberNumber: member.memberNumber,
        currentData: {
          firstName: member.firstName,
          lastName: member.lastName,
          gender: member.gender,
          phone: member.phone,
          city: member.city,
          country: member.country,
          houseNumber: member.houseNumber,
          street: member.street,
          zipCode: member.zipCode,
          dateOfBirth: member.dateOfBirth,
          about: member.about,
          email: member.email,

        },
        pendingUpdates: member.pendingUpdates,
        profileUpdateRequestedAt: member.profileUpdateRequestedAt
      }))
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Approve member profile update
 */
const approveProfileUpdate = async (req, res, next) => {
  try {
    const { memberId } = req.params;
    const { rejectReason } = req.body;

    const member = await MemberModel.findById(memberId);

    if (!member) throw new NotFoundError('Member not found');

    if (member.profileUpdateStatus !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'No pending update request found'
      });
    }

    // Apply pending updates to actual fields
    const updatedMember = await MemberModel.findByIdAndUpdate(
      memberId,
      {
        $set: {
          ...member.pendingUpdates,
          pendingUpdates: null,
          profileUpdateStatus: 'approved',
          profileUpdateRejectedReason: null
        }
      },
      { new: true, runValidators: true }
    ).select('-password -refreshToken');

    // Optional: Send notification email to member
    // await sendApprovalEmail(member.email, updatedMember);

    return res.status(200).json({
      success: true,
      message: 'Profile update approved successfully',
      member: updatedMember
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Reject member profile update
 */
const rejectProfileUpdate = async (req, res, next) => {
  try {
    const { memberId } = req.params;
    const { reason } = req.body;

    const member = await MemberModel.findById(memberId);

    if (!member) throw new NotFoundError('Member not found');

    if (member.profileUpdateStatus !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'No pending update request found'
      });
    }

    // Clear pending updates without applying them
    const updatedMember = await MemberModel.findByIdAndUpdate(
      memberId,
      {
        pendingUpdates: null,
        profileUpdateStatus: 'rejected',
        profileUpdateRejectedReason: reason || 'No reason provided'
      },
      { new: true }
    ).select('-password -refreshToken');

    // Optional: Send rejection notification email
    // await sendRejectionEmail(member.email, reason);

    return res.status(200).json({
      success: true,
      message: 'Profile update rejected',
      member: updatedMember
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get profile update status for a member
 */
const getProfileUpdateStatus = async (req, res, next) => {
  try {
    const userId = req.user?._id;

    const member = await MemberModel.findById(userId)
      .select('profileUpdateStatus pendingUpdates profileUpdateRequestedAt profileUpdateRejectedReason');

    if (!member) throw new NotFoundError('Member not found');

    return res.status(200).json({
      success: true,
      profileUpdateStatus: member.profileUpdateStatus,
      pendingUpdates: member.pendingUpdates,
      requestedAt: member.profileUpdateRequestedAt,
      rejectedReason: member.profileUpdateRejectedReason
    });
  } catch (error) {
    next(error);
  }
};


module.exports = {
  createMember,
  loginMember,
  updateUserById,
  deleteMemberById,
  getMemberById,
  getMembers,
  updateMemberCheckIn,
  createTemporaryMember,
  updateMemberByStaff,
  getPendingProfileUpdates,
  getProfileUpdateStatus,
  rejectProfileUpdate,
  approveProfileUpdate
};