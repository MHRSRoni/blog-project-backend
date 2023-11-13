const joi = require('joi');

const postValidationSchema = joi.object({
    categoryId: joi.string().required(),
    title: joi.string().trim().required(),
    description: joi.string().trim().required(),
    picture: joi.string(),
    react: joi.array()

})

module.exports = {
    postValidationSchema
}