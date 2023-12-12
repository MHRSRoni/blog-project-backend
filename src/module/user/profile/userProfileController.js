const { userLoginSchema, passwordSetSchema } = require("./userProfileValidation");
const { userRegistrator, userLoginService, userVerifiyService, updatePasswordService, userProfileUpdateService } = require("./userProfileService");
const userProfileModel = require("./userProfileModel");
const userOtpModel = require("../../auth/verification/userOtpModel");
const createError = require('http-errors');
const createToken = require("../../../utils/createToken");
const {Request, Response, NextFunction} = require("express");
const bcrypt = require('bcrypt');

/**
 * @module User/Profile/Controller
 * @description This is the controller that handles user profile requests.
 */

/**
 * @typedef GeneratedResponse 
 * @property {boolean} success - The success status of the request
 * @property {string} message - The message associated with the request
 * @property {Object} data - The data associated with the request
 */


/**
 * @async
 * @function userRegisterController Register a new user by calling the [userRegistrator]{@link module:User/Profile/Service~userRegistrator} function from the service.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 * @return {GeneratedResponse} - The response generated from the Request.
 */
exports.userRegisterController = async (req, res, next) => {

    try {
        const result = await userRegistrator(req.body);

        res.status(201).json(result);

    } catch (error) {
        next(error)
    }
};


/**
 * @async
 * @function userLoginController Handle user login
 * @description Handles user login by validating the request body and calling the [userLoginService]{@link module:User/Profile/Service~userLoginService} function from the service.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 * @return {GeneratedResponse} The response generated from the Request.If successfull a token is attatched in the response data.
 */
exports.userLoginController = async (req, res, next) => {
    try {
        const loginData = await userLoginSchema.validateAsync(req.body);
        const result = await userLoginService(loginData);
        res.status(200).json(result);

    } catch (error) {
        next(error)
    }
};

/**
 * @async
 * @function userLogoutController Logs out the user by destroying the session and returning a success message.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 * @return {Object} - an object with a success status and a message
 */
exports.userLogoutController = (req, res, next) => {
    try {
        req.session.destroy()
        res.status(200)
            .json({
                success: true,
                message: 'Logout success! Goodbye!'
            });
    } catch (error) {
        next(error)
    }
}

/**
 * Controller function for handling user forget password requests.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 * @return {Promise<void>} - Returns a promise that resolves to undefined.
 */
exports.userForgetPasswordController = async (req, res, next) => {

    try {

        const { password, repeatPassword } = req.body;

        const { email } = req.query
        const { password: validPassword } = await passwordSetSchema.validateAsync({ password, repeatPassword })

        const updated = await updatePasswordService(email, validPassword);

        if (updated.success) {
            res.status(200).json(updated);
        }
        else {
            res.status(500).json({ success: false, message: 'something went wrong, try again' });
        }


    } catch (error) {
        next(error);
    }
};

/**
 * Update the user's password and clear OTP.
 * @param {Request} req - The request object.
 * @param {Object} req.body - The request body.
 * @param {string} req.body.email - The email of the user.
 * @param {string} req.body.otp - The OTP code.
 * @param {string} req.body.newPassword - The new password.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 * @return {Object} The response object with a success message.
 */
exports.userUpdatePasswordController = async (req, res, next) => {

    try {
        const userId = req?.user?.id
        const { oldPassword, newPassword, confirmPassword } = req.body;

        if (!oldPassword || !newPassword || !confirmPassword ) {
            return res.status(400).json({ message: "fill all the field, try again" });
        }
        if(newPassword !== confirmPassword) {
            return res.status(400).json({ message: "password mismatch, try again" });
        }
        const user = await userProfileModel.findOne({_id : userId});
        const password = user?.password
        const match = await bcrypt.compare(oldPassword, password);

        if(!match) return res.status(401).json({ message: "password mismatch, try again" });

        await userProfileModel.findOneAndUpdate({_id : userId}, { password: newPassword });
        return res.status(200).json({ success : true, message: "Password Update Successful" })

        
    } catch (error) {
        next(error);

    }
};

/**
 * @async
 * @function userProfileController Retrieves the user profile from the database and sends it as a JSON response.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 * @return {Object} The user profile as a JSON response.
 */
exports.userProfileController = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const profile = await userProfileModel.findById(userId, { password: 0 });

        return res.status(200).json(profile);

    } catch (error) {
        next(error)
    }
};

/**
 * Updates the user profile.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 * @return {Promise<object>} The updated user profile.
 */
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


/**
 * Executes the userEmailVerifyController function.
 * @category User Profile
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @return {Promise} A promise that resolves to the JSON response.
 */
exports.userEmailVerifyController = async (req, res, next) => {
    try {
        const { email } = req.query;
        const result = await userVerifiyService(email);
        res.status(200).json(result);
    } catch (error) {
        next(error)
    }
};


exports.protectedController = async (req, res, next) => {
    try {
        const user = await userProfileModel.findOne(
            { email: req.user.emails[0].value }
        );
        if (user?.password !== undefined) {
            throw createError(409, 'Please login with password')
        }

        if (user?.userType === 'google') {
            const userData = {
                userType: user.userType, email: user.email, id: user._id, role: user.role
            }
            const token = createToken(userData, '24h');

            res.json({
                success: true,
                message: 'login success',
                data: user,
                token
            })
        } else {
            const userProfile = await userProfileModel.create({
                name: req.user.displayName,
                userName: req.user.name.givenName.toLowerCase() + Math.floor(Math.random() * 1000),
                email: req.user.emails[0].value,
                picture: req.user.photos[0].value,
                userType: 'google'
            })

            const userData = {
                userType: userProfile.userType, email: userProfile.email, id: userProfile._id, role: userProfile.role
            }
            const token = createToken(userData, '24h');

            res.status(200).json({
                success: true,
                message: `Hello ${req.user.displayName}`,
                data: userProfile,
                token
            })
        }

    } catch (error) {
        next(error)
    }
};


exports.failureController = async (req, res, next) => {
    try {
        res.status(200).json({
            success: false,
            message: 'Failed to authenticate..',
        })
    } catch (error) {
        next(error)
    }
};
