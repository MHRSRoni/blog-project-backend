const { userLoginSchema, passwordSetSchema } = require("./userProfileValidation");
const { userRegistrator, userLoginService, userVerifiyService, updatePasswordService, userProfileUpdateService } = require("./userProfileService");
const userProfileModel = require("./userProfileModel");
const userOtpModel = require("../../auth/verification/userOtpModel");
const createError = require('http-errors');
const createToken = require("../../../utils/createToken");


exports.userRegisterController = async (req, res, next) => {

    try {
        const result = await userRegistrator(req.body);

        res.status(201).json(result);

    } catch (error) {
        next(error)
    }
};


exports.userEmailVerifyController = async (req, res, next) => {
    try {
        const { email } = req.query;
        const result = await userVerifiyService(email);
        res.status(200).json(result);
    } catch (error) {
        next(error)
    }
};


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
        req.session.destroy()
            .status(200)
            .json({
                success: true,
                message: 'Logout success! Goodbye!'
            });

    } catch (error) {
        next(error);
    }
};

// Password Reset 
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

//!Login With Google

exports.protectedController = async (req, res, next) => {
    try {
        console.log(req.user)
        const user = await userProfileModel.findOne(
            { email: req.user.emails[0].value }
        );
        if (user?.password !== undefined) {
            throw createError(409, 'Please login with password')
        }

        if (user?.userType === 'google') {
            const userData = {
                email: user.email, id: user._id, role: user.role
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
                email: userProfile.email, id: userProfile._id, role: userProfile.role
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
