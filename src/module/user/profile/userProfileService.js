const createError = require('http-errors');
const userProfileModel = require("./userProfileModel");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const sendEmail = require('../../../utils/email');
const userOtpModel = require('../../auth/verification/userOtpModel');

/**
 * @module User/Profile/Service
 */

/**
 * @typedef {Object} Response - The response object from the service to the controller
 * @property {boolean} success - The success status of the request
 * @property {string} message - The message associated with the request
 * @property {Object} data - The data associated with the request
 */


/**
 * Registers a new user in the system.
 * @function userRegistrator
 * @param {Object} userData - The user data including email, username, and picture.
 * @return {Response} An object with success status and a message indicating the registration result.
 * @throws {Error} If the email or username already exists.
 * @see module:User/Profile/Controller~userRegisterController
 */
exports.userRegistrator = async (userData) => {

    const existingEmail = await userProfileModel.findOne({ email: userData.email });
    const existingUsername = await userProfileModel.findOne({ userName: userData.userName });
    if (existingEmail) {
        throw createError(409, 'Email already exists');
    } else if (existingUsername) {
        throw createError(409, 'Username already exists');
    } else {
        await new userProfileModel(userData).save();
        return { success: true, message: 'user  registation successful' };
    }
}

/**
 * Authenticates a user based on login credentials and returns a token.
 *
 * @param {object} loginData - The login credentials.
 * @param {string} loginData.email - The email address of the user.
 * @param {string} loginData.password - The password of the user.
 * @return {Response} An object containing the success status, a message, the user data, and a token.
 * @throws {Error} If the email and password do not match.
 * @throws {Error} If the user is unverified.
 * @throws {Error} If there is an error during authentication.
 */
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
    const token = jwt.sign({ userType: user?.userType, id: user._id, email: user.email }, process.env.JWT_SECRET);
    return {
        success: true,
        message: 'Login Successful',
        data: user,
        token,
    };
}

/**
 * Generates an OTP and sends it to the user's email address.
 *
 * @param {string} email - The email address of the user.
 * @param {string} emailSubject - The subject of the email.
 * @return {Response} An object containing the success status and a message.
 */
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

/**
 * Verify the OTP for a given email.
 *
 * @param {string} email - The email for which the OTP is being verified.
 * @param {number} otp - The OTP code to be verified.
 * @return {Response} - An object indicating the success of the OTP verification.
 */
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

/**
 * Updates the user profile for the given user ID with the provided update data.
 *
 * @param {string} userId - The ID of the user whose profile is being updated.
 * @param {object} updateData - The data to update the user profile with.
 * @return {Response} - An object containing the updated user profile.
 */
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

/**
 * Updates the status of a user's profile to 'verified' based on the provided email.
 *
 * @param {string} email - The email of the user whose profile status needs to be updated.
 * @return {Response} - An object indicating the success of the operation and a message.
 */
exports.userVerifiyService = async (email) => {
    await userProfileModel.findOneAndUpdate({ email: email }, { status: 'verified' });
    return { success: true, message: 'Email verified successfully' }
}

/**
 * Updates the password for a user.
 *
 * @param {string} email - The email of the user.
 * @param {string} password - The new password to set.
 * @return {Response} - An object indicating the success of the operation and a message.
 */
exports.updatePasswordService = async (email, password) => {
    const hashPassword = bcrypt.hashSync(password, 10);
    await userProfileModel.findOneAndUpdate({ email }, { password: hashPassword });
    return { success: true, message: 'Password updated successfully' }
}
