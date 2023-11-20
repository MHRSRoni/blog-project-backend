const { sendOtpService, verifyOtpService } = require("./verificationService")
const { otpSendReqSchema, otpVerifyReqSchema } = require("./verificationValidation")

exports.sendOtpController = async(req, res, next) =>{
    try {
        const {email, subject} = req.query 
        const {email : validEmail, subject : validSubject} = await otpSendReqSchema.validateAsync({email, subject})
        const result = await sendOtpService(validEmail, validSubject)
        
        res.status(200).json(result)

    } catch (error) {
        next(error)
    }
}


exports.verifyOtpController = async (req, res, next) =>{
    try {
        const {email, otp, subject} = req.query
        const {email : validEmail,subject : validSubject,otp : validOtp} = await otpVerifyReqSchema.validateAsync({email, otp, subject})
        const result = await verifyOtpService(validEmail, validOtp, validSubject)

        res.status(200).json(result)

    } catch (error) {
        next(error)
    }
}