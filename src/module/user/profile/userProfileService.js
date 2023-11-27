const createError = require('http-errors');
const userProfileModel = require("./userProfileModel");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const sendEmail = require('../../../utils/email');
const userOtpModel = require('../../auth/verification/userOtpModel');


// registration
exports.userRegistrator = async (userData) => {
    const picture = 'https://res.cloudinary.com/dscxtnb94/image/upload/v1700723393/health_plus/user/download_dxmyep.png'

    const existingEmail = await userProfileModel.findOne({ email: userData.email });
    const existingUsername = await userProfileModel.findOne({ userName: userData.userName });
    if (existingEmail) {
        throw createError(409, 'Email already exists');
    } else if (existingUsername) {
        throw createError(409, 'Username already exists');
    } else {
        if (!userData.picture) {
            userData.picture = picture;
        }
        await new userProfileModel(userData).save();
        return { success: true, message: 'user  registation successful' };
    }
}

exports.userLoginService = async (loginData) => {
    const user = await userProfileModel.findOne({ email: loginData.email })
    // .lean();
    if (!user) {
        throw createError(401, 'email and password mismatch');
    }

    if (user.status === 'unverified') {
        throw createError(401, 'Please verify your email');
    }

    const isMatch = await bcrypt.compare(loginData.password, user.password);

    user.password = undefined

    if (!isMatch) {
        throw createError(401, 'email and password mismatch');
    }
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET);
    return {
        success: true,
        message: 'Login Successful',
        data: user,
        token,
    };
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

    if (!email || !otp || otp == 0) {
        throw createError(400, 'Email and OTP are required');
    }
    const userOtp = await userOtpModel.findOne({ email: email });

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
    updateData.email = undefined
    updateData.password = undefined
    const profileUpdate = await userProfileModel.findByIdAndUpdate(userId, updateData, { new: true });
    profileUpdate.password = undefined;
    return {
        success: true,
        message: 'user profile has been Updated!',
        data: profileUpdate
    };
}


exports.userVerifiyService = async (email) => {
    await userProfileModel.findOneAndUpdate({ email: email }, { status: 'verified' });
    return { success: true, message: 'Email verified successfully' }
}


exports.updatePasswordService = async (email, password) => {
    const hashPassword = bcrypt.hashSync(password, 10);
    await userProfileModel.findOneAndUpdate({ email }, { password: hashPassword });
    return { success: true, message: 'Password updated successfully' }
}