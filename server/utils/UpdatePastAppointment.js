const AppointmentModel = require('../models/AppointmentModel')
const cron = require('node-cron')


const updatePastAppointments = async () => {
    const now = new Date();

    await AppointmentModel.updateMany(
        { date: { $lt: now }, status: "confirmed", view: "upcoming" },
        { $set: { status: 'completed', view: 'past' } }
    )
}



cron.schedule('0 * * * * ', () => {
    updatePastAppointments();
});