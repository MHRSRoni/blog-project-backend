const nodemailer = require('nodemailer');

const sendEmail = async (option) => {
    // create a transporter
    const transporter = nodemailer.createTransport({
        service: "gmail",
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });


    // Define Email Options
    const mailOptions = {
        from: 'Health Plus, <healthplus.bongocoders@gmail.com>',
        to: option.to,
        subject: option.subject,
        html: option.html
    }

    const result = await transporter.sendMail(mailOptions)
}

module.exports = sendEmail;