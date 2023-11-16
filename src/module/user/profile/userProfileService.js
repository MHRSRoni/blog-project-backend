const createError = require('http-errors');
const userProfileModel = require("./userProfileModel");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const sendEmail = require('../../../utils/email');
const userOtpModel = require('./userOtpModel');


// registration
exports.userRegistrator = async (userData) => {

    const existingEmail = await userProfileModel.findOne({ email: userData.email });
    if (existingEmail) {
        throw createError(409, 'Email already exists');
    } else {
        const newUser = await new userProfileModel(userData).save();
        return newUser;
    }
}

exports.userLoginService = async (loginData) => {

    const user = await userProfileModel.findOne({ email: loginData.email });

    if (!user) {
        throw createError(401, 'email and password mismatch');
    }

    if (user.status === 'unverified') {
        throw createError(401, 'Please verify your email');
    }

    const isMatch = await bcrypt.compare(loginData.password, user.password);
    if (!isMatch) {
        throw createError(401, 'email and password mismatch');
    }

    const { password, ...rest } = user._doc
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET);
    return { success: true, message: 'Login Successful', token, ...rest };
}


// otp service

exports.userOtpService = async (email, emailSubject) => {

    if (!email) {
        throw createError(404, 'User not found');
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    const emailData = {
        to: email,
        subject: emailSubject,
        html: `Your OTP is :  ${otp}`
    }
    await userOtpModel.updateOne({ email: email }, { "otp.code": otp }, { upsert: true });
    const sendmail = await sendEmail(emailData);

    return {
        success: true,
        message: 'OTP sent successfully',
    }
}

// Assuming userOtpModel is the Mongoose model for OTPs
exports.otpVerifyService = async (email, otp) => {
    console.log(email, otp)

    if (!email || !otp || otp == 0) {
        throw createError(400, 'Email and OTP are required');
    }
    const userOtp = await userOtpModel.findOne({ email: email });
    // console.log("above condition: ->", userOtp.otp.code)

    if (userOtp.otp.code == otp) {
        await userOtpModel.findOneAndUpdate({ email: email, "otp.code": otp }, { 'otp.code': 0 });
        return {
            success: true,
            message: 'OTP verification successful',
        };
    } else {
        throw createError(401, 'Unauthorized: Incorrect or missing OTP');
    }
};

exports.userProfileUpdateService = async (userId, updateData) => {
    const existingUsername = await userProfileModel.findOne({ userName: updateData.userName });

    if (existingUsername) {
        throw createError.Conflict('Username already exists');
    }

    const profileUpdate = await userProfileModel.findByIdAndUpdate(userId, updateData, { new: true });

    return {
        success: true,
        message: 'user profile has been Updated!',
        data: profileUpdate
    };
}
