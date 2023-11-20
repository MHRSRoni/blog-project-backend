const Joi = require('joi')

exports.otpSendReqSchema = Joi.object({
    email: Joi.string().email().trim().required().lowercase().messages({
        'string.base' : "email must be a type of text",
        'string.empty': 'Please provide an email address',
        'string.email' : "email must be a valid email",
        'any.required' : "email is a required field",
    }),
    subject : Joi.string().trim().lowercase().valid('forget password', 'email verification').required().messages({
        'string.base' : 'subject must be a type of text',
        'string.empty' : 'Please provide a subject',
        'any.required' : 'subject is a required field',
        'any.only' : 'subject is not valid'
    })
})



exports.otpVerifyReqSchema = Joi.object({
    email: Joi.string().email().trim().required().lowercase().messages({
        'string.base' : "email must be a type of text",
        'string.empty': 'Please provide an email address',
        'string.email' : "email must be a valid email",
        'any.required' : "email is a required field",
    }),
    subject : Joi.string().trim().lowercase().valid('forget password', 'email verification').required().messages({
        'string.base' : 'subject must be a type of text',
        'string.empty' : 'Please provide a subject',
        'any.required' : 'subject is a required field',
        'any.only' : 'subject is not valid'
    }),
    otp : Joi.string().trim().length(6).required().messages({
        'string.base' : 'otp must be a type of text',
        'string.empty' : 'Please provide OTP',
        'any.required' : 'OTP is a required field',
        'any.length' : 'Invalid OTP'
    })
})