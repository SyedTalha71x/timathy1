const mongoose = require('mongoose');
const cloudinary = require('../utils/Cloudinary');
const { AppointmentModel, AppointmentCategoryModel, AppointmentTypeModel } = require('../models/AppointmentModel');
const { MemberModel } = require('../models/Discriminators');
const StudioModel = require('../models/StudioModel');
const { NotFoundError, UnAuthorizedError, BadRequestError } = require('../middleware/error/httpErrors');
const LeadModel = require('../models/LeadModel');
const { notifyUser } = require('../utils/NotificationService');
const { uploadToCloudinary } = require('../utils/CloudinaryUpload');

// ========================
// CREATE APPOINTMENT (Member self-booking)
// ========================
const createAppointment = async (req, res, next) => {
    try {
        const userId = req.user?._id;
        let { appointmentTypeId, date, timeSlotId, view, bookingType = "single", frequency, occurrences } = req.body;

        if (!appointmentTypeId || !date || !timeSlotId) throw new BadRequestError("Missing required Field");

        // Get appointment type details
        const appointmentType = await AppointmentTypeModel.findById(appointmentTypeId);
        if (!appointmentType) throw new NotFoundError("Invalid appointment type ID");

        const member = await MemberModel.findById(userId);
        if (!member) throw new NotFoundError("Invalid Member Id");
        const studioId = member?.studio;

        const studio = await StudioModel.findById(studioId);
        if (!studio) throw new NotFoundError("Invalid Studio Id");

        // Check if time slot is already booked
        const existingAppointment = await AppointmentModel.findOne({
            studio: studioId,
            date,
            "timeSlot.start": timeSlotId.start,
            "timeSlot.isBlocked": timeSlotId.isBlocked,
        });

        if (existingAppointment) throw new BadRequestError("TimeSlot already Booked");

        const today = new Date();
        const selectedDate = new Date(date);
        let status = "scheduled";
        
        if (selectedDate < new Date(today.getFullYear(), today.getMonth(), today.getDate())) {
            status = "completed";
            view = 'past';
        }

        // Check contingent usage
        if (appointmentType.contingentUsage > (member.contingentBalance || 0)) {
            throw new BadRequestError("Insufficient contingent balance");
        }

        // SINGLE BOOKING
        if (bookingType === "single") {
            const appointment = await AppointmentModel.create({
                member: userId,
                studio: studioId,
                appointmentType: appointmentTypeId,
                date,
                timeSlot: timeSlotId,
                view: view || "upcoming",
                bookingType: "single",
                status,
            });

            await MemberModel.findByIdAndUpdate(userId, {
                $push: { appointments: appointment._id },
                $inc: { contingentBalance: -appointmentType.contingentUsage }
            });

            const memberEmail = await MemberModel.findById(userId).select('email');
            await notifyUser(userId, [memberEmail.email], "Appointment Booked", `Your appointment for ${appointmentType.name} on ${date} has been booked successfully.`, 'appointment_booked');

            return res.status(201).json({
                success: true,
                appointment,
            });
        }

        // RECURRING BOOKING
        if (bookingType === "recurring") {
            if (!frequency || !occurrences) throw new BadRequestError("Missing recurring details");

            let appointments = [];
            let currentDate = new Date(date);
            const totalContingentNeeded = appointmentType.contingentUsage * occurrences;
            const recurringGroupId = new mongoose.Types.ObjectId();

            if (totalContingentNeeded > (member.contingentBalance || 0)) {
                throw new BadRequestError("Insufficient contingent balance for recurring bookings");
            }

            for (let i = 0; i < occurrences; i++) {
                appointments.push({
                    member: userId,
                    studio: studioId,
                    appointmentType: appointmentTypeId,
                    date: new Date(currentDate),
                    timeSlot: timeSlotId,
                    view: view || "upcoming",
                    bookingType: "recurring",
                    frequency,
                    occurrences,
                    recurringGroupId,
                    status,
                });

                if (frequency === "daily")
                    currentDate.setDate(currentDate.getDate() + 1);
                else if (frequency === "weekly")
                    currentDate.setDate(currentDate.getDate() + 7);
                else if (frequency === "monthly")
                    currentDate.setMonth(currentDate.getMonth() + 1);
            }

            const createdAppointments = await AppointmentModel.insertMany(appointments);

            await MemberModel.findByIdAndUpdate(userId, {
                $push: {
                    appointments: {
                        $each: createdAppointments.map(a => a._id),
                    },
                },
                $inc: { contingentBalance: -totalContingentNeeded }
            });

            return res.status(201).json({
                success: true,
                appointments: createdAppointments,
            });
        }

    } catch (error) {
        next(error);
    }
};

