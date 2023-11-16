const { userRegistrationSchema, userLoginSchema, userEmailSchema } = require("./userProfileValidation");
const { userRegistrator, userLoginService, userOtpService, otpVerifyService } = require("./userProfileService");
const userProfileModel = require("./userProfileModel");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const sendEmail = require("../../../utils/email");
const userOtpModel = require("./userOtpModel");


exports.userRegisterController = async (req, res, next) => {

    try {

        const result = await userRegistrator(req.body);
        res.status(200).json(result);

    } catch (error) {
        next(error)
    }
}




exports.userLoginController = async (req, res, next) => {

    try {
        const loginData = await userLoginSchema.validateAsync(req.body);
        const result = await userLoginService(loginData);
        res.status(200).json(result);

    } catch (error) {
        next(error)
    }
};

exports.userLogoutController = (req, res, next) => {
    try {
        res.status(200).json({ message: 'Logout successful' });

    } catch (error) {
        next(error);
    }
};




// exports.otp = (req, res, next) => {
//     try {
//         const otp = Math.floor(100000 + Math.random() * 900000);
//         res.status(200).json({ otp });
//     } catch (error) {
//         next(error);
//     }
// }




exports.otpSendController = async (req, res, next) => {

    try {
        const { email, emailSubject } = req.body;
        const result = await userOtpService(email, emailSubject, userProfileModel);
        res.status(200).json(result);
    } catch (error) {
        console.log(error)
        next(error)
    }
}

// otp verifyController
exports.otpVerifyController = async (req, res, next) => {
    try {
        const { email, otp } = req.body;
        // Verify OTP
        const result = await otpVerifyService(email, otp);
        res.status(200).json(result);
    } catch (error) {
        console.log(error);
        next(error);
    }
};


// Password Reset 

exports.userForgetPasswordController = async (req, res, next) => {
    const { email } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    try {
        const user = await userProfileModel.findOne({ email }
        )
        if (!user) createError(404, "User Not Found");

        await userOtpModel.updateOne({ email }, { 'otp.code': otp }, { upsert: true });

        // send Email with OTP
        const emailData = {
            to: email,
            subject: 'Password Reset OTP',
            html: `Your OTP is ${otp}`
        }
        await sendEmail(emailData);
        res.status(200).json({ message: "Your Password Reset OTP Send Successfully" });
    } catch (error) {
        console.log(error);
        next(error);
    }
}

// Verify OTP and reset Password Controller

exports.userUpdatePasswordController = async (req, res, next) => {

    try {
        const { email, otp, newPassword } = req.body;
        // verify Otp user means otp
        const user = await userOtpModel.findOne({ email, 'otp.code': otp });
        if (!user) {
            return res.status(400).json({ message: "Invalid OTP" });
        }
        // Update Password and clear OTP

        user.password = newPassword;
        user.otp.code = 0
        await user.save();
        return res.status(200).json({ message: "Password Update Successful" })
    } catch (error) {
        console.error(error);
        next(error);

    }
}


exports.userProfileController = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const profile = await userProfileModel.findById(userId, { password: 0 });

        return res.status(200).json(profile);

    } catch (error) {
        next(error)
    }
};

exports.userProfileUpdateController = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const updateData = req.body;

        const result = await userProfileUpdateService(userId, updateData);

        return res.status(200).json(result);

    } catch (error) {
        next(error)
    }
};
