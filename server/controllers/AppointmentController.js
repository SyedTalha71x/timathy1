const mongoose = require('mongoose')
const AppointmentModel = require('../models/AppointmentModel');
const { MemberModel } = require('../models/Discriminators');
const StudioModel = require('../models/StudioModel');
const ServiceModel = require('../models/ServiceModel')
const { NotFoundError, UnAuthorizedError, BadRequestError } = require('../middleware/error/httpErrors');
const LeadModel = require('../models/LeadModel');

// createAppointment


const createAppointment = async (req, res, next) => {
    try {
        const userId = req.user?._id


        let { serviceId, date, timeSlotId, view } = req.body;

        if (!serviceId || !date || !timeSlotId) throw new BadRequestError("Missing required Field")

        const serviceData = await ServiceModel.findById(serviceId)
        if (!serviceData) throw new NotFoundError("Invalid serviceId ID")

        const member = await MemberModel.findById(userId)
        if (!member) throw new NotFoundError("Invalid Member Id ")
        const studioId = member?.studio;


        const studio = await StudioModel.findById(studioId)
        if (!studio) throw new NotFoundError("Invalid Studio Id")

        const existingAppointment = await AppointmentModel.findOne({
            studio: studioId,
            date,
            "timeSlot.start": timeSlotId.start,
            "timeSlot.isBlocked": timeSlotId.isBlocked,
        })

        if (existingAppointment) throw new BadRequestError("TimeSlot already Booked")
        const today = new Date();
        const selectedDate = new Date(date);
        let status = "confirmed";
        if (selectedDate < new Date(today.getFullYear(), today.getMonth(), today.getDate())) {
            status = "completed";
            view = 'past';
        }
        const appointment = await AppointmentModel.create({
            member: userId,
            studio: studioId,
            serviceId: serviceId,
            date,
            timeSlot: timeSlotId,
            view,
            // notes,
            status
        })

        await MemberModel.findByIdAndUpdate(userId, {
            $push: { appointments: appointment._id }
        }, { new: true })

        serviceData.contingentUsage -= 1;
        await serviceData.save();


        return res.status(201).json({
            success: true,
            appointment
        })

    }
    catch (error) {
        next(error);
    }
}

