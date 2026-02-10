const cron = require('node-cron')
const AppointmentModel = require('../models/AppointmentModel');
const updatePastAppointments = async () => {
    try {
        const now = new Date(new Date().toISOString())


        const appointments = await AppointmentModel.find({
            status: 'confirmed',
            view: 'upcoming',
        })

        for (const appointment of appointments) {
            const appointmentDate = new Date(appointment.date)

            const [hours, minutes] = appointment.timeSlot.start.split(':')
            appointmentDate.setHours(hours, minutes, 0, 0)

            if (appointmentDate < now) {
                appointment.status = 'completed'
                appointment.view = 'past'
                await appointment.save()
            }
        }

        console.log('Cron ran: appointments checked', appointments.length)
    } catch (error) {
        console.error('Cron error:', error)
    }
}


cron.schedule('0 * * * *', () => {
    console.log('Running appointment cron...')
    updatePastAppointments()
})