// ========================
// CREATE BLOCKED APPOINTMENT
// ========================
const createBlockedAppointment = async (req, res, next) => {
    try {
        let { startDate, endDate, timeSlot, appointmentTypeId, note } = req.body;

        if (!startDate || !endDate || !timeSlot || !timeSlot.start || !timeSlot.end) {
            throw new BadRequestError("Missing required fields for blocked appointment");
        }

        const appointmentType = await AppointmentTypeModel.findById(appointmentTypeId);
        if (!appointmentType) throw new NotFoundError("Invalid appointment type id");

        const studioId = req.user?.studio;
        const studio = await StudioModel.findById(studioId);
        if (!studio) throw new NotFoundError("Invalid Studio Id");

        const start = new Date(startDate);
        const end = new Date(endDate);
        const appointments = [];

        for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
            const currentDate = date.toISOString().split('T')[0];

            const existingAppointment = await AppointmentModel.findOne({
                studio: studioId,
                date: currentDate,
                "timeSlot.start": timeSlot.start,
                "timeSlot.end": timeSlot.end,
            });

            if (!existingAppointment) {
                const appointment = await AppointmentModel.create({
                    appointmentType: appointmentTypeId,
                    studio: studioId,
                    date: currentDate,
                    timeSlot: {
                        ...timeSlot,
                        isBlocked: true,
                    },
                    note,
                    status: "blocked",
                    view: "blocked"
                });
                appointments.push(appointment);
            }
        }

        return res.status(201).json({
            success: true,
            appointments: appointments
        });
    } catch (error) {
        next(error);
    }
};

// ========================
// CREATE APPOINTMENT BY STAFF
// ========================
const createAppointmentByStaff = async (req, res, next) => {
    try {
        const userId = req.user?._id;
        const { memberId } = req.params;
        const studioId = req.user?.studio;

        const {
            appointmentTypeId,
            date,
            timeSlotId,
            view,
            bookingType = "single",
            frequency,
            occurrences = 1,
        } = req.body;

        if (!appointmentTypeId || !date || !timeSlotId)
            throw new BadRequestError("Missing required field");

        const appointmentType = await AppointmentTypeModel.findById(appointmentTypeId);
        if (!appointmentType) throw new NotFoundError("Invalid appointment type ID");

        const member = await MemberModel.findById(memberId);
        if (!member) throw new NotFoundError("Invalid Member ID");

        const existingAppointment = await AppointmentModel.findOne({
            studio: studioId,
            date,
            "timeSlot.start": timeSlotId.start,
            "timeSlot.isBlocked": timeSlotId.isBlocked,
        });
        if (existingAppointment) throw new BadRequestError("TimeSlot already Booked");

        const today = new Date();
        const selectedDate = new Date(date);
        let status = "confirmed";
        
        if (selectedDate < new Date(today.getFullYear(), today.getMonth(), today.getDate())) {
            status = "completed";
        }

        if (appointmentType.contingentUsage > (member.contingentBalance || 0)) {
            throw new BadRequestError("Member has insufficient contingent balance");
        }

        // SINGLE BOOKING
        if (bookingType === "single") {
            const appointment = await AppointmentModel.create({
                member: memberId,
                studio: studioId,
                appointmentType: appointmentTypeId,
                date,
                timeSlot: timeSlotId,
                view: view || "upcoming",
                bookingType: "single",
                status,
                createdBy: userId
            });

            await MemberModel.findByIdAndUpdate(memberId, {
                $push: { appointments: appointment._id },
                $inc: { contingentBalance: -appointmentType.contingentUsage }
            });

            await notifyUser(memberId, [member.email], "Appointment Booked", `Your appointment for ${appointmentType.name} on ${new Date(appointment.date).toLocaleDateString()} has been booked by staff.`, 'appointment-booked');

            return res.status(201).json({
                success: true,
                appointment,
            });
        }

        // RECURRING BOOKING
        if (bookingType === "recurring") {
            if (!frequency || !occurrences) throw new BadRequestError("Missing recurring details");

            let appointments = [];
            let currentDate = new Date(date);
            const totalContingentNeeded = appointmentType.contingentUsage * occurrences;
            const recurringGroupId = new mongoose.Types.ObjectId();

            if (totalContingentNeeded > (member.contingentBalance || 0)) {
                throw new BadRequestError("Insufficient contingent balance for recurring bookings");
            }

            for (let i = 0; i < occurrences; i++) {
                appointments.push({
                    member: memberId,
                    studio: studioId,
                    appointmentType: appointmentTypeId,
                    date: new Date(currentDate),
                    timeSlot: timeSlotId,
                    view: view || "upcoming",
                    bookingType: "recurring",
                    frequency,
                    occurrences,
                    recurringGroupId,
                    status,
                    createdBy: userId
                });

                if (frequency === "daily")
                    currentDate.setDate(currentDate.getDate() + 1);
                else if (frequency === "weekly")
                    currentDate.setDate(currentDate.getDate() + 7);
                else if (frequency === "monthly")
                    currentDate.setMonth(currentDate.getMonth() + 1);
            }

            const createdAppointments = await AppointmentModel.insertMany(appointments);

            await MemberModel.findByIdAndUpdate(memberId, {
                $push: {
                    appointments: {
                        $each: createdAppointments.map(a => a._id),
                    },
                },
                $inc: { contingentBalance: -totalContingentNeeded }
            });

            await notifyUser(memberId, [member.email], "Appointment Booked", `Your upcoming appointments have been created by staff.`, 'appointment-booked');

            return res.status(201).json({
                success: true,
                appointments: createdAppointments,
            });
        }

    } catch (error) {
        next(error);
    }
};

