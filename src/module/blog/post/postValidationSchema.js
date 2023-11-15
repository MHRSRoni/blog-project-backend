const joi = require('joi');

const postValidationSchema = joi.object({
    categoryId: joi.string().required(),
    title: joi.string().trim().required(),
    description: joi.string().trim().required(),
    picture: joi.string(),
    react: joi.array()


});

const reactValidationSchema = joi.string().valid('like', 'dislike', 'love').required().messages({
    'any.only': 'Invalid react type'
});

module.exports = {
    postValidationSchema,
    reactValidationSchema
}