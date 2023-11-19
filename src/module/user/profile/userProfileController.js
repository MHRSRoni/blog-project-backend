const { userRegistrationSchema, userLoginSchema, otpSendReqSchema, passwordSetSchema } = require("./userProfileValidation");
const { userRegistrator, userLoginService, userOtpService, otpVerifyService, userVerifiyService, updatePasswordService, userProfileUpdateService } = require("./userProfileService");
const userProfileModel = require("./userProfileModel");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const sendEmail = require("../../../utils/email");
const userOtpModel = require("./userOtpModel");
const { generateToken } = require("../../../utils/generateToken");


exports.userRegisterController = async (req, res, next) => {

    try {
        const userData = req.body;
        const verifiedData = await userRegistrationSchema.validateAsync(userData);

        const registered = await userRegistrator(verifiedData);
        if(registered.success){
            const result = await userOtpService(verifiedData.email, "Registration OTP");
            res.status(201).json(result);
        }
        
        res.status(500).json({status : false , message : 'something went wrong, try again'});

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




exports.otpSendController = async (req, res, next) => {

    try {
        const {email, subject} = req.query

        const {email : validEmail,subject : validSubject} = await otpSendReqSchema.validateAsync({email, subject})

        const result = await userOtpService(validEmail, validSubject);
        res.status(200).json(result);

    } catch (error) {
        next(error)
    }
}

// otp verifyController
exports.otpVerifyController = async (req, res, next) => {
    try {
        const { email, otp, subject } = req.query;
        // Verify OTP
        const {email : validEmail,subject : validSubject} = await otpSendReqSchema.validateAsync({email, subject})
        const otpVerified = await otpVerifyService(validEmail, otp);

        if(otpVerified.success){
            // const verified = await generateToken({email : validEmail,subject : validSubject})
            if(validSubject ==  'verify email'){
                await userVerifiyService(validEmail);
                return res.status(200).json({success : true, message : 'Email verified successfully'});
            }

            await userOtpModel.findOneAndUpdate({email : validEmail}, {token : verified})
            res.status(200).json({success : true, message : 'OTP verified successfully', token : verified});
        }

        res.status(500).json({success : false, message : 'something went wrong, try again'});
    } catch (error) {
        next(error);
    }
};


// Password Reset 

exports.userForgetPasswordController = async (req, res, next) => {
    
    try {

        const {token} = req.query;
        const {password , repeatPassword} = req.body;

        const {email, subject} = jwt.verify(token, process.env.JWT_SECRET);

        if(subject == 'forget password'){
            const {password : validPassword} = await passwordSetSchema.validateAsync({password, repeatPassword})

            const updated = await updatePasswordService(email, validPassword);

            if(updated.success){
                res.status(200).json(updated);
            }
            else{
                res.status(500).json({success : false, message : 'something went wrong, try again'});
            }
            
        }

        return res.status(500).json({success : false, message : 'something went wrong, try again'});

        
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
