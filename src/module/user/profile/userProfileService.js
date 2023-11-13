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
        throw createError(404, 'User not found');
    }
    const isMatch = await bcrypt.compare(loginData.password, user.password);
    if (!isMatch) {
        throw createError(401, 'Password Mismatch');
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

