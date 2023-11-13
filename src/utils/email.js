const nodemailer = require('nodemailer');

const sendEmail = async (option) => {
    // create a transporter
    const transporter = nodemailer.createTransport({
        service: "gmail",
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'minarfwd@gmail.com',
            pass: 'leyz vrti nfrd kevu'
        }
    });


    // const transporter = nodemailer.createTransport({
    //     service: "gmail",
    //     host: "smtp.gmail.com",
    //     port: 587,
    //     secure: false,
    //     auth: {
    //         user: SMTP_USER_NAME,
    //         pass: SMTP_USER_PASSWORD,
    //     },
    // });

    // Define Email Options

    const mailOptions = {
        from: 'Bongo Coders, <nunurma@gmail.com>',
        to: option.to,
        subject: option.subject,
        text: option.html
    }
    console.log(option)

    await transporter.sendMail(mailOptions)

}

module.exports = sendEmail;