const createBlockedAppointment = async (req, res, next) => {
    try {
        const userId = req.user?._id
        let { startDate, endDate, timeSlot, serviceId, note } = req.body; // Changed to startDate/endDate

        if (!startDate || !endDate || !timeSlot || !timeSlot.start || !timeSlot.end) {
            throw new BadRequestError("Missing required fields for blocked appointment");
        }

        const service = await ServiceModel.findById(serviceId);
        if (!service) throw new NotFoundError("Invalid service id");

        const studioId = req.user?.studio;
        const studio = await StudioModel.findById(studioId);
        if (!studio) throw new NotFoundError("Invalid Studio Id");

        // Create blocked appointments for each date in the range
        const start = new Date(startDate);
        const end = new Date(endDate);
        const appointments = [];

        for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
            const currentDate = date.toISOString().split('T')[0];

            // Check if slot is already booked or blocked for this date
            const existingAppointment = await AppointmentModel.findOne({
                studio: studioId,
                date: currentDate,
                "timeSlot.start": timeSlot.start,
                "timeSlot.end": timeSlot.end,
            });

            if (!existingAppointment) {
                // Create blocked appointment for this date
                const appointment = await AppointmentModel.create({
                    serviceId: serviceId,
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
    }
    catch (error) {
        next(error);
    }
};

// create Appointment for member by staff
// const mongoose = require("mongoose");

const createAppointmentByStaff = async (req, res, next) => {
    try {
        const userId = req.user?._id;
        const { memberId } = req.params;
        const studioId = req.user?.studio;

        const {
            serviceId,
            date,
            timeSlotId,
            view,
            bookingType = "single",
            frequency,
            occurrences = 1,
        } = req.body;

        if (!serviceId || !date || !timeSlotId)
            throw new BadRequestError("Missing required field");

        const serviceData = await ServiceModel.findById(serviceId);
        if (!serviceData)
            throw new NotFoundError("Invalid serviceId ID");

        const member = await MemberModel.findById(memberId);
        if (!member)
            throw new NotFoundError("Invalid Member ID");

        const existingAppointment = await AppointmentModel.findOne({
            studio: studioId,
            date,
            "timeSlot.start": timeSlotId.start,
            "timeSlot.isBlocked": timeSlotId.isBlocked,
        })
        if (existingAppointment) throw new BadRequestError("TimeSlot already Booked")
        const today = new Date();
        const selectedDate = new Date(date);
        let status = "confirmed";
        if (selectedDate < new Date(today.getFullYear(), today.getMonth(), today.getDate())) {
            status = "completed";
            view = 'past';
        }

        // SINGLE BOOKING
        if (bookingType === "single") {
            const appointment = await AppointmentModel.create({
                member: memberId,
                studio: studioId,
                serviceId: serviceId,
                date,
                timeSlot: timeSlotId,
                view,
                bookingType: "single",
                status,
            });

            await MemberModel.findByIdAndUpdate(memberId, {
                $push: { appointments: appointment._id },
            });

            serviceData.contingentUsage -= 1;
            await serviceData.save();

            return res.status(201).json({
                success: true,
                appointment,
            });
        }

        // RECURRING BOOKING
        if (bookingType === "recurring") {
            if (!frequency || !occurrences)
                throw new BadRequestError("Missing recurring details");

            // const recurringGroupId = new mongoose.Types.ObjectId();
            let appointments = [];
            let currentDate = new Date(date);

            for (let i = 0; i < occurrences; i++) {
                appointments.push({
                    member: memberId,
                    studio: studioId,
                    serviceId: serviceId,
                    date: new Date(currentDate),
                    timeSlot: timeSlotId,
                    view,
                    bookingType: "recurring",
                    frequency,
                    occurrences,
                    // recurringGroupId,
                    status,
                });

                if (frequency === "daily")
                    currentDate.setDate(currentDate.getDate() + 1);

                if (frequency === "weekly")
                    currentDate.setDate(currentDate.getDate() + 7);

                if (frequency === "monthly")
                    currentDate.setMonth(currentDate.getMonth() + 1);
            }

            const createdAppointments =
                await AppointmentModel.insertMany(appointments);

            await MemberModel.findByIdAndUpdate(memberId, {
                $push: {
                    appointments: {
                        $each: createdAppointments.map(a => a._id),
                    },
                },
            });
            if (serviceData.contingentUsage < occurrences)
                throw new BadRequestError("No remaining contingent");
            serviceData.contingentUsage -= occurrences;
            await serviceData.save();

            return res.status(201).json({
                success: true,
                appointments: createdAppointments,
            });
        }

    } catch (error) {
        next(error);
    }
};

const createBookingTrailByStaff = async (req, res, next) => {
    try {
        const userId = req.user?._id;
        const studioId = req.user?.studio;
        const { leadId } = req.params;

        const {
            serviceId,
            date,
            timeSlotId,
        } = req.body;

        if (!serviceId || !date || !timeSlotId)
            throw new BadRequestError("Missing required field");


        console.log("BODY:", req.body);
        console.log("PARAMS:", req.params);

        const serviceData = await ServiceModel.findById(serviceId);
        if (!serviceData)
            throw new NotFoundError("Invalid serviceId ID");

        const lead = await LeadModel.findById(leadId);
        if (!lead)
            throw new NotFoundError("Invalid Member ID");

        const existingAppointment = await AppointmentModel.findOne({
            studio: studioId,
            date,
            "timeSlot.start": timeSlotId.start,
            "timeSlot.isBlocked": timeSlotId.isBlocked,
        })
        if (existingAppointment) throw new BadRequestError("TimeSlot already Booked")
        const today = new Date();
        const selectedDate = new Date(date);

        let status = "confirmed";

        if (selectedDate < new Date(today.getFullYear(), today.getMonth(), today.getDate())) {
            status = "completed";
            view = 'past';
        }


        // SINGLE BOOKING

        const appointment = await AppointmentModel.create({
            lead: leadId,
            studio: studioId,
            serviceId: serviceId,
            date,
            timeSlot: timeSlotId,
            view: "upcoming",
            bookingType: "single",
            status,
            isTrial: true,

        })
        await LeadModel.findByIdAndUpdate(leadId, {
            $push: { appointments: appointment._id },
        });

        serviceData.contingentUsage -= 1;
        await serviceData.save();

        return res.status(201).json({
            success: true,
            appointment,
        });
    } catch (error) {
        next(error);
    }
}

const getMyAppointment = async (req, res, next) => {
    try {
        const userId = req.user?._id
        const appointment = await AppointmentModel.find({ member: userId })
            .populate('serviceId', 'name')
            .populate('studio', 'studioName')
            .sort({ createdAt: -1 })
        if (!appointment || appointment.length === 0) throw new NotFoundError("No Appointment Booked")
        return res.status(200).json({
            success: true,
            appointment
        })
    }
    catch (error) {
        return next(error)
    }
}


const cancelAppointment = async (req, res, next) => {
    try {
        const { appointmentId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
            throw new NotFoundError("Invalid Appointment ID");
        }

        // Find appointment by ID only, no ownership check
        const appointment = await AppointmentModel.findById(appointmentId);

        if (!appointment) {
            throw new NotFoundError("Appointment not found");
        }

        if (appointment.status === "canceled") {
            return res.status(400).json({
                message: "Appointment is already canceled",
            });
        }

        if (appointment.status === "completed") {
            return res.status(400).json({
                message: "Completed appointments cannot be canceled",
            });
        }

        appointment.status = "canceled";
        appointment.view = "past";
        await appointment.save();

        return res.status(200).json({
            message: "Appointment successfully canceled",
            appointment,
        });
    } catch (error) {
        next(error);
    }
};

const allAppointments = async (req, res, next) => {
    try {
        const appointment = await AppointmentModel.find()
            .populate('member', 'firstName lastName')
            .populate('lead', 'firstName lastName')
            .populate('studio', 'studioName')
            .populate('serviceId', 'name')
            .sort({ createdAt: -1 });
        if (!appointment || appointment.length === 0) throw new NotFoundError("No Appointment Booked")
        return res.status(200).json({
            success: true,
            appointments: appointment
        })
    }
    catch (error) {
        next(error)
    }
}

const appointmentByMemberId = async (req, res, next) => {
    try {
        const { memberId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(memberId)) {
            throw new NotFoundError("Invalid Member ID");
        }

        const now = new Date();

        // Find only appointments with date >= today
        const appointment = await AppointmentModel.find({
            member: memberId,
            date: { $gte: now }
        })
            .populate('member', 'firstName lastName')
            .populate('serviceId', 'name')
            .populate('studio', 'studioName')
        //   .sort({ date: -1 }); // soonest first

        return res.status(200).json({
            success: true,
            appointment: appointment || [],
        });
    } catch (error) {
        next(error);
    }
};


// update appointment
const updateAppointmentById = async (req, res, next) => {
    try {
        const userId = req.user?._id;
        const { appointmentId } = req.params;

        const updateData = req.body;

        const appointment = await AppointmentModel.findById(appointmentId)
        if (!appointment) throw new NotFoundError("Invalid appointment Id")
        const updatedAppointment = await AppointmentModel.findByIdAndUpdate(appointmentId, { $set: updateData }, { new: true })


        if (!updatedAppointment) throw new BadRequestError("Invalid data")
        return res.status(200).json({
            success: true,
            appointment: updatedAppointment
        })


    }
    catch (error) {
        next(error)
    }
}

// delete Appointment
const deleteAppointmentById = async (req, res, next) => {
    try {
        const userId = req.user?._id
        const { appointmentId } = req.params

        const appointment = await AppointmentModel.findById(appointmentId)

        if (!appointment) throw new NotFoundError("Invalid Appointment Id")

        await MemberModel.findByIdAndUpdate(appointment.member, {
            $pull: { appointments: appointment._id }
        }, { new: true })

        await AppointmentModel.findByIdAndDelete(appointmentId)
        return res.status(200).json({
            success: true,
            message: "Appointment Deleted Successfully"
        })

    }
    catch (error) {
        next(error)
    }
}




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
    deleteAppointmentById
}