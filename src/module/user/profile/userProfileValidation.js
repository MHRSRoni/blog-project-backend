const joi = require('joi');

const userRegistrationSchema = joi.object({
    name: joi.string().trim().required(),
    userName: joi.string().trim().required().lowercase(),
    email: joi.string().email().trim().required().lowercase(),
    password: joi.string().required().min(6),
    repeatPassword: joi.ref('password'),
    picture: joi.string(),
    phone: joi.string(),

})

const userLoginSchema = joi.object({
    email: joi.string().email().trim().required().lowercase(),
    password: joi.string().required().min(6),
})


const userPasswordChangeSchema = joi.object({

    password: joi.string().required().min(6),
    repeatPassword: joi.ref('password'),
});
const userEmailSchema = joi.string().email().trim().required();

// const userOtpVerifySchema = joi.string().email().trim().required


module.exports = {
    userRegistrationSchema,
    userLoginSchema,
    userPasswordChangeSchema,
    userEmailSchema
}