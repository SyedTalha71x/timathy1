const mongoose = require('mongoose')
const AppointmentModel = require('../models/AppointmentModel');
const { MemberModel } = require('../models/Discriminators');
const StudioModel = require('../models/StudioModel');
const ServiceModel = require('../models/ServiceModel')
const { NotFoundError, UnAuthorizedError, BadRequestError } = require('../middleware/error/httpErrors')


// createAppointment


const createAppointment = async (req, res, next) => {
    try {
        const userId = req.user?._id


        let { service, date, timeSlotId, view } = req.body;

        if (!service || !date || !timeSlotId) throw new BadRequestError("Missing required Field")

        const serviceData = await ServiceModel.findById(service)
        if (!serviceData) throw new NotFoundError("Invalid Service ID")

        const member = await MemberModel.findById(userId)
        if (!member) throw new NotFoundError("Invalid Member Id ")
        const studioId = member?.studio;


        const studio = await StudioModel.findById(studioId)
        if (!studio) throw new NotFoundError("Invalid Studio Id")

        const existingAppointment = await AppointmentModel.findOne({
            studio: studioId,
            date,
            "timeSlot.start": timeSlotId.start
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
            service: service,
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

const getMyAppointment = async (req, res, next) => {
    try {
        const userId = req.user?._id
        const appointment = await AppointmentModel.find({ member: userId })
            .populate('service', 'name')
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
        const userId = req.user?._id;
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new NotFoundError("Invalid Appointment ID");
        }

        const appointment = await AppointmentModel.findOne({
            _id: id,
            member: userId, // make sure it belongs to the logged-in user
        });

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

module.exports = { createAppointment, getMyAppointment, cancelAppointment }