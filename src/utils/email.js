const nodemailer = require('nodemailer');

const sendEmail = async (option) => {
    // create a transporter

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
            user: process.env.SMTP_USERNAME,
            pass: process.env.SMTP_PASSWORD
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    // Define Email Options
    const mailOptions = {
        from: 'Bongo Coders, <nunurma@gmail.com>',
        to: option.email,
        subject: option.subject,
        text: option.message
    }

    await transporter.sendMail(mailOptions)

}

module.exports = sendEmail;