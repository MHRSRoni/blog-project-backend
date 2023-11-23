const Joi = require('joi');


const userRegistrationSchema = Joi.object({
    name: Joi.string().trim().required().messages({
        'string.base': "Name must be a type of text",
        'any.required': "Name is a required field",
    }),
    userName: Joi.string().trim().required().lowercase().messages({
        'string.base': "userName must be a type of text",
        'any.required': "userName is a required field",
    }),
    email: Joi.string().email().trim().required().lowercase().messages({
        'string.base': "email must be a type of text",
        'string.email': "email must be a valid email",
        'string.empty': 'Please provide an email address',
        'any.required': "email is a required field",
    }),
    password: Joi.string().required().min(6).messages({
        'string.base': "password must be a type of text",
        'string.min': "password must be 6 characters long",
        'any.required': "password is a required field",
    }),
    repeatPassword: Joi.string().valid(Joi.ref('password')).required().messages({
        'any.only': 'passwords do not match',
        'any.required': "repeat password is a required field",
    }),
    picture: Joi.string()
})

exports.userLoginSchema = Joi.object({
    email: Joi.string().email().trim().required().lowercase().messages({
        'string.base': "email must be a type of text",
        'string.email': "email must be a valid email",
        'string.empty': 'Please provide an email address',
        'any.required': "email is a required field",
    }),
    password: Joi.string().required().min(6).messages({
        'string.base': "password must be a type of text",
        'string.min': "password must be 6 characters long",
        'any.required': "password is a required field",
    })
})


exports.userPasswordChangeSchema = Joi.object({

    password: Joi.string().required().min(6).messages({
        'string.base': "password must be a type of text",
        'string.min': "password must be 6 characters long",
        'any.required': "password is a required field",
    }),
    newPassword: Joi.string().required().min(6).messages({
        'string.base': "new password must be a type of text",
        'string.min': "new password must be 6 characters long",
        'any.required': "new password is a required field",
    }),
    repeatPassword: Joi.string().valid(Joi.ref('password')).required().messages({
        'any.only': 'passwords do not match',
        'any.required': "repeat password is a required field",
    }),

})



exports.passwordSetSchema = Joi.object({
    password: Joi.string().required().min(6).messages({
        'string.base': "password must be a type of text",
        'string.min': "password must be 6 characters long",
        'any.required': "password is a required field",
    }),
    repeatPassword: Joi.string().required().min(6).messages({
        'string.base': "password must be a type of text",
        'string.min': "password must be 6 characters long",
        'any.required': "password is a required field",
    }),
})


exports.userEmailSchema = Joi.string().email().trim().required();

// const userOtpVerifySchema = joi.string().email().trim().required

const validateCreateUserdata = async (req, res, next) => {
    try {

        const data = await userRegistrationSchema.validateAsync(req.body)
        req.body = data;
        console.log('before data')
        next();
    } catch (error) {
        console.log('error', error)
        next(error)
    }
}

module.exports = {
    validateCreateUserdata
}