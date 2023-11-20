const { sendOtpController, verifyOtpController } = require('./verificationController')

const verificationRouter = require('express').Router()


verificationRouter.get('/send-verification', sendOtpController)

verificationRouter.get('/verify', verifyOtpController)


module.exports = verificationRouter