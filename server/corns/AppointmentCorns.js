// corns/AppointmentCorns.js
const cron = require('node-cron');
const AppointmentModel = require('../models/AppointmentModel');
const { MemberModel } = require('../models/Discriminators');
const shiftModel = require('../models/ShiftModel');

// Update past appointments
const updatePastAppointments = async () => {
    try {
        const now = new Date();
        console.log(`Running appointment update at: ${now.toISOString()}`);

        // Find confirmed appointments that are still marked as upcoming
        const appointments = await AppointmentModel.find({
            status: 'confirmed',
            view: 'upcoming',
        });

        let updatedCount = 0;

        for (const appointment of appointments) {
            // Create appointment end time
            const appointmentDate = new Date(appointment.date);
            const [hours, minutes] = appointment.timeSlot.start.split(':');
            appointmentDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

            // Add appointment duration to get end time
            const duration = appointment.timeSlot.duration || 60; // default 60 minutes
            const appointmentEndTime = new Date(appointmentDate.getTime() + duration * 60000);

            // Check if appointment has ended
            if (appointmentEndTime < now) {
                appointment.status = 'completed';
                appointment.view = 'past';
                await appointment.save();
                updatedCount++;
                console.log(`Updated appointment ${appointment._id} to completed`);
            }
        }

        console.log(`Cron ran: checked ${appointments.length} appointments, updated ${updatedCount}`);
        return { checked: appointments.length, updated: updatedCount };
    } catch (error) {
        console.error('Cron error in updatePastAppointments:', error);
        return { error: error.message };
    }
};

// Update temporary members
const updateTemporaryMember = async () => {
    try {
        const now = new Date();
        console.log(`Running member update at: ${now.toISOString()}`);

        const result = await MemberModel.updateMany(
            {
                memberType: "temporary",
                archivedAt: { $lte: now },
                status: { $ne: "archived" }
            },
            {
                $set: { status: "archived", memberType: 'archived' }
            }
        );

        console.log(`Archived ${result.modifiedCount} temporary members`);
        return { modifiedCount: result.modifiedCount };
    } catch (error) {
        console.error("Cron error in updateTemporaryMember:", error);
        return { error: error.message };
    }
};

const updateShifts = async () => {
    try {
        const now = new Date()
        console.log(`running shift updated at:${now.toISOString()}`)

        const result = await shiftModel.updateMany({
            checkedIn: true,
            endTime: { $lte: now },
            status: { $ne: 'scheduled' }
        }, {
            $set: {
                status: 'completed',
            }
        })
        console.log(`completed ${result.modifiedCount} staff shifts`);
        return { modifiedCount: result.modifiedCount }
    }
    catch (error) {
        console.error("Cron error in updating shifts:", error);
        return { error: error.message };
    }
}
// Run once immediately on startup
const runInitialUpdates = async () => {
    // console.log('Running initial updates on startup...');
    await updatePastAppointments();
    await updateTemporaryMember();
    await updateShifts()
};

// Schedule cron jobs
const startCronJobs = () => {
    // Run every hour at minute 0
    // cron.schedule('0 * * * *', async () => {
    //     console.log('=== Hourly Cron Job Started ===');
    //     try {
    //         await updatePastAppointments();
    //         await updateTemporaryMember();
    //     } catch (error) {
    //         console.error('Cron job execution error:', error);
    //     }
    //     console.log('=== Hourly Cron Job Completed ===');
    // });

    // // Optional: Run every 5 minutes for more frequent updates
    // cron.schedule('*/5 * * * *', async () => {
    //     console.log('=== 5-Minute Cron Job Started ===');
    //     try {
    //         await updatePastAppointments();
    //     } catch (error) {
    //         console.error('5-minute cron error:', error);
    //     }
    // });

    // Run at midnight for daily maintenance
    cron.schedule('0 0 * * *', async () => {
        console.log('=== Daily Maintenance Cron Started ===');
        try {
            await updateTemporaryMember();
            await updatePastAppointments();
            await updateShifts()

            // Add any other daily cleanup tasks here
        } catch (error) {
            console.error('Daily maintenance cron error:', error);
        }
    });

    console.log('Cron jobs scheduled successfully');
};

module.exports = {
    updatePastAppointments,
    updateTemporaryMember,
    updateShifts,
    startCronJobs,
    runInitialUpdates
};