// ========================
// CREATE TRIAL BOOKING BY STAFF (for Leads)
// ========================
const createBookingTrailByStaff = async (req, res, next) => {
    try {
        const userId = req.user?._id;
        const studioId = req.user?.studio;
        const { leadId } = req.params;

        const { appointmentTypeId, date, timeSlotId } = req.body;

        if (!appointmentTypeId || !date || !timeSlotId)
            throw new BadRequestError("Missing required field");

        const appointmentType = await AppointmentTypeModel.findById(appointmentTypeId);
        if (!appointmentType) throw new NotFoundError("Invalid appointment type ID");

        const lead = await LeadModel.findById(leadId);
        if (!lead) throw new NotFoundError("Invalid Lead ID");

        const existingAppointment = await AppointmentModel.findOne({
            studio: studioId,
            date,
            "timeSlot.start": timeSlotId.start,
            "timeSlot.isBlocked": timeSlotId.isBlocked,
        });
        if (existingAppointment) throw new BadRequestError("TimeSlot already Booked");

        const today = new Date();
        const selectedDate = new Date(date);
        let status = "confirmed";

        if (selectedDate < new Date(today.getFullYear(), today.getMonth(), today.getDate())) {
            status = "completed";
        }

        const appointment = await AppointmentModel.create({
            lead: leadId,
            studio: studioId,
            appointmentType: appointmentTypeId,
            date,
            timeSlot: timeSlotId,
            view: "upcoming",
            bookingType: "single",
            status,
            isTrial: true,
            createdBy: userId
        });

        await LeadModel.findByIdAndUpdate(leadId, {
            $push: { appointments: appointment._id },
        });

        return res.status(201).json({
            success: true,
            appointment,
        });
    } catch (error) {
        next(error);
    }
};

// ========================
// GET MY APPOINTMENTS (Member)
// ========================
const getMyAppointment = async (req, res, next) => {
    try {
        const userId = req.user?._id;
        const appointments = await AppointmentModel.find({ member: userId })
            .populate('appointmentType', 'name duration calenderColor contingentUsage')
            .populate('studio', 'studioName')
            .sort({ createdAt: -1 });
        
        if (!appointments || appointments.length === 0) {
            return res.status(200).json({
                success: true,
                appointments: []
            });
        }
        
        return res.status(200).json({
            success: true,
            appointments
        });
    } catch (error) {
        return next(error);
    }
};

