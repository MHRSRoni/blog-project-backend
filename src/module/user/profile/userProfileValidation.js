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
    picture: Joi.string().messages({
        'string.base': "picture must be a type of text",
    }),
    phone: Joi.string().messages({
        'string.base': "phone must be a type of text",
    }),

})

const userLoginSchema = Joi.object({
    email: Joi.string().email().trim().required().lowercase().messages({
        'string.base': "email must be a type of text",
        'string.empty': 'Please provide an email address',
        'string.email': "email must be a valid email",
        'any.required': "email is a required field",
    }),
    password: Joi.string().required().min(6).messages({
        'string.base': "password must be a type of text",
        'string.min': "password must be 6 characters long",
        'any.required': "password is a required field",
    }),
})


const userPasswordChangeSchema = Joi.object({

    password: Joi.string().required().min(6),
    repeatPassword: Joi.ref('password'),
});
const userEmailSchema = Joi.string().email().trim().required();

// const userOtpVerifySchema = joi.string().email().trim().required


module.exports = {
    userRegistrationSchema,
    userLoginSchema,
    userPasswordChangeSchema,
    userEmailSchema
}