const { userRegistrationSchema, userLoginSchema } = require("./userProfileValidation");
const { userRegistrator, userLoginService, userProfileUpdateService } = require("./userProfileService");
const userProfileModel = require("./userProfileModel");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const createError = require('http-errors');


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
        res.clearCookie('access_token', { httpOnly: true }).status(200).json({ message: 'Logout successful' });
    } catch (error) {
        next(error);
    }
};

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
