const { userRegistrationSchema, userLoginSchema, userEmailSchema } = require("./userProfileValidation");
const { userRegistrator, userLoginService, userOtpService } = require("./userProfileService");
const userProfileModel = require("./userProfileModel");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const createError = require('http-errors');


exports.userRegisterController = async (req, res, next) => {

    try {
        const userData = req.body;
        const verifiedData = await userRegistrationSchema.validateAsync(userData);
        const result = await userRegistrator(verifiedData);
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
}



exports.userLogoutController = (req, res, next) => {
    try {
        res.status(200).json({ message: 'Logout successful' });

    } catch (error) {
        next(error);
    }
};




exports.otp = (req, res, next) => {
    try {
        const otp = Math.floor(100000 + Math.random() * 900000);
        res.status(200).json({ otp });
    } catch (error) {
        next(error);
    }
}




exports.otpSendController = async (req, res, next) => {
    try {
        const { email, emailSubject } = req.body;
        const result = await userOtpService(email, emailSubject, userProfileModel);
        res.status(200).json(result);
    } catch (error) {
        next(error)
    }

}

// Password Reset 

exports.userPasswordResetController = async (req, res, next) => {

    try {
        const { email } = req.query;

        const verifiedEmail = await userEmailSchema.validateAsync(email);

        const user = await userProfileModel.findOne({ email: verifiedEmail });
        if (!user) {
            throw createError(404, 'User not found');
        }
        const result = await userOtpService(email, "Reset Password");
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}