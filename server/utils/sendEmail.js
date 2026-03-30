require('dotenv').config();
const nodemailer = require('nodemailer');
const EmailModel = require('../models/EmailModel');

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    secure: false, // false for TLS
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

transporter.verify((error, success) => {
    if (error) console.error("SMTP connection failed:", error);
    else console.log("SMTP server is ready");
});

/**
 * Sends an email and logs it in the database
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} text - Email body text
 * @param {string} html - Optional HTML body
 */
const sendEmail = async (to, subject, text, html = null) => {
    try {
        const from = `"FitnessApp" <${process.env.EMAIL_USER}>`;
        const body = html || text;

        // Send email
        await transporter.sendMail({ from, to, subject, text, html: body });

        // Save to database
        const email = new EmailModel({ from, to, subject, body, status: "sent" });
        await email.save();

    } catch (error) {
        console.log('❌ Email Error:', error.message);
        throw new Error("Email could not be sent");
    }
}

module.exports = sendEmail;