// ========================
// CANCEL APPOINTMENT
// ========================
const cancelAppointment = async (req, res, next) => {
    try {
        const { appointmentId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
            throw new NotFoundError("Invalid Appointment ID");
        }

        const appointment = await AppointmentModel.findById(appointmentId).populate('appointmentType');

        if (!appointment) {
            throw new NotFoundError("Appointment not found");
        }

        if (appointment.status === "canceled") {
            return res.status(400).json({
                success: false,
                message: "Appointment is already canceled",
            });
        }

        if (appointment.status === "completed") {
            return res.status(400).json({
                success: false,
                message: "Completed appointments cannot be canceled",
            });
        }

        if (appointment.member && appointment.appointmentType && appointment.status !== "canceled") {
            await MemberModel.findByIdAndUpdate(appointment.member, {
                $inc: { contingentBalance: appointment.appointmentType.contingentUsage }
            });
        }

        appointment.status = "canceled";
        appointment.view = "past";
        await appointment.save();

        if (appointment.member) {
            const member = await MemberModel.findById(appointment.member).select('email');
            await notifyUser(appointment.member, [member.email], "Appointment Canceled", `Your appointment has been canceled.`, 'appointment-canceled');
        }

        return res.status(200).json({
            success: true,
            message: "Appointment successfully canceled",
            appointment,
        });
    } catch (error) {
        next(error);
    }
};

// ========================
// GET ALL APPOINTMENTS (Staff/Admin)
// ========================
const allAppointments = async (req, res, next) => {
    try {
        const appointments = await AppointmentModel.find()
            .populate('member', 'firstName lastName email')
            .populate('lead', 'firstName lastName email')
            .populate('studio', 'studioName')
            .populate('appointmentType', 'name duration calenderColor')
            .sort({ createdAt: -1 });
        
        return res.status(200).json({
            success: true,
            appointments: appointments
        });
    } catch (error) {
        next(error);
    }
};

// ========================
// GET APPOINTMENTS BY MEMBER ID
// ========================
const appointmentByMemberId = async (req, res, next) => {
    try {
        const { memberId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(memberId)) {
            throw new NotFoundError("Invalid Member ID");
        }

        const now = new Date();

        const appointments = await AppointmentModel.find({
            member: memberId,
            date: { $gte: now }
        })
            .populate('member', 'firstName lastName')
            .populate('appointmentType', 'name duration calenderColor')
            .populate('studio', 'studioName')
            .sort({ date: 1 });

        return res.status(200).json({
            success: true,
            appointments: appointments || [],
        });
    } catch (error) {
        next(error);
    }
};

// ========================
// UPDATE APPOINTMENT BY ID
// ========================
const updateAppointmentById = async (req, res, next) => {
    try {
        const { appointmentId } = req.params;
        const { appointmentTypeId, date, timeSlotId } = req.body;

        const updateData = {
            view: 'upcoming',
            status: 'confirmed'
        };

        if (appointmentTypeId) updateData.appointmentType = appointmentTypeId;
        if (date) updateData.date = date;

        if (timeSlotId) {
            if (timeSlotId.start && timeSlotId.end) {
                updateData.timeSlot = {
                    start: timeSlotId.start,
                    end: timeSlotId.end,
                    duration: timeSlotId.duration || 60,
                    isBlocked: timeSlotId.isBlocked || false
                };
            } else if (timeSlotId.start) {
                const duration = timeSlotId.duration || 60;
                const [hours, minutes] = timeSlotId.start.split(':').map(Number);
                const endDate = new Date(2000, 0, 1, hours, minutes + duration);
                const end = `${String(endDate.getHours()).padStart(2, '0')}:${String(endDate.getMinutes()).padStart(2, '0')}`;

                updateData.timeSlot = {
                    start: timeSlotId.start,
                    end: end,
                    duration: duration,
                    isBlocked: timeSlotId.isBlocked || false
                };
            } else {
                const existingAppointment = await AppointmentModel.findById(appointmentId);
                if (existingAppointment && existingAppointment.timeSlot) {
                    updateData.timeSlot = existingAppointment.timeSlot;
                }
            }
        }

        const appointment = await AppointmentModel.findById(appointmentId);
        if (!appointment) throw new NotFoundError("Invalid appointment Id");

        const updatedAppointment = await AppointmentModel.findByIdAndUpdate(
            appointmentId,
            { $set: updateData },
            { new: true }
        ).populate('appointmentType', 'name duration');

        if (!updatedAppointment) throw new BadRequestError("Invalid data");

        return res.status(200).json({
            success: true,
            appointment: updatedAppointment
        });
    } catch (error) {
        next(error);
    }
};

