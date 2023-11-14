const Joi = require('joi')

exports.categoryValidationSchema = Joi.object({
    title : Joi.string().trim().required(),
    description : Joi.string().trim(),
    cover : Joi.string().trim()
})



exports.ObjectIdSchema = Joi.string().trim().length(24).required()