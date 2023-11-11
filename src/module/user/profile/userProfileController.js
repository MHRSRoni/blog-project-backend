const { userRegistrationSchema, userLoginSchema } = require("./userProfileValidation");
const { userRegistrator, userLoginService } = require("./userProfileService");
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
        res.clearCookie('access_token', { httpOnly: true }).status(200).json({ message: 'Logout successful' });
    } catch (error) {
        next(error);
    }
};