// ========================
// DELETE APPOINTMENT BY ID
// ========================
const deleteAppointmentById = async (req, res, next) => {
    try {
        const { appointmentId } = req.params;

        const appointment = await AppointmentModel.findById(appointmentId).populate('appointmentType');

        if (!appointment) throw new NotFoundError("Invalid Appointment Id");

        if (appointment.member && appointment.appointmentType && appointment.status !== "canceled" && appointment.status !== "completed") {
            await MemberModel.findByIdAndUpdate(appointment.member, {
                $inc: { contingentBalance: appointment.appointmentType.contingentUsage }
            });
        }

        if (appointment.member) {
            await MemberModel.findByIdAndUpdate(appointment.member, {
                $pull: { appointments: appointment._id }
            }, { new: true });
        }

        if (appointment.lead) {
            await LeadModel.findByIdAndUpdate(appointment.lead, {
                $pull: { appointments: appointment._id }
            }, { new: true });
        }

        await AppointmentModel.findByIdAndDelete(appointmentId);
        
        return res.status(200).json({
            success: true,
            message: "Appointment Deleted Successfully"
        });
    } catch (error) {
        next(error);
    }
};

// ========================
// GET ALL PENDING APPOINTMENTS
// ========================
const getAllPendingAppointment = async (req, res, next) => {
    try {
        const studioId = req.user?.studio;
        const appointments = await AppointmentModel.find({ 
            studio: studioId, 
            status: { $in: ['scheduled', 'pending'] }
        })
            .populate('member', 'firstName lastName email')
            .populate('lead', 'firstName lastName email')
            .populate('studio', 'studioName')
            .populate('appointmentType', 'name');

        return res.status(200).json({
            success: true,
            count: appointments.length,
            appointments: appointments
        });
    } catch (error) {
        next(error);
    }
};

// ========================
// APPROVE APPOINTMENT
// ========================
const approvedAppointment = async (req, res, next) => {
    try {
        const { appointmentId } = req.params;
        const userId = req.user?._id;

        const appointment = await AppointmentModel.findById(appointmentId);
        if (!appointment) throw new NotFoundError("Invalid Appointment Id");

        const updatedAppointment = await AppointmentModel.findByIdAndUpdate(appointmentId, {
            $set: { status: "confirmed", view: "upcoming", approvedBy: userId, approvedAt: new Date() }
        }, { new: true });

        return res.status(200).json({
            success: true,
            appointment: updatedAppointment
        });
    } catch (error) {
        next(error);
    }
};

// ========================
// REJECT APPOINTMENT
// ========================
const rejectedAppointment = async (req, res, next) => {
    try {
        const { appointmentId } = req.params;
        const userId = req.user?._id;

        const appointment = await AppointmentModel.findById(appointmentId);
        if (!appointment) throw new NotFoundError("Invalid Appointment Id");

        const updatedAppointment = await AppointmentModel.findByIdAndUpdate(appointmentId, {
            $set: { status: "rejected", view: "canceled", rejectedBy: userId, rejectedAt: new Date() }
        }, { new: true });

        return res.status(200).json({
            success: true,
            appointment: updatedAppointment
        });
    } catch (error) {
        next(error);
    }
};

// ========================
// APPOINTMENT TYPES CRUD
// ========================

