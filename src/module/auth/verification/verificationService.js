const sendEmail = require("../../../utils/email")
const userProfileModel = require("../../user/profile/userProfileModel")
const userOtpModel = require("./userOtpModel")
const { generateOtp, encrypt, generateToken } = require("./verificationUtils")




exports.sendOtpService = async (email, subject) => {
    const exist = await userProfileModel.findOne({email})
    if(!exist) {
        return {success : false, message : 'user not found'}
    }
    const otp =  generateOtp() //generate otp
    await userOtpModel.findOneAndUpdate({email},{otp, subject}, {upsert : true})   //save in database
    await sendEmail({to: email, subject, html : `your otp code is ${otp}`}) //send email
    return {success : true, message : 'otp send successfull'}   //response

}



exports.verifyOtpService = async (email, otp, subject) => {
    const exist = await userOtpModel.findOneAndDelete({email, otp, subject})
    if(exist) {
        const encodedText = await encrypt({email, subject})
        const token = await generateToken(encodedText)
        return {success : true, message : 'otp verificaition successfull' , 'access-token' : token}
    }

    return {success : false, message : 'otp verification failed'}
}



