// corns/AppointmentCorns.js
const cron = require('node-cron');
const { AppointmentModel } = require('../models/AppointmentModel');
const { MemberModel } = require('../models/Discriminators');
const shiftModel = require('../models/ShiftModel');
const PostModel = require('../models/PostModel')
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
        let skippedCount = 0;

        for (const appointment of appointments) {
            try {
                // Validate required fields exist
                if (!appointment.date) {
                    console.warn(`Skipping appointment ${appointment._id}: missing date`);
                    skippedCount++;
                    continue;
                }

                if (!appointment.timeSlot) {
                    console.warn(`Skipping appointment ${appointment._id}: missing timeSlot object`);
                    skippedCount++;
                    continue;
                }

                if (!appointment.timeSlot.start) {
                    console.warn(`Skipping appointment ${appointment._id}: missing timeSlot.start`);
                    skippedCount++;
                    continue;
                }

                // Create appointment end time
                const appointmentDate = new Date(appointment.date);
                const [hours, minutes] = appointment.timeSlot.start.split(':');

                // Validate hours and minutes are numbers
                if (isNaN(parseInt(hours)) || isNaN(parseInt(minutes))) {
                    console.warn(`Skipping appointment ${appointment._id}: invalid time format "${appointment.timeSlot.start}"`);
                    skippedCount++;
                    continue;
                }

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
            } catch (appointmentError) {
                console.error(`Error processing appointment ${appointment._id}:`, appointmentError.message);
                skippedCount++;
            }
        }

        console.log(`Cron ran: checked ${appointments.length} appointments, updated ${updatedCount}, skipped ${skippedCount}`);
        return { checked: appointments.length, updated: updatedCount, skipped: skippedCount };
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
                $set: { status: "archived", memberType: 'archived', isArchived: true }
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

// Example cron job function to publish scheduled posts
const publishScheduledPosts = async () => {
    try {
        const now = new Date();
        console.log(`Running Post update at: ${now.toISOString()}`);

        // Find all scheduled posts whose schedule time has passed
        const postsToPublish = await PostModel.find({
            status: 'scheduled',
            scheduleDate: { $lte: now }
        });

        for (const post of postsToPublish) {
            post.status = 'active';
            post.publishedAt = now;
            await post.save();

            console.log(`Published scheduled post: ${post._id}`);
        }
    } catch (error) {
        console.error('Error publishing scheduled posts:', error);
    }
};

// Run every minute (using node-cron or similar)

// Run once immediately on startup
const runInitialUpdates = async () => {
    // console.log('Running initial updates on startup...');
    await publishScheduledPosts();
    await updatePastAppointments();
    await updateTemporaryMember();
    await updateShifts()
};

// Schedule cron jobs
const startCronJobs = () => {

    cron.schedule('0 * * * *', publishScheduledPosts);
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