// Get all appointment types for a studio
const getAppointmentTypes = async (req, res, next) => {
    try {
        const studioId = req.user?.studio;

        if (!studioId) {
            throw new UnAuthorizedError("You are not assigned to any studio");
        }

        const appointmentTypes = await AppointmentTypeModel.find({ studioId })
            .populate('category', 'categoryName description')
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: appointmentTypes.length,
            types: appointmentTypes
        });
    } catch (error) {
        next(error);
    }
};

// Get single appointment type by ID
const getAppointmentTypeById = async (req, res, next) => {
    try {
        const { typeId } = req.params;
        const studioId = req.user?.studio;

        if (!studioId) {
            throw new UnAuthorizedError("You are not assigned to any studio");
        }

        const appointmentType = await AppointmentTypeModel.findOne({
            _id: typeId,
            studioId
        }).populate('category', 'categoryName description');

        if (!appointmentType) {
            throw new NotFoundError("Appointment type not found");
        }

        return res.status(200).json({
            success: true,
            type: appointmentType
        });
    } catch (error) {
        next(error);
    }
};

// Create appointment type
const createAppointmentTypes = async (req, res, next) => {
    try {
        const studioId = req.user?.studio;
        const userId = req.user?._id;

        if (!studioId) {
            throw new UnAuthorizedError("You are not assigned to any studio");
        }

        const {
            name,
            categoryId,
            contingentUsage,
            description,
            duration,
            interval,
            slot,
            maxParallel,
            calenderColor,
        } = req.body;

        if (!name) throw new BadRequestError("Name is required");
        if (!categoryId) throw new BadRequestError("Category ID is required");
        if (!duration || duration < 5) throw new BadRequestError("Duration must be at least 5 minutes");
        if (!interval || interval < 5) throw new BadRequestError("Interval must be at least 5 minutes");
        if (slot === undefined || slot === null || slot === "") throw new BadRequestError("Slots required is required");
        if (!maxParallel || maxParallel < 1) throw new BadRequestError("Max parallel must be at least 1");
        if (contingentUsage === undefined || contingentUsage === null || contingentUsage === "") throw new BadRequestError("Contingent usage is required");

        const category = await AppointmentCategoryModel.findById(categoryId);
        if (!category) throw new NotFoundError("Invalid category Id");

        const existingType = await AppointmentTypeModel.findOne({
            studioId,
            name: { $regex: new RegExp(`^${name}$`, 'i') }
        });
        if (existingType) throw new BadRequestError("Appointment type with this name already exists");

        let imageData = null;
        if (req.file) {
            const image = await uploadToCloudinary(req.file.buffer);
            imageData = {
                url: image.secure_url,
                public_id: image.public_id
            };
        }

        const type = await AppointmentTypeModel.create({
            studioId: studioId,
            name,
            category: categoryId,
            contingentUsage: contingentUsage || 1,
            description: description || "",
            duration: duration || 30,
            interval: interval || 30,
            slot: slot || 1,
            maxParallel: maxParallel || 1,
            calenderColor: calenderColor || "#FF843E",
            image: imageData,
            createdBy: userId
        });

        await StudioModel.findByIdAndUpdate(studioId, {
            $push: { appointmentTypes: type._id }
        }, { new: true });

        const populatedType = await AppointmentTypeModel.findById(type._id)
            .populate('category', 'categoryName description');

        return res.status(201).json({
            success: true,
            message: "Appointment type created successfully",
            type: populatedType
        });
    } catch (error) {
        next(error);
    }
};

// Update appointment type
const updateAppointmentTypes = async (req, res, next) => {
    try {
        const { typeId } = req.params;
        const studioId = req.user?.studio;
        const userId = req.user?._id;

        const {
            name,
            categoryId,
            contingentUsage,
            description,
            duration,
            interval,
            slot,
            maxParallel,
            calenderColor
        } = req.body;

        if (!studioId) {
            throw new UnAuthorizedError("You are not assigned to any studio");
        }

        const appointmentType = await AppointmentTypeModel.findOne({
            _id: typeId,
            studioId
        });

        if (!appointmentType) {
            throw new NotFoundError("Appointment type not found");
        }

        if (categoryId) {
            const category = await AppointmentCategoryModel.findById(categoryId);
            if (!category) throw new NotFoundError("Invalid category Id");
            appointmentType.category = categoryId;
        }

        if (name && name !== appointmentType.name) {
            const existingType = await AppointmentTypeModel.findOne({
                studioId,
                name: { $regex: new RegExp(`^${name}$`, 'i') },
                _id: { $ne: typeId }
            });
            if (existingType) {
                throw new BadRequestError("Appointment type with this name already exists");
            }
            appointmentType.name = name;
        }

        if (req.file) {
            if (appointmentType.image?.public_id) {
                await cloudinary.uploader.destroy(appointmentType.image.public_id);
            }
            const image = await uploadToCloudinary(req.file.buffer);
            appointmentType.image = {
                url: image.secure_url,
                public_id: image.public_id
            };
        }

        if (contingentUsage !== undefined) appointmentType.contingentUsage = contingentUsage;
        if (description !== undefined) appointmentType.description = description;
        if (duration !== undefined) appointmentType.duration = duration;
        if (interval !== undefined) appointmentType.interval = interval;
        if (slot !== undefined) appointmentType.slot = slot;
        if (maxParallel !== undefined) appointmentType.maxParallel = maxParallel;
        if (calenderColor !== undefined) appointmentType.calenderColor = calenderColor;

        appointmentType.updatedBy = userId;
        appointmentType.updatedAt = Date.now();

        await appointmentType.save();

        const updatedType = await AppointmentTypeModel.findById(appointmentType._id)
            .populate('category', 'categoryName description');

        return res.status(200).json({
            success: true,
            message: "Appointment type updated successfully",
            type: updatedType
        });
    } catch (error) {
        next(error);
    }
};

// Delete appointment type
const deleteAppointmentTypes = async (req, res, next) => {
    try {
        const { typeId } = req.params;
        const studioId = req.user?.studio;

        if (!studioId) {
            throw new UnAuthorizedError("You are not assigned to any studio");
        }

        const appointmentType = await AppointmentTypeModel.findOne({
            _id: typeId,
            studioId
        });

        if (!appointmentType) {
            throw new NotFoundError("Appointment type not found");
        }

        if (appointmentType.image?.public_id) {
            await cloudinary.uploader.destroy(appointmentType.image.public_id);
        }

        await AppointmentTypeModel.findByIdAndDelete(typeId);

        await StudioModel.findByIdAndUpdate(studioId, {
            $pull: { appointmentTypes: typeId }
        });

        return res.status(200).json({
            success: true,
            message: "Appointment type deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};

// Bulk delete appointment types
const bulkDeleteAppointmentTypes = async (req, res, next) => {
    try {
        const { typeIds } = req.body;
        const studioId = req.user?.studio;

        if (!studioId) {
            throw new UnAuthorizedError("You are not assigned to any studio");
        }

        if (!typeIds || !Array.isArray(typeIds) || typeIds.length === 0) {
            throw new BadRequestError("Please provide an array of appointment type IDs to delete");
        }

        const appointmentTypes = await AppointmentTypeModel.find({
            _id: { $in: typeIds },
            studioId
        });

        if (appointmentTypes.length === 0) {
            throw new NotFoundError("No appointment types found to delete");
        }

        for (const type of appointmentTypes) {
            if (type.image?.public_id) {
                await cloudinary.uploader.destroy(type.image.public_id);
            }
        }

        const result = await AppointmentTypeModel.deleteMany({
            _id: { $in: typeIds },
            studioId
        });

        return res.status(200).json({
            success: true,
            message: `${result.deletedCount} appointment type(s) deleted successfully`,
            deletedCount: result.deletedCount
        });
    } catch (error) {
        next(error);
    }
};

// ========================
// MODULE EXPORTS
// ========================
module.exports = {
    createAppointment,
    getMyAppointment,
    cancelAppointment,
    allAppointments,
    appointmentByMemberId,
    createAppointmentByStaff,
    createBlockedAppointment,
    createBookingTrailByStaff,
    updateAppointmentById,
    deleteAppointmentById,
    getAllPendingAppointment,
    approvedAppointment,
    rejectedAppointment,

    createAppointmentTypes,
    updateAppointmentTypes,
    deleteAppointmentTypes,
    getAppointmentTypes,
    getAppointmentTypeById,
    bulkDeleteAppointmentTypes
};